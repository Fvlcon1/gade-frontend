import { create } from 'zustand';
import { apiClient } from '@/lib/api-client';
import { getLastTwelveMonths } from '@/utils/date-utils';
import L from 'leaflet';
import { ComparisonView } from '@components/Controllers/timeline-controller/utils/types';

// SpatialData type
export interface SpatialDataProperties {
  assets?: string;
  category?: string;
  district?: string;
  name: string;
  owner?: string;
  region?: string;
  status?: string;
  type?: string;
  detected_date?: string;
  id?: string
  area?: number
  expiry_date?: string
  start_date?: string
  severity?: string
  severity_type?: string
  severity_score?: number
  proximity_to_water?: boolean
  inside_forest_reserve?: boolean
  detection_date?: string
  all_violation_types?: string
  distance_to_water_m?: number
  distance_to_forest_m?: number
}
export interface SpatialData {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: SpatialDataProperties
    geometry: any;
  }>;
}

interface ReportLocation {
  lat: number;
  lon: number;
}

interface Report {
  id: string;
  title: string;
  description: string;
  locality: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  status: string;
  location: ReportLocation;
  created_at: string;
  updated_at: string;
}

interface DisplayableAttribute {
  type : 'miningSite' | 'concession' | 'district' | 'river' | 'forestReserve'
  feature : SpatialData["features"][number]
}

export type RightNav = "Review and Validation" | "Priority index Heatmap"

interface SpatialState {
  // Spatial data
  districts: SpatialData | null;
  forestReserves: SpatialData | null;
  rivers: SpatialData | null;
  miningSites: SpatialData | null;
  concessions: SpatialData | null;
  filteredConcessions: SpatialData | null;
  filteredMiningSites: SpatialData | null;
  heatmapData: SpatialData | null;
  filteredDistricts: SpatialData | null;
  boundsFeature: SpatialData["features"][number] | null;
  reviewValidationSearchValue: string
  selectedMiningSite: SpatialData["features"][number] | null;
  displayableAttribute : DisplayableAttribute | null
  activeRightNav: RightNav | null
  isPriorityIndexVisible : boolean

  //View states
  comparisonViewState: ComparisonView
  isReviewValidationVisible: boolean

  //Filter
  months: Array<{ monthIndex: number; year: number }>;

  //Proximity
  minProximityToRiver: number;
  maxProximityToRiver: number;
  minProximityToForestReserve: number;
  maxProximityToForestReserve: number;


  // Reports data
  reports: Report[] | null;
  reportsLastUpdated: number | null;

  // UI state
  isLoading: boolean;
  error: string | null;
  selectedDistricts: string[];
  selectedCompanies: string[];
  highlightedDistricts: string[];
  dateRange: { from: string | null; to: string | null } | null;

  // Actions
  setSelectedDistricts: (districts: string[]) => void;
  setHighlightedDistricts: (districts: string[]) => void;
  setDateRange: (range: { from: string | null; to: string | null }) => void;
  applyFilters: (options?: { year?: number; playhead?: number; range?: [number, number]; }) => void;
  setProximityFilters: (options: { minProximityToRiver?: number; maxProximityToRiver?: number; minProximityToForestReserve?: number; maxProximityToForestReserve?: number; }) => void;
  fetchAllData: () => Promise<void>;
  fetchReports: () => Promise<void>;
  setMonths: (months: Array<{ monthIndex: number; year: number }>) => void;
  setBounds: (boundsFeature: SpatialData["features"][number] | null) => void,
  setComparisonViewState: (viewState: ComparisonView) => void,
  setSelectedMiningSite: (selectedMiningSite: SpatialData["features"][number] | null) => void,
  setIsReviewValidationVisible: (isReviewValidationVisible: boolean) => void,
  setActiveRightNav: (activeRightNav: RightNav | null) => void,
  fetchMiningSites: () => Promise<void>,
  setHeatmapData: (heatmapData: SpatialData) => void,
  setReviewValidationSearchValue: (searchValue: string) => void
  setIsPriorityIndexVisible: (value : boolean) => void
  setDisplayableAttribute: (displayableAttribute: DisplayableAttribute | null) => void
}

