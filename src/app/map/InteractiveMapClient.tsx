// components/InteractiveMapClient.tsx
'use client';
import React from "react";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const InteractiveMapClient = () => {
  return (
    <MapContainer
      center={[5.5600, -0.2050]} // Accra
      zoom={12}
      scrollWheelZoom={true}
      className="w-full h-full rounded-b-xl"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[5.5600, -0.2050]}>
        <Tooltip>Accra, Ghana</Tooltip>
      </Marker>
    </MapContainer>
  );
};

export default InteractiveMapClient;
