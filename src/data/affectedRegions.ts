
export interface AffectedRegion {
  id: number;
  name: string;
  value: number; // in km²
}

export const affectedRegions: AffectedRegion[] = [
  { id: 1, name: "Ashanti Region", value: 8700 },
  { id: 2, name: "Easten Region", value: 1200 },
  { id: 3, name: "Western Region", value: 900 },
  { id: 4, name: "Upper East", value: 400 },
  { id: 5, name: "Central", value: 200 },
];
