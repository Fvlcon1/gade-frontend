import { create } from 'zustand';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store/auth-store';
import { filterByDistance } from '../filter-by-distance';
export const useSpatialStore = create((set, get) => ({
    // Initial state
    districts: null,
    forestReserves: null,
    rivers: null,
    miningSites: null,
    filteredMiningSites: null,
    filteredDistricts: null,
    reports: null,
    reportsLastUpdated: null,
    isLoading: false,
    error: null,
    selectedDistricts: [],
    highlightedDistricts: [],
    dateRange: null,
    // Actions
    setSelectedDistricts: (districts) => set({ selectedDistricts: districts }),
    setHighlightedDistricts: (districts) => set({ highlightedDistricts: districts }),
    setDateRange: (range) => set({ dateRange: range }),
    applyFilters: (options = {}) => {
        const { miningSites, districts, selectedDistricts, dateRange } = get();
        if (!miningSites || !districts)
            return;
        const { year, playhead, range } = options;
        let fromMonth = 0, toMonth = 11;
        if (range) {
            fromMonth = range[0];
            toMonth = range[1];
        }
        let playheadMonth = playhead != null ? playhead : toMonth;
        let filteredMiningSites = Object.assign(Object.assign({}, miningSites), { features: miningSites.features.filter(feature => {
                const matchesDistrict = selectedDistricts.length === 0 ||
                    selectedDistricts.includes(feature.properties.district);
                let matchesDate = true;
                if (year != null && playhead != null) {
                    const detected = feature.properties.detected_date;
                    if (!detected)
                        return false;
                    const detectedYear = Number(detected.slice(0, 4));
                    const detectedMonth = Number(detected.slice(5, 7)) - 1;
                    matchesDate = detectedYear === year &&
                        detectedMonth <= playheadMonth &&
                        detectedMonth >= fromMonth &&
                        detectedMonth <= toMonth;
                }
                else if ((dateRange === null || dateRange === void 0 ? void 0 : dateRange.from) && (dateRange === null || dateRange === void 0 ? void 0 : dateRange.to)) {
                    matchesDate = feature.properties.detected_date >= dateRange.from &&
                        feature.properties.detected_date <= dateRange.to;
                }
                return matchesDistrict && matchesDate;
            }) });
        if (selectedDistricts.length > 0) {
            filteredMiningSites = filterByDistance(districts, filteredMiningSites, 1000000 // 1 km
            );
        }
        const filteredDistricts = Object.assign(Object.assign({}, districts), { features: districts.features.filter(feature => selectedDistricts.length === 0 ||
                selectedDistricts.includes(feature.properties.district)) });
        console.log('Filtered Mining Sites:', filteredMiningSites.features.length);
        set({ filteredMiningSites, filteredDistricts });
    },
    fetchReports: async () => {
        try {
            const reports = await apiClient.reports.all();
            set({
                reports,
                reportsLastUpdated: Date.now(),
                error: null
            });
        }
        catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch reports',
                reportsLastUpdated: Date.now() // Still update timestamp even on error
            });
        }
    },
    fetchAllData: async () => {
        set({ isLoading: true, error: null });
        try {
            // Fetch all data in parallel
            const [districts, forestReserves, rivers, miningSites] = await Promise.allSettled([
                apiClient.spatial.districts(),
                apiClient.spatial.forestReserves(),
                apiClient.spatial.rivers(),
                apiClient.spatial.miningSites(),
            ]);
            // const districts = await apiClient.spatial.districts();
            // const forestReserves = await apiClient.spatial.forestReserves();
            // const rivers = await apiClient.spatial.rivers();
            // const miningSites = await apiClient.spatial.miningSites();
            set({
                districts: districts.status === "fulfilled" ? districts.value : null,
                forestReserves: forestReserves.status === "fulfilled" ? forestReserves.value : null,
                rivers: rivers.status === "fulfilled" ? rivers.value : null,
                miningSites: miningSites.status === "fulfilled" ? miningSites.value : null,
                reportsLastUpdated: Date.now(),
                filteredMiningSites: miningSites.status === "fulfilled" ? miningSites.value : null,
                filteredDistricts: districts.status === "fulfilled" ? districts.value : null,
                isLoading: false,
                error: null
            });
        }
        catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch data',
                isLoading: false
            });
        }
    }
}));
// Set up automatic reports refresh
let refreshInterval = null;
export const setupReportsRefresh = () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated)
        return;
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    // Initial fetch
    useSpatialStore.getState().fetchReports();
    refreshInterval = setInterval(() => {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
            useSpatialStore.getState().fetchReports();
        }
        else {
            cleanupReportsRefresh();
        }
    }, 10000); // Refresh every 10 seconds
};
export const cleanupReportsRefresh = () => {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
};
