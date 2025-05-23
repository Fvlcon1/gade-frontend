'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LeftPanel from "@components/layout/LeftPanel/LeftPanel";
import { FaLayerGroup, FaMapMarkerAlt, FaChartBar } from 'react-icons/fa';
import { FaSliders } from "react-icons/fa6";
import { BsFillClockFill } from "react-icons/bs";
import LayersControl from '../../components/Controllers/LayersControl';
import MarkersControl from '../../components/Controllers/MarkersControl';
import { motion } from 'framer-motion';

// Dynamic import for the map component
const InteractiveMapClient = dynamic(() => import('./InteractiveMapClient'), {
  ssr: false,
});

const Page = () => {
  const [mapReady, setMapReady] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMapReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleTabClick = (tabName) => {
    if (tabName === 'layers') {
      setShowLayers(!showLayers);
      setShowMarkers(false);
      setActiveTab(activeTab === 'layers' ? null : 'layers');
    } else if (tabName === 'marker') {
      setShowMarkers(!showMarkers);
      setShowLayers(false);
      setActiveTab(activeTab === 'marker' ? null : 'marker');
    } else {
      setShowLayers(false);
      setShowMarkers(false);
      setActiveTab(activeTab === tabName ? null : tabName);
    }
  };

  // Calculate positions based on sidebar state
  const floatingNavLeft = sidebarExpanded ? '232px' : '72px'; // 214px sidebar + 18px gap when expanded
  const layersControlLeft = sidebarExpanded ? '296px' : '136px'; // floatingNavLeft + 64px gap

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {mapReady && <InteractiveMapClient />}
      
      {/* Left Panel */}
      <div className="absolute top-0 left-1.5 z-[1001] h-full">
        <LeftPanel onExpandChange={setSidebarExpanded} />
      </div>
      
      {/* Floating Navigation */}
      <motion.div
        animate={{ left: floatingNavLeft }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute top-[10px] z-[1001] w-[54px] h-[127px] bg-white/40 backdrop-blur-md rounded-xl shadow-md flex flex-col items-center justify-around p-2"
      >
        <ToolButton 
          icon={<FaLayerGroup size={16} />} 
          isActive={activeTab === 'layers'} 
          onClick={() => handleTabClick('layers')}
        />
        <ToolButton 
          icon={<FaSliders size={16} />} 
          isActive={activeTab === 'marker'} 
          onClick={() => handleTabClick('marker')}
        />
        <ToolButton 
          icon={<BsFillClockFill size={16} />} 
          isActive={activeTab === 'chart'} 
          onClick={() => handleTabClick('chart')}
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
      
      <div className="absolute bottom-6 left-20 z-[1001] bg-[#1C64F2] text-white text-sm font-bold px-2 py-1 rounded">
        54 × 127
      </div>
    </div>
  );
};

// Tool Button Component
const ToolButton = ({ icon, isActive, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className={`flex items-center justify-center rounded-md ${
      isActive 
        ? 'text-[var(--color-main-primary)] bg-[rgba(96,96,208,0.2)] w-[36px] h-[36px]' 
        : 'text-[var(--color-text-tetiary)] w-[24px] h-[24px]'
    }`}
    onClick={onClick}
  >
    {icon}
  </motion.button>
);

export default Page;