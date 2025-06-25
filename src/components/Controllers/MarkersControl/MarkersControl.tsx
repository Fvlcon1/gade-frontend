"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Text from "@styles/components/text";
import theme from "@styles/theme";
import { useDistrictSearch } from '@/hooks/spatial-data';
import { useDebounce } from 'react-use';
import { useSpatialStore } from '@/lib/store/spatial-store';
import { IoClose } from "react-icons/io5";
import ClickableTab from "@components/ui/clickable/clickabletab";
import Districts from "./components/districts";
import DateRange from "./components/date-range";
import BlurContainer from "@components/ui/blur-container";
import Actions from "./components/actions";
import { Slider } from "antd";
import { colors } from '../../../app/styles/theme';
import RiverFilter from "./components/river-filter";
import ForestReserveFilter from "./components/forest-reserve-filter";

const DateRanges = ["Last month", "Last 2 months"];

const getLastSixMonths = () => {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: date.toLocaleString("default", { month: "short" }),
      value: date.toISOString().split('T')[0],
    });
  }
  return months;
};

const MarkersControl = ({ isOpen, onClose, sidebarExpanded = false }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDateCollapsed, setIsDateCollapsed] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [activeRange, setActiveRange] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [pendingDistricts, setPendingDistricts] = useState<string[]>([]);
  const [monthRange, setMonthRange] = useState([0, getLastSixMonths().length - 1]);

  const {
    setSelectedDistricts,
    setHighlightedDistricts,
    setDateRange,
    dateRange: storeDateRange,
    selectedDistricts: storeSelectedDistricts,
    applyFilters,
    setProximityFilters,
  } = useSpatialStore();

  const months = useMemo(() => getLastSixMonths(), []);

  const searchResultsRef = useRef<HTMLDivElement>(null);
  const selectedDistrictsRef = useRef<HTMLDivElement>(null);

  const { data: searchResults, isLoading: isSearching } = useDistrictSearch(debouncedSearchTerm);

  const { districtsToShow, searchResultDistricts } = useMemo(() => {
    const searchResultDistricts = searchResults?.result || [];
    const districtsToShow = searchResultDistricts.filter(district =>
      !pendingDistricts.includes(district)
    );
    return { districtsToShow, searchResultDistricts };
  }, [searchResults?.result, pendingDistricts]);

  const toggleDistrict = useCallback((district: string) => {
    setPendingDistricts(prev => {
      const isSelected = prev.includes(district);
      return isSelected ? prev.filter(d => d !== district) : [...prev, district];
    });
  }, [setPendingDistricts]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  }, []);

  const toggleCollapse = useCallback(() => setIsCollapsed(!isCollapsed), [isCollapsed]);

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm]
  );

  // Sync selected districts with store
  useEffect(() => {
    setSelectedDistricts(selected);
    applyFilters();
  }, [selected, setSelectedDistricts, applyFilters]);

  // Sync date range with store
  useEffect(() => {
    if (fromDate || toDate) {
      setDateRange({
        from: fromDate || null,
        to: toDate || null,
      });
      applyFilters();
    }
  }, [fromDate, toDate, setDateRange, applyFilters]);

  // Synchronize monthRange with fromDate and toDate
  useEffect(() => {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      const monthValues = months.map(m => m.value);
      const fromIndex = monthValues.indexOf(from.toISOString().split('T')[0]);
      const toIndex = monthValues.indexOf(to.toISOString().split('T')[0]);
      if (fromIndex !== -1 && toIndex !== -1) {
        setMonthRange([fromIndex, toIndex]);
      } else {
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);
        const fromDiffs = months.map((m, i) => ({
          index: i,
          diff: Math.abs(new Date(m.value).getTime() - fromDateObj.getTime()),
        }));
        const toDiffs = months.map((m, i) => ({
          index: i,
          diff: Math.abs(new Date(m.value).getTime() - toDateObj.getTime()),
        }));
        const fromClosest = fromDiffs.reduce((min, curr) => curr.diff < min.diff ? curr : min, fromDiffs[0]);
        const toClosest = toDiffs.reduce((min, curr) => curr.diff < min.diff ? curr : min, toDiffs[0]);
        setMonthRange([Math.min(fromClosest.index, toClosest.index), Math.max(fromClosest.index, toClosest.index)]);
      }
    }
  }, [fromDate, toDate, months]);

  // Sync pending districts with store selections
  useEffect(() => {
    setPendingDistricts(storeSelectedDistricts);
  }, [storeSelectedDistricts]);

  // Update highlighted districts when pending districts change
  useEffect(() => {
    setHighlightedDistricts(pendingDistricts);
  }, [pendingDistricts, setHighlightedDistricts]);

  const handleReset = useCallback(() => {
    setPendingDistricts([]);
    setSelected([]);
    setSelectedDistricts([]);
    setHighlightedDistricts([]);
    setFromDate("");
    setToDate("");
    setMonthRange([0, months.length - 1]);
    setActiveRange("");
    setDateRange({ from: null, to: null });
    applyFilters();
    setProximityFilters({ minProximityToRiver: 0, maxProximityToRiver: 0, minProximityToForestReserve: 0, maxProximityToForestReserve: 0 });
  }, [setSelectedDistricts, setHighlightedDistricts, setDateRange, applyFilters, months.length]);

  const handleApplyDistricts = () => {
    if (pendingDistricts.length === 0) {
      handleReset();
    } else {
      setSelected(pendingDistricts);
      setSelectedDistricts(pendingDistricts);
      setHighlightedDistricts([]); // Clear highlights after applying
      applyFilters();
    }
  };

  const handlePresetRange = (range: string) => {
    setActiveRange(range);
    const now = new Date();
    let from = new Date();
    let to = new Date();

    switch (range) {
      case "Last month":
        from.setMonth(from.getMonth() - 1);
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setDate(0);
        to.setHours(23, 59, 59, 999);
        break;
      case "Last 2 months":
        from.setMonth(from.getMonth() - 2);
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setDate(0);
        to.setHours(23, 59, 59, 999);
        break;
      default:
        return;
    }

    const fromStr = from.toISOString().split('T')[0];
    const toStr = to.toISOString().split('T')[0];
    setFromDate(fromStr);
    setToDate(toStr);

    const monthValues = months.map(m => m.value);
    const fromIndex = monthValues.indexOf(fromStr) !== -1 ? monthValues.indexOf(fromStr) : 0;
    const toIndex = monthValues.indexOf(toStr) !== -1 ? monthValues.indexOf(toStr) : months.length - 1;
    setMonthRange([fromIndex, toIndex]);
  };

  const handleMonthRangeChange = (index: number, value: number) => {
    const newRange = [...monthRange];
    if (index === 0) {
      newRange[0] = Math.min(value, monthRange[1]);
    } else {
      newRange[1] = Math.max(value, monthRange[0]);
    }
    setMonthRange(newRange);
    setFromDate(months[newRange[0]].value);
    setToDate(months[newRange[1]].value);
    setActiveRange("");
  };

  const Divider = () => {
    return (
      <div className="w-full pl-3">
        <div className="w-full h-0.25 bg-border-primary" />
      </div>
    )
  }

  const leftPosition = sidebarExpanded ? "296px" : "136px";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{ left: leftPosition }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute top-[10px] z-[1001] w-[270px] gap-2 flex flex-col"
        >
          <div className="w-full h-[33px] bg-white/80 backdrop-blur-sm shadow-xl px-3 pr-1 flex items-center justify-between rounded-[10px]">
            <Text bold={theme.text.bold.md}>
              Filter
            </Text>
            <ClickableTab onClick={onClose}>
              <IoClose
                size={17}
                color={theme.colors.text.secondary}
              />
            </ClickableTab>
          </div>

          <BlurContainer className="flex flex-col gap-3 py-3">
            <Districts
              isCollapsed={isDateCollapsed}
              toggleCollapse={() => setIsDateCollapsed(!isDateCollapsed)}
              isRefreshing={isRefreshing}
              handleReset={handleReset}
              searchResults={searchResults}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              districtsToShow={districtsToShow}
              pendingDistricts={pendingDistricts}
              toggleDistrict={toggleDistrict}
              handleApplyDistricts={handleApplyDistricts}
              isSearching={isSearching}
              searchResultsRef={searchResultsRef}
              selectedDistrictsRef={selectedDistrictsRef}
            />

            <Divider />

            <DateRange
              isOpen={isOpen}
              setDateRange={setDateRange}
              setActiveRange={setActiveRange}
              onClose={onClose}
              sidebarExpanded={sidebarExpanded}
              setIsRefreshing={setIsRefreshing}
              handleMonthRangeChange={handleMonthRangeChange}
              handlePresetRange={handlePresetRange}
              DateRanges={DateRanges}
              activeRange={activeRange}
              fromDate={fromDate}
              toDate={toDate}
              setFromDate={setFromDate}
              setToDate={setToDate}
            />

            <Divider />
            <RiverFilter />
            <Divider />
            <ForestReserveFilter />
            <Divider />
            <Actions
              handleReset={handleReset}
              handleApply={applyFilters}
            />
          </BlurContainer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MarkersControl;