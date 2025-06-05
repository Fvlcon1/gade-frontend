// components/InteractiveMapClient.tsx
'use client';
import React, { useState, useCallback } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import LayersControl from "@components/Controllers/LayersControl";

// Basemap definitions with URLs
const basemaps = {
  osm: {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; OpenStreetMap contributors'
  },
  satellite: {
    name: "Google Satellite",
    url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    attribution: '&copy; Google'
  },
  planet: {
    name: "Planet",
    url: "https://tiles.planet.com/basemaps/v1/planet-tiles/global_monthly_2025_02_mosaic/gmap/{z}/{x}/{y}.png?api_key=PLAKef1cdb65aa614448ab66a00e3129ebdf",
    attribution: '&copy; Planet Labs'
  }
};

// Feature layer definitions (to be implemented with actual data sources)
const featureLayers = {
  mining: {
    name: "Detected mining activity",
    // Add your GeoJSON or other data source here
  },
  concessions: {
    name: "Mining concessions",
    // Add your GeoJSON or other data source here
  },
  forest: {
    name: "Forest reserves",
    // Add your GeoJSON or other data source here
  },
  admin: {
    name: "Admin districts",
    // Add your GeoJSON or other data source here
  },
  rivers: {
    name: "Rivers",
    // Add your GeoJSON or other data source here
  }
};

// Map layer component that handles layer changes
const MapLayers = ({ activeBasemap, activeFeatureLayers }) => {
  const basemap = basemaps[activeBasemap];
  
  return (
    <>
      <TileLayer
        attribution={basemap.attribution}
        url={basemap.url}
      />
      {/* Feature layers will be added here */}
      {/* Example:
      {activeFeatureLayers.map(layer => (
        <GeoJSON
          key={layer.id}
          data={featureLayers[layer.id].data}
          style={featureLayers[layer.id].style}
        />
      ))}
      */}
    </>
  );
};

const InteractiveMapClient = () => {
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [activeBasemap, setActiveBasemap] = useState('osm');
  const [activeFeatureLayers, setActiveFeatureLayers] = useState([]);

  const handleBasemapChange = useCallback((basemapId) => {
    setActiveBasemap(basemapId);
  }, []);

  const handleLayerChange = useCallback((layers) => {
    setActiveFeatureLayers(layers.filter(layer => layer.checked));
  }, []);

  return (
    <div className="relative w-full h-full">
      <LayersControl
        isOpen={isLayersOpen}
        onClose={() => setIsLayersOpen(false)}
        onBasemapChange={handleBasemapChange}
        onLayerChange={handleLayerChange}
      />

      <MapContainer
        center={[5.5600, -0.2050]}
        zoom={12}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full rounded-b-xl z-0"
      >
        <MapLayers 
          activeBasemap={activeBasemap}
          activeFeatureLayers={activeFeatureLayers}
        />
        <Marker position={[5.5600, -0.2050]}>
          <Tooltip>Accra, Ghana</Tooltip>
        </Marker>
      </MapContainer>

      {/* Layer control toggle button */}
      <button
        onClick={() => setIsLayersOpen(!isLayersOpen)}
        className="absolute top-4 left-4 z-[1001] bg-white p-2 rounded shadow-md hover:bg-gray-50"
      >
        <span className="text-sm font-medium">Layers</span>
      </button>
    </div>
  );
};

export default InteractiveMapClient;
