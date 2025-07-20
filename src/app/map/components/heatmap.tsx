'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat/dist/leaflet-heat.js';
import { useSpatialStore } from '@/lib/store/spatial-store';
import { utmToLatLng } from '@/utils/utm';
import { FeatureCollection } from '@/types/heatmap';

const Heatmap = () => {
	const map = useMap();
	const { heatmapData, isPriorityIndexVisible } = useSpatialStore();

	useEffect(() => {
		if (!map || !heatmapData) return;
		console.log({ heatmapData });

		const points: [number, number, number][] = (heatmapData as FeatureCollection)?.features.map(({ geometry, properties }) => {
			const [lon, lat] = geometry.coordinates;
			return [
				lat,
				lon,
				properties.weight || 1
			];
		}) || [];

		const heat = L.heatLayer(points, {
			radius: 25,
			blur: 15,
			maxZoom: 18,
			minOpacity: 0.2,
			max: 1.0
		});

		if (!isPriorityIndexVisible) return;
		heat.addTo(map);

		return () => {
			map.removeLayer(heat);
		};
	}, [map, heatmapData, isPriorityIndexVisible]);

	return null;
};

export default Heatmap;
