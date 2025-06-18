"use client";
import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import { ReportZoomHandlerProps } from "./types";

const ReportZoomHandler: React.FC<ReportZoomHandlerProps> = ({ reports, searchParams }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !reports) return;

    const reportId = searchParams.get('report');
    if (!reportId) return;

    const report = reports.find(r => r.id.toString() === reportId);
    if (!report) return;

    // Zoom to report coordinates
    map.flyTo([report.location.lat, report.location.lon], 14, {
      duration: 1.5,
      easeLinearity: 0.25,
    });

    // Wait for reportsLayer to be available and open popup
    const checkLayer = () => {
      const reportsLayer = (map as any).reportsLayer;
      if (reportsLayer) {
        reportsLayer.eachLayer((layer: any) => {
          if (layer.reportId === reportId) {
            reportsLayer.zoomToShowLayer(layer, () => {
              layer.openPopup();
            });
          }
        });
      } else {
        // Retry if reportsLayer is not yet available
        setTimeout(checkLayer, 100);
      }
    };

    checkLayer();
  }, [map, searchParams, reports]);

  return null;
};

export default ReportZoomHandler; 