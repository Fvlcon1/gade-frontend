import { create } from 'zustand';
import { fetchSpatialData } from '@/hooks/spatial-data';

// Define SpatialData type here since it's not exported from spatial-data
interface SpatialData {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: {
      assets?: string;
      category?: string;
      district?: string;
      name: string;
      owner?: string;
      region?: string;
      status?: string;
      type?: string;
      detected_date?: string;
    };
    geometry: any;
  }>;
}

// Add type for mining site properties
interface MiningSiteProperties {
  assets?: string;
  category?: string;
  district?: string;
  name: string;
  owner?: string;
  region?: string;
  status?: string;
  type?: string;
  detected_date?: string; // Make it optional
}

interface SpatialState {
  districts: SpatialData | null;
  forestReserves: SpatialData | null;
  rivers: SpatialData | null;
  miningSites: SpatialData | null;
  filteredMiningSites: SpatialData | null;
  filteredDistricts: SpatialData | null;
  isLoading: boolean;
  error: string | null;
  selectedDistricts: string[];
  pendingDistricts: string[];
  dateRange: {
    from: string | null;
    to: string | null;
  };
  isFilterApplied: boolean;
  setSelectedDistricts: (districts: string[]) => void;
  setPendingDistricts: (districts: string[]) => void;
  setDateRange: (range: { from: string | null; to: string | null }) => void;
  setFilterApplied: (applied: boolean) => void;
  applyFilters: () => void;
  fetchAllData: () => Promise<void>;
  getDistrictStyle: (feature: any) => any;
}

// Update the mining sites type
interface MiningSite {
  type: string;
  features: Array<{
    type: string;
    properties: MiningSiteProperties;
    geometry: any;
  }>;
}

export const useSpatialStore = create<SpatialState>((set, get) => ({
  districts: null,
  forestReserves: null,
  rivers: null,
  miningSites: null,
  filteredMiningSites: null,
  filteredDistricts: null,
  isLoading: false,
  error: null,
  selectedDistricts: [],
  pendingDistricts: [],
  isFilterApplied: false,
  dateRange: {
    from: null,
    to: null
  },
  setSelectedDistricts: (districts) => set({ selectedDistricts: districts }),
  setPendingDistricts: (districts) => set({ pendingDistricts: districts }),
  setDateRange: (range) => set({ dateRange: range }),
  setFilterApplied: (applied) => set({ isFilterApplied: applied }),
  applyFilters: () => {
    const { miningSites, districts, pendingDistricts, dateRange } = get();
    if (!miningSites || !districts) return;

    // Efficient date range check
    const isDateInRange = (dateStr: string) => {
      if (!dateRange.from && !dateRange.to) return true;
      
      const date = new Date(dateStr).getTime();
      const from = dateRange.from ? new Date(dateRange.from).setHours(0, 0, 0, 0) : null;
      const to = dateRange.to ? new Date(dateRange.to).setHours(23, 59, 59, 999) : null;
      
      return (!from || date >= from) && (!to || date <= to);
    };

    // Filter mining sites first - this is the most important filter
    const filteredSites = {
      ...miningSites,
      features: miningSites.features.filter(feature => {
        const matchesDistrict = pendingDistricts.length === 0 || 
          pendingDistricts.includes(feature.properties.district);
        const matchesDate = !feature.properties.detected_date || 
          isDateInRange(feature.properties.detected_date);
        return matchesDistrict && matchesDate;
      })
    };

    // Only filter districts if we have selected districts
    const filteredDistricts = pendingDistricts.length === 0 ? districts : {
      ...districts,
      features: districts.features.filter(feature => 
        pendingDistricts.includes(feature.properties.district)
      )
    };

    set({ 
      filteredMiningSites: filteredSites,
      filteredDistricts: filteredDistricts,
      selectedDistricts: pendingDistricts,
      isFilterApplied: true
    });
  },
  getDistrictStyle: (feature: any) => {
    const { selectedDistricts, pendingDistricts, isFilterApplied } = get();
    const district = feature.properties.district;
    const isSelected = selectedDistricts.includes(district);
    const isPending = pendingDistricts.includes(district);

    if (pendingDistricts.length === 0 && selectedDistricts.length === 0) {
      return {
        color: "#666",
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.1,
      };
    }

    if (isPending && !isSelected) {
      return {
        color: "#eab308",
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.3,
      };
    }

    if (isSelected && isFilterApplied) {
      return {
        color: "var(--color-main-primary)",
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.3,
      };
    }

    return {
      color: "#666",
      weight: 1,
      opacity: 0,
      fillOpacity: 0,
    };
  },
  fetchAllData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [districts, forestReserves, rivers, miningSites] = await Promise.all([
        fetchSpatialData('/data/districts'),
        fetchSpatialData('/data/forest-reserves'),
        fetchSpatialData('/data/rivers'),
        fetchSpatialData('/data/mining-sites'),
      ]);

      set({
        districts,
        forestReserves,
        rivers,
        miningSites,
        filteredMiningSites: miningSites,
        filteredDistricts: districts,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch spatial data',
        isLoading: false,
      });
    }
  },
})); 