"use client";
import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useSpatialStore } from '@/lib/store/spatial-store';
import L from 'leaflet';
import 'leaflet.markercluster';
import { useSearchParams } from "next/navigation";
import { BASEMAP_URLS, LAYER_STYLES, HIGHLIGHT_STYLE, TOOLTIP_STYLES, HOVER_STYLE } from "./constants";
import { MapContainerProps, LayerProps } from "./types";
import MouseCoordinateDisplay from "./MouseCoordinateDisplay";
import ReportsLayer from "./ReportsLayer";
import ReportZoomHandler from "./ReportZoomHandler";
import BottomTimeline from "./BottomTimeline";
import ComparisonSlider from "../../../../components/Controllers/ComparisonSlider";
import TimelineTiles from "@components/Controllers/timeline-controller/components/timeline-tiles";
import { getLastTwelveMonths } from "@/utils/date-utils";

const MapLayers: React.FC<LayerProps & { playhead: number | null; timelineMode: 'timeline' | 'comparison' | null }> = ({ activeBasemap, activeFeatureLayers, playhead, timelineMode }) => {
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

    // Skip auto-zoom if we're in timeline mode to allow free zooming
    if (timelineMode === 'timeline') return;

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
  }, [map, selectedDistricts, timelineMode]);

  const filteredLayerData = useMemo(() => {
    if (!filteredDistricts || !filteredMiningSites) return {};

    return {
      mining_sites: filteredMiningSites,
      forest: forestReserves,
      admin: filteredDistricts,
      rivers: rivers,
    };
  }, [filteredDistricts, filteredMiningSites, forestReserves, rivers]);

  const getDistrictStyle = useCallback((feature: any, hover?: boolean) => {
    const district = feature.properties.district;
    const isHighlighted = highlightedDistricts.includes(district);
    const isSelected = selectedDistricts.includes(district);

    if (selectedDistricts.length === 0 && highlightedDistricts.length === 0) {
      if(hover === true) return HIGHLIGHT_STYLE.admin;
      return LAYER_STYLES.admin;
    }

    if (isHighlighted) {
      if(hover === true) return HIGHLIGHT_STYLE.admin;
      return LAYER_STYLES.admin;
    }

    // if (isSelected) {
    //   if(hover) return HOVER_STYLE.admin;
    //   return {
    //     color: 'var(--color-main-primary)',
    //     weight: 1.5,
    //     opacity: 0.6,
    //     fillOpacity: 0.1,
    //     dashArray: 'none',
    //   };
    // }

    return { opacity: 0, fillOpacity: 0 };
  }, [selectedDistricts, highlightedDistricts]);

  const handleMouseOver = (e: any) => {
    const layer = e.target;
    layer.setStyle(getDistrictStyle(layer.feature, true));

    // Add a tooltip
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };

  const handleMouseOut = (e: any) => {
    const layer = e.target;
    layer.setStyle(getDistrictStyle(layer.feature));
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
          <span className="text-sm text-red-500 font-medium">Could not load layers</span>
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
                  style={getDistrictStyle}
                  interactive={true}
                  onEachFeature={(feature, layer) => {
                    layer.on({
                      mouseover: (e) => handleMouseOver(e),
                      mouseout: (e) => handleMouseOut(e),
                    });
                    const district = feature.properties.district;
                    const tooltipContent = `<div class="font-medium">${district}</div>`;
                    layer.bindTooltip(tooltipContent, {
                      permanent: false,
                      direction: 'top',
                      offset: [0, -8],
                      className: 'district-tooltip',
                    });
                    // layer.off('click');
                    // layer.off('mouseover');
                    // layer.off('mouseout');
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

// Component to sync map events between comparison maps
const MapSynchronizer: React.FC<{ targetMap: any }> = ({ targetMap }) => {
  const map = useMap();
  
  useMapEvents({
    zoom: () => {
      if (targetMap && targetMap.current) {
        targetMap.current.setZoom(map.getZoom());
      }
    },
    move: () => {
      if (targetMap && targetMap.current) {
        targetMap.current.setView(map.getCenter(), map.getZoom());
      }
    }
  });
  
  return null;
};

const InteractiveMapClient: React.FC<MapContainerProps> = ({ 
  mapRef, 
  activeBasemap = 'cartocdnLight', 
  activeFeatureLayers,
  timelineMode = 'timeline',
  onTimelineModeChange,
  sidebarExpanded = false,
  timelineRange = [0, 11],
  onTimelineRangeChange,
  selectedYear = new Date().getFullYear(),
  playhead: externalPlayhead = null,
  isPlaying: externalIsPlaying = false,
  comparisonActive,
  comparisonStartDate,
  comparisonEndDate,
}) => {
  const { reports, fetchReports, applyFilters, miningSites } = useSpatialStore();

  const searchParams = useSearchParams();

  const [currentBasemap, setCurrentBasemap] = useState(activeBasemap);

  useEffect(() => {
    setCurrentBasemap(activeBasemap);
  }, [activeBasemap]);

  // Comparison state
  const [comparisonSliderPosition, setComparisonSliderPosition] = useState(0.5); // 0 = left, 1 = right

  // Filter mining sites for comparison
  const miningSitesLeft = useMemo(() => {
    if (!miningSites || !comparisonStartDate) return null;
    return {
      ...miningSites,
      features: miningSites.features.filter(f => f.properties.detected_date && f.properties.detected_date.startsWith(comparisonStartDate))
    };
  }, [miningSites, comparisonStartDate]);

  const miningSitesRight = useMemo(() => {
    if (!miningSites || !comparisonEndDate) return null;
    return {
      ...miningSites,
      features: miningSites.features.filter(f => f.properties.detected_date && f.properties.detected_date.startsWith(comparisonEndDate))
    };
  }, [miningSites, comparisonEndDate]);

  // Sync external playhead and isPlaying
  const [playhead, setPlayhead] = useState(externalPlayhead);
  const [isPlaying, setIsPlaying] = useState(externalIsPlaying);

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

  const [months, setMonths] = useState(getLastTwelveMonths());
 
  // Dynamically update planet basemap URL with year and month for timeline
  const getPlanetUrl = () => {
    const year = selectedYear;
    const month = playhead != null ? playhead : timelineRange[0];
    const monthStr = String(month + 1).padStart(2, '0');
    return `https://tiles.planet.com/basemaps/v1/planet-tiles/global_monthly_${year}_${monthStr}_mosaic/gmap/{z}/{x}/{y}.png?api_key=${process.env.NEXT_PUBLIC_PL_KEY}`;
  };

  // Helper function for planet URLs in comparison
  const getPlanetUrlForMonth = (dateString: string) => {
    if (!dateString) return BASEMAP_URLS.planet;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthStr = String(month + 1).padStart(2, '0');
    return `https://tiles.planet.com/basemaps/v1/planet-tiles/global_monthly_${year}_${monthStr}_mosaic/gmap/{z}/{x}/{y}.png?api_key=${process.env.NEXT_PUBLIC_PL_KEY}`;
  };

  const topMapRef = useRef(null);

  return (
    <>
      <style>{TOOLTIP_STYLES}</style>
      {/* Comparison mode - Split screen with two maps */}
      {comparisonActive && timelineMode === 'comparison' && (
        <>
          {/* Bottom Map - Start Month */}
          <div className="absolute inset-0 z-10">
            <MapContainer
              ref={mapRef}
              center={initialView.center}
              zoom={initialView.zoom}
              zoomControl={false}
              className="w-full h-full"
            >
              <TileLayer
                url={getPlanetUrlForMonth(comparisonStartDate)}
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* Start month mining sites */}
              {miningSitesLeft && (
                <GeoJSON
                  key={`comparison-start-${comparisonStartDate}`}
                  data={miningSitesLeft}
                  style={{ ...LAYER_STYLES.mining_sites, opacity: 1, fillOpacity: 0.7 }}
                />
              )}
              <ReportZoomHandler reports={reports} searchParams={searchParams} />
              <MouseCoordinateDisplay />
              <MapSynchronizer targetMap={topMapRef} />
            </MapContainer>
          </div>

          {/* Top Map - End Month (masked by slider) */}
          <div 
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              clipPath: `inset(0 0 0 ${Math.round(comparisonSliderPosition * 100)}%)`,
              WebkitClipPath: `inset(0 0 0 ${Math.round(comparisonSliderPosition * 100)}%)`,
              transition: 'clip-path 0.2s, -webkit-clip-path 0.2s',
            }}
          >
            <MapContainer
              ref={topMapRef}
              center={initialView.center}
              zoom={initialView.zoom}
              zoomControl={false}
              className="w-full h-full"
            >
              <TileLayer
                url={getPlanetUrlForMonth(comparisonEndDate)}
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* End month mining sites */}
              {miningSitesRight && (
                <GeoJSON
                  key={`comparison-end-${comparisonEndDate}`}
                  data={miningSitesRight}
                  style={{ ...LAYER_STYLES.mining_sites, opacity: 1, fillOpacity: 0.7 }}
                />
              )}
            </MapContainer>
          </div>
        </>
      )}

      {/* Normal single map mode */}
      {!(comparisonActive && timelineMode === 'comparison') && (
        <MapContainer
          ref={mapRef}
          center={initialView.center}
          zoom={initialView.zoom}
          zoomControl={false}
          className="w-full h-full"
        >
          <TileLayer
            url={currentBasemap === 'planet' ? getPlanetUrl() : BASEMAP_URLS[currentBasemap]}
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {timelineMode === 'timeline' && <TimelineTiles playhead={playhead} months={months} />}
          <MapLayers activeBasemap={currentBasemap} activeFeatureLayers={activeFeatureLayers} playhead={playhead} timelineMode={timelineMode} />
          <ReportZoomHandler reports={reports} searchParams={searchParams} />
          <MouseCoordinateDisplay />
        </MapContainer>
      )}

      {/* Comparison slider overlay */}
      {comparisonActive && timelineMode === 'comparison' && (
        <ComparisonSlider
          isVisible={comparisonActive}
          sidebarExpanded={sidebarExpanded}
          comparisonStartDate={comparisonStartDate}
          comparisonEndDate={comparisonEndDate}
          position={comparisonSliderPosition}
          setPosition={setComparisonSliderPosition}
        />
      )}

      {/* Bottom timeline - only show in timeline mode */}
      {timelineMode === 'timeline' && (
        <BottomTimeline 
          isVisible={timelineMode === 'timeline'} 
          onClose={handleCloseTimeline}
          sidebarExpanded={sidebarExpanded}
          range={timelineRange}
          onRangeChange={onTimelineRangeChange}
          selectedYear={selectedYear}
          playhead={playhead}
          isPlaying={isPlaying}
          setPlayhead={setPlayhead}
        />
      )}
    </>
  );
};

export default InteractiveMapClient;