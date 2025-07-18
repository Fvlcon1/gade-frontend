import { MapLayerStyle } from './types';

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;


export const BASEMAP_URLS = {
  osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  cartocdnLight: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  cartocdnDark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  satellite: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  planet: `https://tiles.planet.com/basemaps/v1/planet-tiles/global_monthly_${currentYear}_${String(prevMonth + 1).padStart(2, '0')}_mosaic/gmap/{z}/{x}/{y}.png?api_key=${process.env.NEXT_PUBLIC_PL_KEY}`,
};

export const LAYER_STYLES: Record<string, MapLayerStyle> = {
  mining_sites: {
    color: "#FF4B4B",
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.1,
  },
  concessions: {
    color: "#d3b036",
    weight: 1,
    opacity: 0.7,
    fillOpacity: 0.1,
  },
  forest: {
    color: "#4CAF50",
    weight: 1,
    opacity: 0.6,
    fillOpacity: 0.1,
  },
  admin: {
    color: "#261b1b",
    weight: 2,
    opacity: 0.5,
    fillOpacity: 0,
    dashArray: 'none',
  },
  rivers: {
    color: "#03A9F4",
    weight: 1,
    opacity: 0.7,
    fillOpacity: 0.9,
  },
};

export const HIGHLIGHT_STYLE: Record<string, MapLayerStyle> = {
  mining_sites: {
    color: "#FF6B6B",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.4,
  },
  concessions: {
    color: "#d3b036",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5,
  },
  forest: {
    color: "#66BB6A",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.4,
  },
  admin: {
    color: "#261b1b",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.3,
  },
  rivers: {
    color: "#29B6F6",
    weight: 3,
    opacity: 1,
    fillOpacity: 0.5,
  },
};

export const HOVER_STYLE: Record<string, MapLayerStyle> = {
  admin: {
    color: "#261b1b",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.3,
    dashArray: 'none',
  },
};

export const TOOLTIP_STYLES = `
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