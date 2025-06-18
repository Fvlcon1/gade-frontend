"use client";
import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from 'leaflet';
import { TiLocation } from "react-icons/ti";
import { renderToStaticMarkup } from "react-dom/server";
import { ReportsLayerProps } from "../types";

const ReportsLayer: React.FC<ReportsLayerProps> = ({ reports, activeFeatureLayers }) => {
  const map = useMap();

  const getLocationPinIcon = () => {
    const iconMarkup = renderToStaticMarkup(<TiLocation size={24} color="#1E90FF" />);
    return L.divIcon({
      html: iconMarkup,
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
      className: 'location-pin-marker',
    });
  };

  useEffect(() => {
    const reportsLayer = (map as any).reportsLayer;
    const shouldShowReports = activeFeatureLayers.some(layer => layer.id === 'reports' && layer.checked);

    if (reportsLayer) {
      if (shouldShowReports) {
        map.addLayer(reportsLayer);
      } else {
        map.removeLayer(reportsLayer);
      }
    } else if (shouldShowReports && reports.length > 0) {
      const markersLayer = L.markerClusterGroup({
        iconCreateFunction: (cluster: L.MarkerCluster) => {
          const count = cluster.getChildCount();
          return L.divIcon({
            html: `<div style="background-color: #1E90FF; color: white; font-size: 12px; font-weight: bold; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white;">${count}</div>`,
            className: 'custom-cluster-icon',
            iconSize: [30, 30],
          });
        },
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
      });

      (map as any).reportsLayer = markersLayer;

      reports.forEach(report => {
        const marker = L.marker([report.location.lat, report.location.lon], {
          icon: getLocationPinIcon(),
        }).bindPopup(`
          <div class="p-2">
            <h3 class="font-medium text-sm">${report.locality}</h3>
            <p class="text-xs text-gray-600">Severity: ${report.severity}</p>
            <p class="text-xs text-gray-600">Status: ${report.status || 'Open'}</p>
            <p class="text-xs text-gray-600">Reported: ${new Date(report.created_at).toLocaleDateString()}</p>
          </div>
        `);

        // Store report ID on marker for easier lookup
        (marker as any).reportId = report.id;
        markersLayer.addLayer(marker);
      });

      map.addLayer(markersLayer);
    }

    return () => {
      if (reportsLayer) {
        map.removeLayer(reportsLayer);
        (map as any).reportsLayer = null;
      }
    };
  }, [map, activeFeatureLayers, reports]);

  return null;
};

export default ReportsLayer; 