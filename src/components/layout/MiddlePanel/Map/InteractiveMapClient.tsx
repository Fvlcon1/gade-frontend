// components/InteractiveMapClient.tsx
"use client";
import React, { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { useSpatialStore } from '@/lib/store/spatialStore';
import type { Layer as LeafletLayer } from 'leaflet';

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

// Removed: Component to add drawing and print controls
// Removed: const MapControls = () => {
// Removed:   const map = useMap();
// Removed:   // Use state to hold the feature group, initializing as null
// Removed:   const [editableFeatureGroup, setEditableFeatureGroup] = useState<L.FeatureGroup | null>(null);

// Removed:   useEffect(() => {
// Removed:     if (!map) return;

// Removed:     // Create and add the feature group to the map
// Removed:     const featureGroup = new (L as any).FeatureGroup();
// Removed:     map.addLayer(featureGroup);
// Removed:     setEditableFeatureGroup(featureGroup);

// Removed:     // Clean up the feature group on component unmount
// Removed:     return () => {
// Removed:       if (map.hasLayer(featureGroup)) {
// Removed:         map.removeLayer(featureGroup);
// Removed:       }
// Removed:     };

// Removed:   }, [map]);

// Removed:   // Placeholder handlers for drawing events
// Removed:   const onCreated = (e: any) => {
// Removed:     const layer = e.layer;
// Removed:     console.log('Layer created:', layer);
// Removed:     // Add the drawn layer to the editable feature group
// Removed:     if (editableFeatureGroup) {
// Removed:       editableFeatureGroup.addLayer(layer);
// Removed:     }
// Removed:     // Do something with the drawn layer, e.g., save to state or send to server
// Removed:   };

// Removed:   const onEdited = (e: any) => {
// Removed:     const layers = e.layers;
// Removed:     console.log('Layers edited:', layers);
// Removed:     // Do something with the edited layers
// Removed:   };

// Removed:   const onDeleted = (e: any) => {
// Removed:     const layers = e.layers;
// Removed:     console.log('Layers deleted:', layers);
// Removed:     // Do something with the deleted layers
// Removed:   };

// Removed:   return (
// Removed:     <>
// Removed:       {/* Render EditControl only when featureGroup is initialized */}
// Removed:       {editableFeatureGroup && (
// Removed:         <EditControl
// Removed:           position="topright"
// Removed:           onCreated={onCreated}
// Removed:           onEdited={onEdited}
// Removed:           onDeleted={onDeleted}
// Removed:           draw={{
// Removed:             rectangle: true,
// Removed:             polygon: true,
// Removed:             polyline: true,
// Removed:             circle: true,
// Removed:             marker: true,
// Removed:             circlemarker: true,
// Removed:           }}
// Removed:           edit={{
// Removed:             // Enable editing and provide the feature group
// Removed:             remove: true,
// Removed:             featureGroup: editableFeatureGroup,
// Removed:           }}
// Removed:         />
// Removed:       )}
// Removed:     </>
// Removed:   );
// Removed: };

// Removed: Dynamically import MapControls to ensure it's client-side rendered
// Removed: const DynamicMapControls = dynamic(() => Promise.resolve(MapControls), { ssr: false });

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

// Highlight style for selected districts only
const SELECTED_DISTRICT_STYLE = {
  color: "#FFA500", // Orange
  weight: 2,
  opacity: 0.8,
  fillOpacity: 0.4,
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

// Style for districts based on selection
const getDistrictStyle = (feature: any) => {
  const { selectedDistricts, pendingDistricts, isFilterApplied } = useSpatialStore.getState();
  const district = feature.properties.district;

  // If no districts are selected, show default style
  if (pendingDistricts.length === 0 && selectedDistricts.length === 0) {
    return LAYER_STYLES.admin;
  }

  // If district is selected but not yet applied (yellow highlight)
  if (pendingDistricts.includes(district) && !isFilterApplied) {
    return {
      color: "#eab308", // yellow-500
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.3,
    };
  }

  // If district is in final selection (primary color)
  if (selectedDistricts.includes(district) && isFilterApplied) {
    return {
      color: "var(--color-main-primary)",
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.3,
    };
  }

  // Hide unselected districts
  return { ...LAYER_STYLES.admin, opacity: 0, fillOpacity: 0 };
};

const MapLayers: React.FC<LayerProps> = ({ activeBasemap, activeFeatureLayers }) => {
  const { 
    miningSites,
    filteredMiningSites,
    filteredDistricts,
    districts, 
    forestReserves, 
    rivers, 
    isLoading, 
    error
  } = useSpatialStore();

  // Memoize filtered data to prevent unnecessary recalculations
  const filteredLayerData = useMemo(() => {
    if (!filteredDistricts || !filteredMiningSites) return {};

    return {
      mining_sites: filteredMiningSites,
      forest: forestReserves,
      admin: filteredDistricts,
      rivers: rivers,
    };
  }, [filteredDistricts, filteredMiningSites, forestReserves, rivers]);

  // Update the onEachFeature to show tooltips only for selected districts
  const onEachFeature = (feature: any, layer: LeafletLayer) => {
    const { selectedDistricts, pendingDistricts } = useSpatialStore.getState();
    const district = feature.properties.district;
    
    // Only show tooltip if district is selected or no districts are selected
    if (district && (selectedDistricts.length === 0 || selectedDistricts.includes(district) || pendingDistricts.includes(district))) {
      const tooltipContent = feature.properties.region 
        ? `${district} • ${feature.properties.region}`
        : district;
      layer.bindTooltip(tooltipContent, {
        permanent: false,
        direction: 'top',
        offset: [0, -5],
        className: 'district-tooltip'
      });
    }
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
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
              style={getDistrictStyle}
              onEachFeature={onEachFeature}
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
