"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { FaLayerGroup, FaLocationArrow } from "react-icons/fa";
import { FaSliders } from "react-icons/fa6";
import { BsFillClockFill } from "react-icons/bs";

import LeftPanel from "@components/Layout/LeftPanel/LeftPanel";
import LayersControl from "../../components/Controllers/LayersControl";
import MarkersControl from "../../components/Controllers/MarkersControl/MarkersControl";
import TimelineController from "../../components/Controllers/timeline-controller/TimelineController";
import { initialLayers } from "../../components/Controllers/LayersControl";
import { useSpatialStore } from "@/lib/store/spatial-store";
import { useAuthStore } from "@/lib/store/auth-store";

const InteractiveMapClient = dynamic(() => import("../../components/Layout/MiddlePanel/Map/InteractiveMapClient"), {
  ssr: false,
});

interface Layer {
  id: string;
  label: string;
  checked: boolean;
}

const Page = () => {
  const mapRef = useRef(null);
  const { months } = useSpatialStore();

  const [mapReady, setMapReady] = useState(false);
  const [showLayers, setShowLayers] = useState(true);
  const [showMarkers, setShowMarkers] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [activeTab, setActiveTab] = useState("layers");
  const [activeBasemap, setActiveBasemap] = useState('cartocdnLight');
  const [previousBasemap, setPreviousBasemap] = useState('cartocdnLight');
  const [activeFeatureLayers, setActiveFeatureLayers] = useState<Layer[]>(initialLayers.filter(layer => layer.checked));
  const [timelineMode, setTimelineMode] = useState<'timeline' | 'comparison' | null>(null);
  const now = new Date();
  const currentMonth = now.getMonth();
  const [timelineRange, setTimelineRange] = useState<[number, number]>([0, months.length - 1]);
  const [lastUserRange, setLastUserRange] = useState<[number, number]>([0, months.length - 1]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [playhead, setPlayhead] = useState<number | null>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [comparisonActive, setComparisonActive] = useState(false);
  const [comparisonStartDate, setComparisonStartDate] = useState<string | null>(null);
  const [comparisonEndDate, setComparisonEndDate] = useState<string | null>(null);
  const { sidebarExpanded } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => setMapReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setTimelineRange([0, months.length - 1]);
    setLastUserRange([0, months.length - 1]);
  }, [months]);

  const handleBasemapChange = useCallback((basemapId: string) => {
    setActiveBasemap(basemapId);
  }, []);

  const handleLayerChange = useCallback((layers: Layer[]) => {
    setTimeout(() => {
      setActiveFeatureLayers(layers.filter(layer => layer.checked));
    }, 0);
  }, []);

  const handleTimelineModeChange = useCallback((mode: 'timeline' | 'comparison' | null) => {
    setTimelineMode(mode);
    if (mode !== 'timeline') {
      setIsPlaying(false);
      setPlayhead(0);
    }
  }, []);

  const handleTimelineRangeChange = useCallback((index: number, value: number) => {
    setTimelineRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = value;
      if (newRange[0] <= newRange[1]) {
        if (!isPlaying) setLastUserRange(newRange);
        return newRange;
      }
      return prev;
    });
  }, [isPlaying]);

  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setPlayhead(timelineRange[0]);
  }, [timelineRange]);

  // Reset playhead to new start month if range changes while playing
  useEffect(() => {
    if (isPlaying) {
      setPlayhead(timelineRange[0]);
    }
  }, [timelineRange, isPlaying]);

  // Restore last user-set range after play ends
  useEffect(() => {
    if (!isPlaying && playhead === null) {
      setTimelineRange(lastUserRange);
    }
    // eslint-disable-next-line
  }, [isPlaying, playhead, lastUserRange]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    setPlayhead(0);
  }, []);

  const handlePlayheadChange = useCallback((newPlayhead: number) => {
    setPlayhead(newPlayhead);
  }, []);

  const handleTabClick = (tabName: string) => {
    if (tabName === "layers") {
      setShowLayers(!showLayers);
      setShowMarkers(false);
      setShowTimeline(false);
      setActiveTab(activeTab === "layers" ? null : "layers");
      setIsPlaying(false);
      setPlayhead(0);
      setTimelineMode(null);
    } else if (tabName === "marker") {
      setShowMarkers(!showMarkers);
      setShowLayers(false);
      setShowTimeline(false);
      setActiveTab(activeTab === "marker" ? null : "marker");
      setIsPlaying(false);
      setPlayhead(0);
      setTimelineMode(null);
    } else if (tabName === "chart") {
      setShowTimeline(!showTimeline);
      setShowLayers(false);
      setShowMarkers(false);
      setActiveTab(activeTab === "chart" ? null : "chart");
    } else {
      setShowLayers(false);
      setShowMarkers(false);
      setShowTimeline(false);
      setActiveTab(null);
      setIsPlaying(false);
      setPlayhead(0);
      setTimelineMode(null);
    }
  };

  const handleResetTimeline = useCallback(() => {
    setTimelineRange([0, currentMonth]);
    setLastUserRange([0, currentMonth]);
    setIsPlaying(false);
    setPlayhead(0);
  }, []);

  const handleCompare = (start: string, end: string) => {
    setComparisonStartDate(start);
    setComparisonEndDate(end);
    setComparisonActive(true);
    setTimelineMode('comparison');
  };

  const floatingNavLeft = sidebarExpanded ? "268px" : "72px";

  // Correct basemap switching logic
  useEffect(() => {
    if (timelineMode === 'timeline' || timelineMode === 'comparison') {
      if (activeBasemap !== 'planet') {
        setPreviousBasemap(activeBasemap);
        setActiveBasemap('planet');
      }
    } else {
      if (activeBasemap === 'planet') {
        setActiveBasemap(previousBasemap);
      }
    }
    // eslint-disable-next-line
  }, [timelineMode]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {mapReady && (
        <InteractiveMapClient
          mapRef={mapRef}
          activeBasemap={activeBasemap}
          activeFeatureLayers={activeFeatureLayers}
          timelineMode={timelineMode}
          onTimelineModeChange={handleTimelineModeChange}
          sidebarExpanded={sidebarExpanded}
          timelineRange={timelineRange}
          onTimelineRangeChange={handleTimelineRangeChange}
          selectedYear={selectedYear}
          playhead={playhead}
          isPlaying={isPlaying}
          comparisonActive={comparisonActive}
          comparisonStartDate={comparisonStartDate}
          comparisonEndDate={comparisonEndDate}
        />
      )}

      {/* Left Panel */}
      <div className="absolute top-0 left-1.5 z-[1001] h-full py-2 shadow-xl">
        <LeftPanel />
      </div>

      {/* Floating Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ left: floatingNavLeft }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute top-[10px] z-[1001] bg-white/90 backdrop-blur-sm rounded-xl gap-0.5 shadow-xl flex flex-col items-center justify-around p-2"
      >
        <ToolButton
          icon={<FaLayerGroup size={16} />}
          isActive={activeTab === "layers"}
          onClick={() => handleTabClick("layers")}
        />
        <ToolButton
          icon={<FaSliders size={16} />}
          isActive={activeTab === "marker"}
          onClick={() => handleTabClick("marker")}
        />
        <ToolButton
          icon={<BsFillClockFill size={16} />}
          isActive={activeTab === "chart"}
          onClick={() => handleTabClick("chart")}
        />
      </motion.div>

      {/* Floating Layers Panel */}
      <LayersControl
        isOpen={showLayers}
        sidebarExpanded={sidebarExpanded}
        onClose={() => {
          setShowLayers(false);
          setActiveTab(null);
        }}
        onBasemapChange={handleBasemapChange}
        onLayerChange={handleLayerChange}
      />

      {/* Floating Markers Panel */}
      <MarkersControl
        isOpen={showMarkers}
        sidebarExpanded={sidebarExpanded}
        onClose={() => {
          setShowMarkers(false);
          setActiveTab(null);
        }}
      />

      {/* Floating Timeline Panel */}
      {showTimeline && (
        <TimelineController
          isOpen={showTimeline}
          sidebarExpanded={sidebarExpanded}
          onClose={() => {
            setShowTimeline(false);
            setActiveTab(null);
            setTimelineMode(null);
          }}
          onModeChange={handleTimelineModeChange}
          range={timelineRange}
          onRangeChange={handleTimelineRangeChange}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
          playhead={playhead}
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onPlayheadChange={handlePlayheadChange}
          onReset={handleResetTimeline}
          onCompare={handleCompare}
          comparisonStartDate={comparisonStartDate}
          comparisonEndDate={comparisonEndDate}
        />
      )}

      {/* Zoom Buttons */}
      <div className="fixed right-4 top-4 z-[1001] bg-white/90 text-sm font-bold w-[30px] rounded-[10px] shadow-sm">
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={() => mapRef.current?.zoomIn()}
            className="text-[var(--color-text-tetiary)] text-lg leading-none p-2 rounded cursor-pointer hover:bg-gray-100 w-full"
          >
            +
          </button>

          <div className="w-full h-[1px] bg-[#b4adad]" />

          <button
            onClick={() => mapRef.current?.zoomOut()}
            className="text-[var(--color-text-tetiary)] text-xl leading-none p-2 rounded cursor-pointer hover:bg-gray-100 w-full"
          >
            −
          </button>
        </div>

        <div className="w-full h-[1px] bg-[#b4adad]" />
        <div className="mt-1 w-full h-[30px] bg-white/90 rounded-[10px] flex items-center text-gray-500 justify-center cursor-pointer hover:bg-gray-100">
          <FaLocationArrow size={10} />
        </div>
      </div>

    </div>
  );
};

// Tool Button Component
const ToolButton = ({ icon, isActive, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={`flex items-center justify-center rounded-md cursor-pointer w-[36px] h-[36px] ${isActive
      ? "text-[var(--color-main-primary)] bg-main-primary/20"
      : "text-[var(--color-text-tetiary)] hover:bg-gray-200"
      }`}
    onClick={onClick}
  >
    {icon}
  </motion.button>
);

export default Page;
