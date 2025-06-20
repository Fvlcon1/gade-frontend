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
import { BASEMAP_URLS, LAYER_STYLES, HIGHLIGHT_STYLE, TOOLTIP_STYLES } from "./constants";
import { MapContainerProps, LayerProps } from "./types";
import MouseCoordinateDisplay from "./MouseCoordinateDisplay";
import ReportsLayer from "./ReportsLayer";
import ReportZoomHandler from "./ReportZoomHandler";
import BottomTimeline from "./BottomTimeline";

const MapLayers: React.FC<LayerProps & { playhead: number | null }> = ({ activeBasemap, activeFeatureLayers, playhead }) => {
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
                  key={`${layer.id}-${selectedDistricts.join(',')}-${dateRange?.from || ''}-${dateRange?.to || ''}-${data.features.length}-${playhead ?? ''}`}
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
  activeFeatureLayers,
  timelineMode = 'timeline',
  onTimelineModeChange,
  sidebarExpanded = false,
  timelineRange = [0, 11],
  onTimelineRangeChange,
  selectedYear = new Date().getFullYear(),
  playhead: externalPlayhead = null,
  isPlaying: externalIsPlaying = false
}) => {
  const { reports, fetchReports, applyFilters } = useSpatialStore();

  const searchParams = useSearchParams();

  const [currentBasemap, setCurrentBasemap] = useState(activeBasemap);
  const [playhead, setPlayhead] = useState(externalPlayhead);
  const [isPlaying, setIsPlaying] = useState(externalIsPlaying);

  useEffect(() => {
    if (activeBasemap !== currentBasemap) {
      setCurrentBasemap(activeBasemap);
    }
  }, [activeBasemap, currentBasemap]);

  // Sync external playhead and isPlaying
  useEffect(() => {
    setPlayhead(externalPlayhead);
    setIsPlaying(externalIsPlaying);
  }, [externalPlayhead, externalIsPlaying]);

  // Fetch reports on mount
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Timeline play filtering
  useEffect(() => {
    if (timelineMode === 'timeline') {
      if (isPlaying && playhead != null) {
        applyFilters({ year: selectedYear, playhead, range: timelineRange });
      } else {
        // Reset to show all data within range when not playing
        applyFilters({ year: selectedYear, range: timelineRange });
      }
    } else {
      applyFilters(); // Apply district/date range filters when not in timeline mode
    }
  }, [timelineMode, isPlaying, playhead, selectedYear, timelineRange, applyFilters]);

  const initialView = useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search);
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
  }, []);

  const handleCloseTimeline = () => {
    if (onTimelineModeChange) {
      onTimelineModeChange(null);
    }
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    if (playhead == null || playhead >= timelineRange[1]) {
      setPlayhead(timelineRange[0]);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handlePlayheadChange = (newPlayhead: number) => {
    setPlayhead(newPlayhead);
  };

  return (
    <>
      <style>{TOOLTIP_STYLES}</style>
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
        <MapLayers activeBasemap={currentBasemap} activeFeatureLayers={activeFeatureLayers} playhead={playhead} />
        <ReportZoomHandler reports={reports} searchParams={searchParams} />
        <MouseCoordinateDisplay />
      </MapContainer>

      <BottomTimeline 
        isVisible={timelineMode === 'timeline'} 
        onClose={handleCloseTimeline}
        sidebarExpanded={sidebarExpanded}
        range={timelineRange}
        onRangeChange={onTimelineRangeChange}
        selectedYear={selectedYear}
        playhead={playhead}
        isPlaying={isPlaying}
      />
    </>
  );
};

export default InteractiveMapClient;