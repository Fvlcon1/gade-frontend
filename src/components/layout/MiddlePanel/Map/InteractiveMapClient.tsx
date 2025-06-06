"use client";
import React, { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { useSpatialStore } from '@/lib/store/spatialStore';

const MouseCoordinateDisplay = () => {
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
    <div className="absolute bottom-0 left-0 right-0 bg-gray-800 text-white text-xs p-1 text-center z-[1001]">
      {coordinates ? (
        `Lat: ${coordinates.lat.toFixed(4)}, Lng: ${coordinates.lng.toFixed(4)}`
      ) : (
        'Move mouse over map to see coordinates'
      )}
    </div>
  );
};

interface Layer {
  id: string;
  label: string;
  checked: boolean;
}

interface MapContainerProps {
  mapRef: React.RefObject<any>;
  activeBasemap: string;
  activeFeatureLayers: Layer[];
}

interface LayerProps {
  activeBasemap: string;
  activeFeatureLayers: Layer[];
}

// Basemap URLs
const BASEMAP_URLS = {
  osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  satellite: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  planet: `https://tiles.planet.com/basemaps/v1/planet-tiles/global_monthly_2023_01_mosaic/gmap/{z}/{x}/{y}.png?api_key=${process.env.NEXT_PUBLIC_PL_KEY}`, // Replace with actual API key
};

// Layer styles
const LAYER_STYLES = {
  mining_sites: {
    color: "#FF4B4B",
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.2,
  },
  forest: {
    color: "#4CAF50",
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.2,
  },
  admin: {
    color: "#D2B48C",
    weight: 1,
    opacity: 0.6,
    fillOpacity: 0.2,
  },
  rivers: {
    color: "#03A9F4",
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.3,
  },
};

// Highlight styles (kept for reference but no longer used for hover)
const HIGHLIGHT_STYLE = {
  mining_sites: {
    color: "#FF6B6B", // Brighter red
    weight: 3,
    opacity: 1,
    fillOpacity: 0.4,
  },
  forest: {
    color: "#66BB6A", // Brighter green
    weight: 3,
    opacity: 1,
    fillOpacity: 0.4,
  },
  admin: {
    color: "#FFA500", // Orange
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.4,
  },
  rivers: {
    color: "#29B6F6", // Brighter blue
    weight: 3,
    opacity: 1,
    fillOpacity: 0.5,
  }
};

// Add custom styles for tooltips
const tooltipStyles = `
  .leaflet-tooltip {
    padding: 4px 8px !important;
    font-size: 12px !important;
    line-height: 1.2 !important;
    margin: 0 !important;
    background: rgba(255, 255, 255, 0.95) !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 4px !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
  }

  .leaflet-tooltip-top:before {
    border-top-color: #e5e7eb !important;
  }

  .leaflet-tooltip-bottom:before {
    border-bottom-color: #e5e7eb !important;
  }
`;

