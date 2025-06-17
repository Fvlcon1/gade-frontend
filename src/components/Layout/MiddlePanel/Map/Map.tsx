'use client';
import React, { useEffect, useState, useRef } from 'react';
import { MdMap } from "react-icons/md";
import Text from '@styles/components/text';
import theme from '@styles/theme';
import dynamic from 'next/dynamic';


// Dynamically import map
const InteractiveMapClient = dynamic(() => import('./InteractiveMapClient'), {
  ssr: false,
});

const Map = () => {
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    // Delay rendering pill to avoid interfering with map init
    const timer = setTimeout(() => setMapReady(true), 300); // 300ms delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-[947px] h-[426px] mt-3">
      {/* Header */}
      <div className="w-full h-[46px] bg-[var(--color-bg-secondary)] flex items-center px-3 gap-4 rounded-t-[10px]">
        <div className="flex items-center gap-2">
          <div className="w-[25px] h-[25px] bg-[var(--main-primary-20)] rounded-[8px] flex items-center justify-center">
            <MdMap className="w-[14px] h-[14px] text-[var(--color-main-primary)]" />
          </div>
          <Text
            size={theme.text.size.SM}
            bold={theme.text.bold.md}
            className="!text-[var(--color-main-primary)] cursor-pointer"
          >
            Interactive Map
          </Text>
        </div>

        <div className="h-[20px] w-[1px] bg-[var(--color-main-primary)] opacity-10" />

        <Text className="text-[14px] font-normal text-[var(--color-text-tetiary)] cursor-pointer">
          Interactively view recent reports
        </Text>
      </div>

      {/* Map Container */}
      <div className="w-full h-[380px] rounded-[9px] relative">
        <InteractiveMapClient 
          mapRef={mapRef}
          activeBasemap="osm"
          activeFeatureLayers={[
            { id: 'reports', label: 'Reports', checked: true },
            { id: 'rivers', label: 'Rivers', checked: true },
            { id: 'mining_sites', label: 'Mining Sites', checked: true },
            { id: 'forest', label: 'Forest Reserves', checked: true },
            { id: 'admin', label: 'Districts', checked: true },        
          ]}
        />
      </div>
    </div>
  );
};

export default Map;
