"use client";
import React, { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useSpatialStore } from '@/lib/store/spatialStore';
import L from 'leaflet';
import 'leaflet.markercluster';
import { useSearchParams } from "next/navigation";
import { TiLocation } from "react-icons/ti";
import { renderToStaticMarkup } from "react-dom/server";

const MouseCoordinateDisplay = () => {
  const map = useMap();
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!map) return;

    const onMouseMove = (e: any) => {
      setCoordinates(e.latlng);
    };

    map.on('mousemove', onMouseMove);

    return () => {
      map.off('mousemove', onMouseMove);
    };
  }, [map]);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-800 text-white text-xs p-1 text-center z-[1001]">
      {coordinates ? (
        `Lat: ${coordinates.lat.toFixed(4)}, Lng: ${coordinates.lng.toFixed(4)}`
      ) : (
        'Move mouse over map to see coordinates'
      )}
    </div>
  );
};

interface Layer {
  id: string;
  label: string;
  checked: boolean;
}

interface MapContainerProps {
  mapRef: React.RefObject<any>;
  activeBasemap: string;
  activeFeatureLayers: Layer[];
}

interface LayerProps {
  activeBasemap: string;
  activeFeatureLayers: Layer[];
}

const BASEMAP_URLS = {
  osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  satellite: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  planet: `https://tiles.planet.com/basemaps/v1/planet-tiles/global_monthly_2023_01_mosaic/gmap/{z}/{x}/{y}.png?api_key=${process.env.NEXT_PUBLIC_PL_KEY}`,
};

const LAYER_STYLES = {
  mining_sites: {
    color: "#FF4B4B",
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.2,
  },
  forest: {
    color: "#4CAF50",
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.2,
  },
  admin: {
    color: "#757575",
    weight: 3,
    opacity: 0.3,
    fillOpacity: 0,
    dashArray: 'none',
  },
  rivers: {
    color: "#03A9F4",
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.3,
  },
};

const HIGHLIGHT_STYLE = {
  mining_sites: {
    color: "#FF6B6B",
    weight: 3,
    opacity: 1,
    fillOpacity: 0.4,
  },
  forest: {
    color: "#66BB6A",
    weight: 3,
    opacity: 1,
    fillOpacity: 0.4,
  },
  admin: {
    color: "#FFFF00",
    weight: 2,
    opacity: 0.6,
    fillOpacity: 0.3,
  },
  rivers: {
    color: "#29B6F6",
    weight: 3,
    opacity: 1,
    fillOpacity: 0.5,
  },
};

const tooltipStyles = `
  .leaflet-tooltip {
    padding: 8px 12px !important;
    font-size: 13px !important;
    line-height: 1.4 !important;
    margin: 0 !important;
    background: rgba(255, 255, 255, 0.98) !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
    backdrop-filter: blur(8px) !important;
    color: #374151 !important;
    font-weight: 500 !important;
    width: fit-content !important;
    min-width: 120px !important;
    max-width: 400px !important;
    white-space: normal !important;
    word-wrap: break-word !important;
    text-align: left !important;
  }

  path.leaflet-interactive:focus {
    outline: none !important;
  }

  .leaflet-container *:focus {
    outline: none !important;
  }

  .leaflet-container *:active {
    outline: none !important;
  }

  .leaflet-tooltip-top:before {
    border-top-color: #e5e7eb !important;
    margin-top: -6px !important;
  }

  .leaflet-tooltip-bottom:before {
    border-bottom-color: #e5e7eb !important;
    margin-bottom: -6px !important;
  }

  .leaflet-popup-content-wrapper {
    border-radius: 8px !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
    backdrop-filter: blur(8px) !important;
    min-width: 200px !important;
    max-width: 400px !important;
  }

  .leaflet-popup-content {
    margin: 12px !important;
    font-size: 13px !important;
    line-height: 1.4 !important;
    white-space: normal !important;
    word-wrap: break-word !important;
  }

  .leaflet-popup-tip {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
  }
`;