const MapLayers: React.FC<LayerProps> = ({ activeBasemap, activeFeatureLayers }) => {
  const { 
    miningSites,
    filteredMiningSites,
    filteredDistricts,
    districts, 
    forestReserves, 
    rivers, 
    isLoading, 
    error, 
    selectedDistricts,
    highlightedDistricts,
    dateRange,
    applyFilters 
  } = useSpatialStore();

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [selectedDistricts, dateRange, applyFilters]);

  // Memoize filtered data to prevent unnecessary recalculations
  const filteredLayerData = useMemo(() => {
    if (!filteredDistricts || !filteredMiningSites) return {};

    return {
      mining_sites: filteredMiningSites, // Use store's filtered data directly
      forest: forestReserves,
      admin: filteredDistricts,
      rivers: rivers,
    };
  }, [filteredDistricts, filteredMiningSites, forestReserves, rivers]);

  // Style for districts based on selection and highlighting
  const getDistrictStyle = (feature: any) => {
    const district = feature.properties.district;
    const isHighlighted = highlightedDistricts.includes(district);
    const isSelected = selectedDistricts.includes(district);

    // If no districts are selected, show all with default style
    if (selectedDistricts.length === 0) {
      return isHighlighted ? HIGHLIGHT_STYLE.admin : LAYER_STYLES.admin;
    }

    // If districts are selected, only show selected ones
    if (!isSelected) {
      return { ...LAYER_STYLES.admin, opacity: 0, fillOpacity: 0 };
    }

    return isHighlighted ? HIGHLIGHT_STYLE.admin : {
      color: "var(--color-main-primary)", // Using project's primary color
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.3,
    };
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-[1000]">
        <div className="loader" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-[1000]">
        <div className="text-red-500">Error loading map data</div>
      </div>
    );
  }

  return (
    <>
      {/* Basemap */}
      <TileLayer
        url={BASEMAP_URLS[activeBasemap]}
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Feature Layers */}
      {activeFeatureLayers.map((layer) => {
        const data = filteredLayerData[layer.id];
        if (!layer.checked || !data) return null;

        // For districts layer
        if (layer.id === 'admin') {
          return (
            <GeoJSON
              key={layer.id}
              data={data}
              style={(feature) => getDistrictStyle(feature)}
              onEachFeature={(feature, leafletLayer) => {
                const district = feature.properties.district;
                const isSelected = selectedDistricts.includes(district);
                
                // Only add tooltip if district is selected or no districts are selected
                if (selectedDistricts.length === 0 || isSelected) {
                  // Add tooltip with district and region info in a more compact format
                  const tooltipContent = feature.properties.region 
                    ? `${district} • ${feature.properties.region}`
                    : district;
                  leafletLayer.bindTooltip(tooltipContent, {
                    permanent: false,
                    direction: 'top',
                    offset: [0, -5],
                    className: 'district-tooltip'
                  });
                }
              }}
            />
          );
        }

        // For mining sites layer
        if (layer.id === 'mining_sites') {
          return (
            <GeoJSON
              key={layer.id}
              data={data}
              style={LAYER_STYLES[layer.id]}
              onEachFeature={(feature, leafletLayer) => {
                // Add tooltip with detection date and district
                const date = new Date(feature.properties.detected_date).toLocaleDateString();
                const tooltipContent = `Detected: ${date}${feature.properties.district ? `\nDistrict: ${feature.properties.district}` : ''}`;
                leafletLayer.bindTooltip(tooltipContent);
              }}
            />
          );
        }

        // For other layers (forest, rivers)
        return (
          <GeoJSON
            key={layer.id}
            data={data}
            style={LAYER_STYLES[layer.id]}
            onEachFeature={(feature, leafletLayer) => {
              leafletLayer.bindTooltip(feature.properties.name || 'Unnamed');
            }}
          />
        );
      })}
    </>
  );
};

// Add custom styles for responsive zoom controls
const zoomControlStyles = `
  .leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
  }
  
  .leaflet-control-zoom a {
    width: 36px !important;
    height: 36px !important;
    line-height: 36px !important;
    font-size: 20px !important;
    background-color: white !important;
    color: #374151 !important;
    border: 1px solid #e5e7eb !important;
  }

  .leaflet-control-zoom a:hover {
    background-color: #f9fafb !important;
    color: #1f2937 !important;
  }

  .leaflet-control-zoom-in {
    border-radius: 4px 4px 0 0 !important;
  }

  .leaflet-control-zoom-out {
    border-radius: 0 0 4px 4px !important;
  }

  @media (max-width: 640px) {
    .leaflet-control-zoom {
      margin: 12px !important;
    }
    
    .leaflet-control-zoom a {
      width: 32px !important;
      height: 32px !important;
      line-height: 32px !important;
      font-size: 18px !important;
    }
  }

  @media (max-width: 480px) {
    .leaflet-control-zoom {
      margin: 8px !important;
    }
    
    .leaflet-control-zoom a {
      width: 28px !important;
      height: 28px !important;
      line-height: 28px !important;
      font-size: 16px !important;
    }
  }
`;

const InteractiveMapClient: React.FC<MapContainerProps> = ({ mapRef, activeBasemap, activeFeatureLayers }) => {
  return (
    <div className="relative w-full h-full">
      <style>{zoomControlStyles}</style>
      <style>{tooltipStyles}</style>
      <MapContainer
        center={[4.9016, -1.7831]}
        zoom={11}
        scrollWheelZoom={true}
        zoomControl={true}
        className="w-full h-full rounded-b-xl z-0"
        ref={mapRef}
      >
        <MapLayers 
          activeBasemap={activeBasemap}
          activeFeatureLayers={activeFeatureLayers}
        />
        <MouseCoordinateDisplay />
      </MapContainer>
    </div>
  );
};

export default InteractiveMapClient;