'use client'

import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import { addressPoints } from "./addressPoints";

export default function Map() {
	useEffect(() => {
		// Check if the map container exists
		if (!document.getElementById('map')) return;

		// Create the map
		const map = L.map('map').setView([-37.87, 175.475], 12);

		// Add the tile layer
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		// Add the heat layer
		const points = addressPoints
			? addressPoints.map((p) => {
				return [p[0], p[1]];
			})
			: [];

		(L as any).heatLayer(points).addTo(map); //I'm doing this to get around the type error

		// Cleanup function to remove the map when component unmounts
		return () => {
			map.remove();
		};
	}, [addressPoints]);

	return <div id="map" style={{ height: "100vh" }}></div>;
}