const ReportsLayer: React.FC<{ reports: any[], activeFeatureLayers: Layer[] }> = ({ reports, activeFeatureLayers }) => {
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

// New component to handle report zooming and popup
const ReportZoomHandler: React.FC<{ reports: any[], searchParams: any }> = ({ reports, searchParams }) => {
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

const MapLayers: React.FC<LayerProps> = ({ activeBasemap, activeFeatureLayers }) => {
  const { 
    filteredMiningSites,
    filteredDistricts,
    forestReserves, 
    rivers,
    reports,
    isLoading, 
    error, 
    selectedDistricts,
    highlightedDistricts,
    dateRange,
    applyFilters 
  } = useSpatialStore();

  const map = useMap();

  if (!map) {
    return null;
  }

  useEffect(() => {
    applyFilters();
  }, [selectedDistricts, dateRange, applyFilters]);

  useEffect(() => {
    if (!filteredDistricts || !filteredDistricts.features) return;

    const districtsToZoom = highlightedDistricts.length > 0 ? highlightedDistricts : selectedDistricts;
    const bounds = new L.LatLngBounds([]);

    filteredDistricts.features.forEach((feature: any) => {
      const district = feature.properties.district;
      if (districtsToZoom.length === 0 || districtsToZoom.includes(district)) {
        const layer = L.geoJSON(feature);
        bounds.extend(layer.getBounds());
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: districtsToZoom.length > 0 ? 12 : 9,
        animate: true,
        duration: 0.5,
      });
    }
  }, [map, filteredDistricts, highlightedDistricts, selectedDistricts]);

  const filteredLayerData = useMemo(() => {
    if (!filteredDistricts || !filteredMiningSites) return {};

    return {
      mining_sites: filteredMiningSites,
      forest: forestReserves,
      admin: filteredDistricts,
      rivers: rivers,
    };
  }, [filteredDistricts, filteredMiningSites, forestReserves, rivers]);

  const getDistrictStyle = (feature: any) => {
    const district = feature.properties.district;
    const isHighlighted = highlightedDistricts.includes(district);
    const isSelected = selectedDistricts.includes(district);

    if (selectedDistricts.length === 0 && highlightedDistricts.length === 0) {
      return LAYER_STYLES.admin;
    }

    if (isHighlighted) {
      return HIGHLIGHT_STYLE.admin;
    }

    if (isSelected) {
      return {
        color: 'var(--color-main-primary)',
        weight: 1.5,
        opacity: 0.6,
        fillOpacity: 0.1,
        dashArray: 'none',
      };
    }

    return { opacity: 0, fillOpacity: 0 };
  };

  const adminLayerKey = useMemo(() => {
    return filteredDistricts?.features
      ? JSON.stringify(filteredDistricts.features.map(f => f.properties.district))
      : 'empty';
  }, [filteredDistricts]);

  return (
    <>
      {isLoading && (
        <div className="absolute top-4 right-[120px] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm z-[1002] flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-[var(--color-main-primary)] border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="absolute top-4 right-[120px] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm z-[1002] flex items-center gap-2">
          <span className="text-sm text-red-500 font-medium">Error loading layers</span>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <ReportsLayer reports={reports} activeFeatureLayers={activeFeatureLayers} />
          {activeFeatureLayers.map((layer) => {
            const data = filteredLayerData[layer.id];
            if (!layer.checked || !data) return null;

            if (layer.id === 'admin') {
              return (
                <GeoJSON
                  key={adminLayerKey}
                  data={data}
                  style={(feature) => getDistrictStyle(feature)}
                  onEachFeature={(feature, leafletLayer) => {
                    const district = feature.properties.district;
                    const tooltipContent = `<div class="font-medium">${district}</div>`;
                    leafletLayer.bindTooltip(tooltipContent, {
                      permanent: false,
                      direction: 'top',
                      offset: [0, -8],
                      className: 'district-tooltip',
                    });
                    leafletLayer.off('click');
                    leafletLayer.off('mouseover');
                    leafletLayer.off('mouseout');
                  }}
                />
              );
            }

            if (layer.id === 'mining_sites') {
              return (
                <GeoJSON
                  key={`${layer.id}-${selectedDistricts.join(',')}-${dateRange?.from || ''}-${dateRange?.to || ''}`}
                  data={data}
                  style={LAYER_STYLES[layer.id]}
                  onEachFeature={(feature, leafletLayer) => {
                    const date = new Date(feature.properties.detected_date).toLocaleDateString();
                    const district = feature.properties.district;
                    const tooltipContent = `
                      <div class="space-y-1">
                        <div class="font-medium">Detected: ${date}</div>
                        ${district ? `<div class="text-gray-600">District: ${district}</div>` : ''}
                      </div>
                    `;
                    leafletLayer.bindTooltip(tooltipContent, {
                      permanent: false,
                      direction: 'top',
                      offset: [0, -8],
                      className: 'mining-site-tooltip',
                    });
                  }}
                />
              );
            }

            return (
              <GeoJSON
                key={layer.id}
                data={data}
                style={LAYER_STYLES[layer.id]}
                onEachFeature={(feature, leafletLayer) => {
                  const name = feature.properties.name || 'Unnamed';
                  const tooltipContent = `<div class="font-medium">${name}</div>`;
                  leafletLayer.bindTooltip(tooltipContent, {
                    permanent: false,
                    direction: 'top',
                    offset: [0, -8],
                    className: `${layer.id}-tooltip`,
                  });
                }}
              />
            );
          })}
        </>
      )}
    </>
  );
};

const InteractiveMapClient: React.FC<MapContainerProps> = ({ 
  mapRef, 
  activeBasemap = 'osm', 
  activeFeatureLayers 
}) => {
  const { reports, fetchReports } = useSpatialStore();
  const searchParams = useSearchParams();

  const [currentBasemap, setCurrentBasemap] = useState(activeBasemap);

  useEffect(() => {
    if (activeBasemap !== currentBasemap) {
      setCurrentBasemap(activeBasemap);
    }
  }, [activeBasemap, currentBasemap]);

  // Fetch reports on mount to ensure data is available
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const initialView = useMemo(() => {
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const zoom = searchParams.get('zoom');

    if (lat && lon) {
      return {
        center: [parseFloat(lat), parseFloat(lon)] as [number, number],
        zoom: parseInt(zoom || '14'),
      };
    }

    return {
      center: [5.6570, -2.1478] as [number, number],
      zoom: 9.2,
    };
  }, [searchParams]);

  return (
    <>
      <style>{tooltipStyles}</style>
      <MapContainer
        ref={mapRef}
        center={initialView.center}
        zoom={initialView.zoom}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          url={BASEMAP_URLS[currentBasemap]}
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapLayers activeBasemap={currentBasemap} activeFeatureLayers={activeFeatureLayers} />
        <ReportZoomHandler reports={reports} searchParams={searchParams} />
        <MouseCoordinateDisplay />
      </MapContainer>
    </>
  );
};

export default InteractiveMapClient;