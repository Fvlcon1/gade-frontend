'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat/dist/leaflet-heat.js';
import { addressPoints } from '@/app/test2/addressPoints';
import { useSpatialStore } from '@/lib/store/spatial-store';

const Heatmap = () => {
	const map = useMap();
	const {heatmapData} = useSpatialStore();

	useEffect(() => {
		if (!map || !heatmapData) return;

		const points: [number, number][] = heatmapData?.features.map(({geometry}) => [
			Number(geometry.coordinates[0]),
			Number(geometry.coordinates[1]),
		]) || [];

		// Initialize the heat layer
		const heat = L.heatLayer(points, {
			radius: 25,
			blur: 15,
			maxZoom: 18,
			minOpacity: 0.2,
			max: 1.0
		});

		heat.addTo(map);

		return () => {
			map.removeLayer(heat);
		};
	}, [map, heatmapData]);

	return null;
};

export default Heatmap;