export const useSpatialStore = create<SpatialState>((set, get) => ({
  // Initial state
  districts: null,
  forestReserves: null,
  rivers: null,
  miningSites: null,
  concessions: null,
  filteredConcessions: null,
  filteredMiningSites: null,
  heatmapData: null,
  filteredDistricts: null,
  months: getLastTwelveMonths(),
  reports: null,
  reportsLastUpdated: null,
  isLoading: false,
  error: null,
  selectedDistricts: [],
  selectedCompanies: [],
  highlightedDistricts: [],
  dateRange: null,
  boundsFeature: undefined,
  comparisonViewState: "slider",
  isReviewValidationVisible: false,
  reviewValidationSearchValue: "",
  selectedMiningSite: null,
  activeRightNav: null,
  isPriorityIndexVisible : false,
  displayableAttribute : null,

  // Proximity
  minProximityToRiver: 0,
  maxProximityToRiver: 0,
  minProximityToForestReserve: 0,
  maxProximityToForestReserve: 0,

  // Actions
  setSelectedDistricts: (districts) => set({ selectedDistricts: districts }),
  setSelectedCompanies: (companies) => set({ selectedCompanies: companies }),
  setHighlightedDistricts: (districts) => set({ highlightedDistricts: districts }),
  setDateRange: (range) => set({ dateRange: range }),
  setMonths: (months: Array<{ monthIndex: number; year: number }>) => set({ months: months }),
  setBounds: (boundsFeature: any) => set({ boundsFeature }),
  setComparisonViewState: (viewState: "slider" | "side-by-side") => set({ comparisonViewState: viewState }),
  setSelectedMiningSite: (selectedMiningSite: SpatialData["features"][number] | null) => set({ selectedMiningSite }),
  setIsReviewValidationVisible: (isReviewValidationVisible: boolean) => set({ isReviewValidationVisible }),
  setReviewValidationSearchValue: (searchValue: string) => set({ reviewValidationSearchValue: searchValue }),
  setActiveRightNav: (activeRightNav: RightNav | null) => set({ activeRightNav }),
  setIsPriorityIndexVisible : (value : boolean) => set({ isPriorityIndexVisible : value }),
  setHeatmapData: (heatmapData: SpatialData) => set({ heatmapData }),
  setDisplayableAttribute: (displayableAttribute: DisplayableAttribute | null) => set({ displayableAttribute }),
  setProximityFilters: (options) => set({
    minProximityToRiver: options.minProximityToRiver ?? get().minProximityToRiver,
    maxProximityToRiver: options.maxProximityToRiver ?? get().maxProximityToRiver,
    minProximityToForestReserve: options.minProximityToForestReserve ?? get().minProximityToForestReserve,
    maxProximityToForestReserve: options.maxProximityToForestReserve ?? get().maxProximityToForestReserve,
  }),
  applyFilters: (options = {}) => {
    const { miningSites, districts, selectedDistricts, dateRange, concessions, selectedCompanies } = get();
    if (!miningSites || !districts) return;

    const { year, playhead, range } = options;
    let fromMonth = 0, toMonth = 11;
    if (range) {
      fromMonth = range[0];
      toMonth = range[1];
    }
    let playheadMonth = playhead != null ? playhead : toMonth;

    let filteredMiningSites = {
      ...miningSites,
      features: miningSites.features.filter(feature => {
        const matchesDistrict = selectedDistricts.length === 0 ||
          selectedDistricts.includes(feature.properties.district);

        let matchesDate = true;
        if (year != null && playhead != null) {
          const detected = feature.properties.detected_date;
          if (!detected) return false;

          const detectedYear = Number(detected.slice(0, 4));
          const detectedMonth = Number(detected.slice(5, 7)) - 1;

          matchesDate = detectedYear === year &&
            detectedMonth <= playheadMonth &&
            detectedMonth >= fromMonth &&
            detectedMonth <= toMonth;
        } else if (dateRange?.from && dateRange?.to) {
          matchesDate = feature.properties.detected_date >= dateRange.from &&
            feature.properties.detected_date <= dateRange.to;
        }

        return matchesDistrict && matchesDate;
      })
    };

    const filteredMiningSitesBySearch = (): SpatialData => {
      const result = {
        ...filteredMiningSites,
        features: filteredMiningSites.features.filter(feature => {
          const id = feature.properties.id;
          return id.toLowerCase() === get().reviewValidationSearchValue.toLowerCase();
        })
      }
      console.log({ result })
      return result
    }

    const filterByProximityToRivers = (): SpatialData => {
      return {
        ...filteredMiningSites,
        features: filteredMiningSites.features.filter(feature => {
          const distance = feature.properties.distance_to_water_m;
          return distance >= get().minProximityToRiver && distance <= get().maxProximityToRiver;
        })
      }
    }

    const filterByProximityToForestReserves = (): SpatialData => {
      return {
        ...filteredMiningSites,
        features: filteredMiningSites.features.filter(feature => {
          const distance = feature.properties.distance_to_forest_m;
          return distance >= get().minProximityToForestReserve && distance <= get().maxProximityToForestReserve;
        })
      }
    }

    //Filter by proximity to river
    if (get().maxProximityToRiver)
      filteredMiningSites = filterByProximityToRivers()

    //Filter by proximity to forest reserve
    if (get().maxProximityToForestReserve)
      filteredMiningSites = filterByProximityToForestReserves()

    //Filter by search
    if (get().reviewValidationSearchValue.length > 0)
      filteredMiningSites = filteredMiningSitesBySearch()

    const filteredDistricts = {
      ...districts,
      features: districts.features.filter(feature =>
        selectedDistricts.length === 0 ||
        selectedDistricts.includes(feature.properties.district)
      )
    };

    const filteredConcessions = {
      ...concessions,
      features: concessions.features.filter(feature =>
        selectedCompanies.length === 0 ||
        selectedCompanies.includes(feature.properties.owner)
      )
    };

    console.log({ filteredConcessions })
    set({ filteredMiningSites, filteredDistricts, filteredConcessions });
  },
  fetchReports: async () => {
    try {
      const reports = await apiClient.reports.all();
      set({
        reports,
        reportsLastUpdated: Date.now(),
        error: null
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch reports',
        reportsLastUpdated: Date.now() // Still update timestamp even on error
      });
    }
  },

  fetchMiningSites: async () => {
    try {
      const miningSites = await apiClient.spatial.miningSites();
      set({
        miningSites,
        // filteredMiningSites : miningSites,
        error: null
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch mining sites',
      });
    }
  },

  fetchAllData: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch all data in parallel
      const [districts, forestReserves, rivers, miningSites, concessions, heatmapData] = await Promise.allSettled([
        apiClient.spatial.districts(),
        apiClient.spatial.forestReserves(),
        apiClient.spatial.rivers(),
        apiClient.spatial.miningSites(),
        apiClient.spatial.concessions(),
        apiClient.spatial.heatmapData(),
      ])

      set({
        districts: districts.status === "fulfilled" ? districts.value : null,
        forestReserves: forestReserves.status === "fulfilled" ? forestReserves.value : null,
        rivers: rivers.status === "fulfilled" ? rivers.value : null,
        miningSites: miningSites.status === "fulfilled" ? miningSites.value : null,
        concessions: concessions.status === "fulfilled" ? concessions.value : null,
        heatmapData: heatmapData.status === "fulfilled" ? heatmapData.value : null,
        reportsLastUpdated: Date.now(),
        filteredMiningSites: miningSites.status === "fulfilled" ? miningSites.value : null,
        filteredDistricts: districts.status === "fulfilled" ? districts.value : null,
        filteredConcessions: concessions.status === "fulfilled" ? concessions.value : null,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch data',
        isLoading: false
      });
    }
  }
}));