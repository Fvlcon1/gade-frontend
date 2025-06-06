import { create } from 'zustand';
import { fetchSpatialData } from '@/hooks/spatial-data';

// Define SpatialData type
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
  detected_date?: string;
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
  highlightedDistricts: string[];
  dateRange: {
    from: string | null;
    to: string | null;
  };
  setSelectedDistricts: (districts: string[]) => void;
  setHighlightedDistricts: (districts: string[]) => void;
  setDateRange: (range: { from: string | null; to: string | null }) => void;
  applyFilters: () => void;
  fetchAllData: () => Promise<void>;
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
  highlightedDistricts: [],
  dateRange: {
    from: null,
    to: null,
  },
  setSelectedDistricts: (districts) => set({ selectedDistricts: districts }),
  setHighlightedDistricts: (districts) => set({ highlightedDistricts: districts }),
  setDateRange: (range) => set({ dateRange: range }),
  applyFilters: () => {
    set((state) => {
      const { selectedDistricts, dateRange, miningSites } = state;
      
      // Return early if miningSites is not loaded yet
      if (!miningSites) {
        return {
          ...state,
          filteredMiningSites: null
        };
      }
      
      // Apply date filter first
      const dateFilteredSites = miningSites.features.filter(site => {
        if (!dateRange?.from && !dateRange?.to) return true;
        if (!site.properties.detected_date) return false;
        
        const siteDate = new Date(site.properties.detected_date);
        const fromDate = dateRange.from ? new Date(dateRange.from) : null;
        const toDate = dateRange.to ? new Date(dateRange.to) : null;
        
        if (fromDate && toDate) {
          return siteDate >= fromDate && siteDate <= toDate;
        } else if (fromDate) {
          return siteDate >= fromDate;
        } else if (toDate) {
          return siteDate <= toDate;
        }
        return true;
      });

      // Then apply district filter
      const filteredSites = selectedDistricts.length === 0 
        ? dateFilteredSites
        : dateFilteredSites.filter(site => 
            selectedDistricts.includes(site.properties.district)
          );

      return {
        ...state,
        filteredMiningSites: {
          ...miningSites,
          features: filteredSites
        }
      };
    });
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