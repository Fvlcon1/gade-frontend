export interface Layer {
  id: string;
  label: string;
  checked: boolean;
}

export interface MapContainerProps {
  mapRef: React.RefObject<any>;
  activeBasemap: string;
  activeFeatureLayers: Layer[];
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