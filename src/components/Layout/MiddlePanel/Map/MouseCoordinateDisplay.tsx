"use client";
import React, { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import theme from "@styles/theme";
import Text from "@styles/components/text";

const MouseCoordinateDisplay: React.FC = () => {
  const map = useMap();
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!map) return;

    const onMouseMove = (e: any) => {
      setCoordinates(e.latlng);
    };

    map.on('mousemove', onMouseMove);

    return () => {
      map.off('mousemove', onMouseMove);
    };
  }, [map]);

  return (
    <div className="absolute bottom-2 left-16 rounded-md px-3 right-4 bg-bg-primary/80 backdrop-blur-sm p-1 flex items-center justify-between z-[1001]">
      <Text bold={theme.text.bold.md}>
        GADE - Galamsey Detection System
      </Text>
      <Text>
        {coordinates ? (
          `Lat: ${coordinates.lat.toFixed(4)}, Lng: ${coordinates.lng.toFixed(4)}`
        ) : (
          'Move mouse over map to see coordinates'
        )}
      </Text>
      <Text>
        Zoom level: {map.getZoom()}
      </Text>
    </div>
  );
};

export default MouseCoordinateDisplay; 