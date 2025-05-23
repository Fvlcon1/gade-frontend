// components/InteractiveMapClient.tsx
'use client';
import React from "react";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const InteractiveMapClient = () => {
  return (
    <div className="relative w-full h-full">
      {/* Overlay Example */}
      <div className="absolute top-4 left-4 z-[1000] bg-white p-2 rounded shadow-md">
        
      </div>

      <MapContainer
        center={[5.5600, -0.2050]}
        zoom={12}
        scrollWheelZoom={true}
        zoomControl={false} // ❌ Removes the default Leaflet zoom buttons
        className="w-full h-full rounded-b-xl z-0"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[5.5600, -0.2050]}>
          <Tooltip>Accra, Ghana</Tooltip>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default InteractiveMapClient;
