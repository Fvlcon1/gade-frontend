export interface FeatureGeometry {
  type: 'Point';
  coordinates: [number, number];
  crs?: {
    type: 'name';
    properties: {
      name: string;
    };
  };
}

export interface FeatureProperties {
  type: string;
  weight?: number;
}

export interface Feature {
  type: 'Feature';
  properties: FeatureProperties;
  geometry: FeatureGeometry;
}

export interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}
