export interface Layer {
  id: string;
  label: string;
  checked: boolean;
}

export interface MapContainerProps {
  mapRef: React.RefObject<any>;
  activeBasemap: string;
  activeFeatureLayers: Layer[];
  timelineMode?: 'timeline' | 'comparison' | null;
  onTimelineModeChange?: (mode: 'timeline' | 'comparison' | null) => void;
  sidebarExpanded?: boolean;
  timelineRange?: [number, number];
  onTimelineRangeChange?: (index: number, value: number) => void;
  selectedYear?: number;
  playhead?: number | null;
  isPlaying?: boolean;
}

export interface LayerProps {
  activeBasemap: string;
  activeFeatureLayers: Layer[];
}

export interface ReportsLayerProps {
  reports: any[];
  activeFeatureLayers: Layer[];
}

export interface ReportZoomHandlerProps {
  reports: any[];
  searchParams: any;
}

export interface MapLayerStyle {
  color: string;
  weight: number;
  opacity: number;
  fillOpacity: number;
  dashArray?: string;
} 