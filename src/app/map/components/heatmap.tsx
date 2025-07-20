'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet.heat/dist/leaflet-heat.js';
import { addressPoints } from '@/app/test2/addressPoints';

const Heatmap = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const points: [number, number][] = addressPoints.map((p) => [
      Number(p[0]),
      Number(p[1]),
    ]);

    // @ts-ignore — suppress TS if needed
    L.heatLayer(points).addTo(map);
  }, [map]);

  return null;
};

export default Heatmap;
