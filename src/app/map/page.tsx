"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { FaLayerGroup, FaMapMarkerAlt, FaChartBar, FaLocationArrow } from "react-icons/fa";
import { FaSliders } from "react-icons/fa6";
import { BsFillClockFill } from "react-icons/bs";

import LeftPanel from "@components/layout/LeftPanel/LeftPanel";
import LayersControl from "../../components/Controllers/LayersControl";
import MarkersControl from "../../components/Controllers/MarkersControl";
import TimelineController from "../../components/Controllers/TimelineController";
import ComparisonSlider from "../../components/Controllers/ComparisonSlider";
import { initialLayers } from "../../components/Controllers/LayersControl";

const InteractiveMapClient = dynamic(() => import("./InteractiveMapClient"), {
  ssr: false,
});

interface Layer {
  id: string;
  label: string;
  checked: boolean;
}

const Page = () => {
  const mapRef = useRef(null);

  const [mapReady, setMapReady] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeBasemap, setActiveBasemap] = useState('osm');
  const [activeFeatureLayers, setActiveFeatureLayers] = useState<Layer[]>(initialLayers.filter(layer => layer.checked));

  useEffect(() => {
    const timer = setTimeout(() => setMapReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleBasemapChange = useCallback((basemapId: string) => {
    setActiveBasemap(basemapId);
  }, []);

  const handleLayerChange = useCallback((layers: Layer[]) => {
    // Use a timeout to avoid state updates during render
    setTimeout(() => {
      setActiveFeatureLayers(layers.filter(layer => layer.checked));
    }, 0);
  }, []);

  const handleTabClick = (tabName) => {
    if (tabName === "layers") {
      setShowLayers(!showLayers);
      setShowMarkers(false);
      setShowTimeline(false);
      setActiveTab(activeTab === "layers" ? null : "layers");
    } else if (tabName === "marker") {
      setShowMarkers(!showMarkers);
      setShowLayers(false);
      setShowTimeline(false);
      setActiveTab(activeTab === "marker" ? null : "marker");
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
    }
  };

  const floatingNavLeft = sidebarExpanded ? "232px" : "72px";

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {mapReady && (
        <InteractiveMapClient 
          mapRef={mapRef}
          activeBasemap={activeBasemap}
          activeFeatureLayers={activeFeatureLayers}
        />
      )}

      {/* Left Panel */}
      <div className="absolute top-0 left-1.5 z-[1001] h-full">
        <LeftPanel onExpandChange={setSidebarExpanded} />
      </div>

      {/* Floating Navigation */}
      <motion.div
        animate={{ left: floatingNavLeft }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute top-[10px] z-[1001] w-[54px] h-[127px] bg-white/90 backdrop-blur-md rounded-xl shadow-md flex flex-col items-center justify-around p-2"
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
          }}
        />
      )}

      {/* Zoom Buttons */}
      <div className="absolute top-[10px] left-[1398px] z-[1001] bg-white/90 text-sm font-bold w-[30px] h-[71px] rounded-[10px]">
        <div className="flex flex-col items-center justify-center h-full">
          <button
            onClick={() => mapRef.current?.zoomIn()}
            className="text-[var(--color-text-tetiary)] text-lg leading-none p-2 rounded cursor-pointer hover:bg-gray-100"
          >
            +
          </button>

          <div className="w-full h-[13px] bg-[#b4adad]" />

          <button
            onClick={() => mapRef.current?.zoomOut()}
            className="text-[var(--color-text-tetiary)] text-xl leading-none p-2 rounded cursor-pointer hover:bg-gray-100"
          >
            −
          </button>
        </div>

        <div className="mt-4 w-[30px] h-[30px] bg-white/90 rounded-[10px] flex items-center text-gray-500 justify-center cursor-pointer hover:bg-gray-100">
          <FaLocationArrow size={10} />
        </div>
      </div>

      {/* Comparison Slider Overlay */}
      <ComparisonSlider isVisible={showTimeline} sidebarExpanded={sidebarExpanded} />
    </div>
  );
};

// Tool Button Component
const ToolButton = ({ icon, isActive, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={`flex items-center justify-center rounded-md cursor-pointer ${
      isActive
        ? "text-[var(--color-main-primary)] bg-[rgba(96,96,208,0.2)] w-[36px] h-[36px]"
        : "text-[var(--color-text-tetiary)] w-[24px] h-[24px] hover:bg-gray-100"
    }`}
    onClick={onClick}
  >
    {icon}
  </motion.button>
);

export default Page;
