'use client'

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import * as L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';

// Helper function to calculate polygon area using geodesic calculations
function calculatePolygonArea(coords: number[][]) {
	// Convert coordinates to radians
	const toRad = (deg: number) => deg * Math.PI / 180;

	let total = 0;
	const len = coords.length;

	for (let i = 0, j = len - 1; i < len; j = i++) {
		const [lon1, lat1] = coords[i];
		const [lon2, lat2] = coords[j];

		total += toRad(lon2 - lon1) * (2 + Math.sin(toRad(lat1)) + Math.sin(toRad(lat2)));
	}

	// Earth's radius in meters
	const earthRadius = 6378137;

	// Calculate area in square meters and ensure positive value
	return Math.abs(total * earthRadius * earthRadius / 2);
}

export const GeomanControls: React.FC = () => {
	const map = useMap();

	useEffect(() => {
		if (!map) return;

		// Initialize Geoman controls
		map.pm.setGlobalOptions({
			allowSelfIntersection: false,
			snapDistance: 20,
		});

		map.pm.setLang('en');

		// Initialize controls
		map.pm.addControls({
			position: 'bottomright',
			drawMarker: false,
			drawCircle: false,
			drawCircleMarker: false,
			drawRectangle: true,
			drawPolyline: true,
			drawPolygon: true,
			editMode: false,
			dragMode: false,
			removalMode: true,
		});

		// Handle measurements
		const handleMeasurements = (layer: L.Layer & { getBounds: () => L.LatLngBounds }) => {
			console.log("handleMeasurements")

			// Calculate measurements based on shape type
			let content = '';

			if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
				console.log("polyline")
				const latlngs = layer.getLatLngs() as L.LatLng[];
				if (latlngs.length < 2) return;

				let distance = 0;
				for (let i = 1; i < latlngs.length; i++) {
					distance += latlngs[i - 1].distanceTo(latlngs[i]);
				}
				content = `Distance: ${(distance / 1000).toFixed(2)} km`;
			} else if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
				console.log(layer instanceof L.Polygon ? "polygon" : "rectangle")
				const latlngs = (layer as L.Polygon).getLatLngs()[0] as L.LatLng[];
				if (latlngs.length < 3) return;

				// Convert LatLng objects to proper format for area calculation
				const coordinates = latlngs.map(ll => [ll.lng, ll.lat]);

				// Calculate area using geodesic calculations
				const area = calculatePolygonArea(coordinates);
				// Convert to square kilometers and ensure positive value
				const areaInKm2 = Math.abs(area / 1000000).toFixed(2);
				content = `Area: ${areaInKm2} km²`;
			}

			if (content) {
				L.popup()
					.setLatLng(layer.getBounds().getCenter())
					.setContent(content)
					.openOn(map);
			}
		};

		// Handle shape creation (fires when shape is fully created)
		map.on('pm:create', (e: any) => {
			const layer = e.layer as L.Layer & { getBounds: () => L.LatLngBounds };
			console.log("create")
			handleMeasurements(layer);
		});

		// Cleanup function to remove controls when component unmounts
		return () => {
			if (map) {
				map.pm.removeControls();
			}
		};
	}, [map]);

	return null;
};

const MapWithMeasurements: React.FC = () => {
	return (
		<MapContainer center={[5.56, -0.2]} zoom={13} style={{ height: '100vh', width: '100%' }}>
			<TileLayer
				attribution='&copy; OpenStreetMap contributors'
				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			/>
			<GeomanControls />
		</MapContainer>
	);
};

export default MapWithMeasurements;
