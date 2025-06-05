"use client";
import { motion, useMotionValue, useTransform, useDragControls } from "framer-motion";
import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { AiOutlineReload } from "react-icons/ai";
import { FaChevronDown, FaChevronRight, FaCalendar } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import Text from "@styles/components/text";
import theme from "@styles/theme";
import { useDistrictSearch } from '@/hooks/spatial-data';
import { useDebounce } from 'react-use';
import { Loader2 } from 'lucide-react';
import { useSpatialStore } from '@/lib/store/spatialStore';

// Initial districts list - will be populated from search
const initialDistricts: string[] = [];
const DateRanges = ["Last month", "Last 2 months"];

// Helper function to get last 6 months
const getLastSixMonths = () => {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: date.toLocaleString("default", { month: "short" }),
      value: date.toISOString().split('T')[0]
    });
  }
  return months;
};

const MarkersControl = ({ isOpen, onClose, sidebarExpanded = false }) => {
  // All state hooks
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDateCollapsed, setIsDateCollapsed] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [activeRange, setActiveRange] = useState("Yesterday");
  const [containerHeight, setContainerHeight] = useState(200);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedDistrictsHeight, setSelectedDistrictsHeight] = useState(0);
  const { 
    setSelectedDistricts, 
    setHighlightedDistricts,
    setDateRange, 
    dateRange: storeDateRange,
    selectedDistricts: storeSelectedDistricts,
    applyFilters 
  } = useSpatialStore();
  const months = getLastSixMonths();
  const [monthRange, setMonthRange] = useState([0, months.length - 1]);
  const [pendingDistricts, setPendingDistricts] = useState<string[]>([]);

  // All refs
  const containerRef = useRef<HTMLDivElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const selectedDistrictsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const y = useMotionValue(0);
  const height = useTransform(y, [0, -300], [200, 500]);

  // Fetch district search results
  const { data: searchResults, isLoading: isSearching } = useDistrictSearch(debouncedSearchTerm);

  // Process districts data
  const { districtsToShow, searchResultDistricts } = useMemo(() => {
    const searchResultDistricts = searchResults?.result || [];
    const selectedButNotInSearch = selected.filter(district => 
      !searchResultDistricts.includes(district)
    );
    const districtsToShow = [...new Set([...searchResultDistricts, ...selectedButNotInSearch])];
    
    return { districtsToShow, searchResultDistricts };
  }, [searchResults?.result, selected]);

  // All callbacks
  const toggleDistrict = useCallback((district: string) => {
    setPendingDistricts(prev => {
      const isSelected = prev.includes(district);
      if (isSelected) {
        return prev.filter(d => d !== district);
      } else {
        return [...prev, district];
      }
    });
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  }, []);

  const toggleCollapse = useCallback(() => setIsCollapsed(!isCollapsed), [isCollapsed]);

  const handleDragEnd = useCallback(() => {
    const newHeight = Math.max(200, Math.min(500, containerHeight - y.get()));
    setContainerHeight(newHeight);
    y.set(0);
  }, [containerHeight, y]);

  // Debounce effect
  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm]
  );

  // Update selected districts height when it changes
  useEffect(() => {
    if (selectedDistrictsRef.current) {
      const height = selectedDistrictsRef.current.offsetHeight;
      setSelectedDistrictsHeight(height);
    }
  }, [selected.length, searchResults?.result]); // Update when selections or search results change

  // Height calculation effect
  useEffect(() => {
    if (!isCollapsed && containerRef.current) {
      const minHeight = 200; // Minimum height
      const baseHeight = 120; // Height for search input and padding
      const searchResultsHeight = 120; // Fixed height for search results
      
      // Only grow if we have selected districts that need more space
      const shouldGrow = selected.length > 0;
      
      if (shouldGrow) {
        // Calculate height needed for selected districts
        const selectedDistrictsRequiredHeight = selectedDistrictsHeight + 20; // Add padding
        const requiredHeight = baseHeight + searchResultsHeight + selectedDistrictsRequiredHeight;
        setContainerHeight(Math.max(minHeight, requiredHeight));
      } else {
        // Reset to minimum height if no selections
        setContainerHeight(minHeight);
      }
    }
  }, [
    isCollapsed,
    selected.length,
    selectedDistrictsHeight // Use the state instead of ref
  ]);

  // Update store when selections change
  useEffect(() => {
    setSelectedDistricts(selected);
  }, [selected, setSelectedDistricts]);

  // Update store when date range changes
  useEffect(() => {
    if (fromDate || toDate) {
      setDateRange({
        from: fromDate || null,
        to: toDate || null
      });
      applyFilters(); // Apply filters after updating date range
    }
  }, [fromDate, toDate, setDateRange, applyFilters]);

  // Update date inputs when month range changes
  useEffect(() => {
    if (monthRange[0] !== undefined && monthRange[1] !== undefined) {
      setFromDate(months[monthRange[0]].value);
      setToDate(months[monthRange[1]].value);
      setActiveRange(""); // Clear preset when using slider
    }
  }, [monthRange]);

  // Update pending districts when selection changes
  useEffect(() => {
    setPendingDistricts(selected);
  }, [selected]);

  // Update highlighted districts when selection changes
  useEffect(() => {
    setHighlightedDistricts(pendingDistricts);
  }, [pendingDistricts, setHighlightedDistricts]);

  // Update pending districts when store selection changes
  useEffect(() => {
    setPendingDistricts(storeSelectedDistricts);
  }, [storeSelectedDistricts]);

  // Reset all filters
  const handleReset = useCallback(() => {
    setPendingDistricts([]);
    setSelectedDistricts([]);
    setHighlightedDistricts([]);
    setFromDate("");
    setToDate("");
    setMonthRange([0, months.length - 1]);
    setActiveRange("");
    applyFilters();
  }, [setSelectedDistricts, setHighlightedDistricts, applyFilters]);

  // Apply district filter changes
  const handleApplyDistricts = () => {
    if (pendingDistricts.length === 0) {
      handleReset();
    } else {
      setSelectedDistricts(pendingDistricts);
      setHighlightedDistricts([]);
      applyFilters();
    }
  };

  // Update preset date range handler
  const handlePresetRange = (range: string) => {
    setActiveRange(range);
    const now = new Date();
    let from = new Date();
    let to = new Date();

    switch (range) {
      case "Last month":
        from.setMonth(from.getMonth() - 1);
        from.setDate(1); // Start of last month
        from.setHours(0, 0, 0, 0);
        to.setDate(0); // Last day of last month
        to.setHours(23, 59, 59, 999);
        break;
      case "Last 2 months":
        from.setMonth(from.getMonth() - 2);
        from.setDate(1); // Start of two months ago
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      default:
        from = new Date(0);
        to = new Date();
    }

    setFromDate(from.toISOString().split('T')[0]);
    setToDate(to.toISOString().split('T')[0]);
    // Reset month range when using presets
    setMonthRange([0, months.length - 1]);
  };

  const handleMonthRangeChange = (index: number, value: number) => {
    const newRange = [...monthRange];
    newRange[index] = value;
    if (newRange[0] <= newRange[1]) {
      setMonthRange(newRange);
    }
  };

  if (!isOpen) return null;
  const leftPosition = sidebarExpanded ? "296px" : "136px";

  return (
    <motion.div
      animate={{ left: leftPosition }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute top-[10px] z-[1001] w-[300px]"
    >
      {/* Header */}
      <div className="w-full h-[33px] bg-white/80 backdrop-blur-sm shadow-md px-4 flex mb-2 items-center justify-between rounded-[10px]">
        <Text size={theme.text.size.body} bold={theme.text.bold.md} className="!text-[var(--color-text-primary)]">
          Filter
        </Text>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-xl leading-none">×</button>
      </div>

      {/* Filter by Districts */}
      <motion.div
        ref={containerRef}
        animate={{ height: isCollapsed ? 35 : containerHeight + 40 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full overflow-hidden bg-white/80 backdrop-blur-sm shadow-md px-4 py-[8px] rounded-[10px]"
      >
        <div 
          className="w-full h-[24px] flex items-center justify-between cursor-pointer"
          onClick={toggleCollapse}
        >
          <Text size={theme.text.size.SM} bold={theme.text.bold.md} className="!text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
            Filter by districts
          </Text>
          <div className="flex items-center gap-2 text-gray-500">
            {!isCollapsed && (
              <motion.div
                onClick={handleReset}
                animate={{ rotate: isRefreshing ? 360 : 0 }}
                transition={{ duration: 0.8 }}
                className="cursor-pointer hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                title="Reset filters"
              >
                <AiOutlineReload size={16} />
              </motion.div>
            )}
            {isCollapsed ? (
              <FaChevronRight size={15.06} className="cursor-pointer hover:text-gray-700" onClick={(e) => {
                e.stopPropagation();
                toggleCollapse();
              }} />
            ) : (
              <FaChevronDown size={16.06} className="cursor-pointer hover:text-gray-700" onClick={(e) => {
                e.stopPropagation();
                toggleCollapse();
              }} />
            )}
          </div>
        </div>

        {!isCollapsed && (
          <div className="mt-2 flex flex-col h-[calc(100%-40px)]">
            {/* Search input */}
            <div className="w-full h-[36px] bg-white border border-[var(--color-border-primary)] rounded-[8px] px-3 flex items-center gap-2 relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search district..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none" 
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>

            {/* Search results at the top - fixed height */}
            <div 
              ref={searchResultsRef} 
              className="mt-2 h-[120px] overflow-y-auto hide-scrollbar"
            >
              <div className="flex flex-wrap gap-2">
                {districtsToShow.length === 0 && searchTerm && !isSearching ? (
                  <div className="w-full text-center text-sm text-gray-500 py-2">
                    No districts found
                  </div>
                ) : (
                  districtsToShow
                    .filter(district => !selected.includes(district))
                    .map((district) => (
                  <button
                    key={district}
                    onClick={() => toggleDistrict(district)}
                        className="flex items-center gap-1.5 h-[24px] px-3 rounded-full border border-gray-300 text-gray-500 text-xs font-medium transition cursor-pointer hover:border-[var(--color-main-primary)] hover:text-[var(--color-main-primary)]"
                  >
                        {district.toUpperCase()}
                  </button>
                    ))
                )}
              </div>
            </div>

            {/* Selected districts section */}
            {pendingDistricts.length > 0 && (
              <div 
                ref={selectedDistrictsRef}
                className="mt-2 pt-2 border-t border-gray-200 bg-gray-50/50 rounded-lg px-2 pb-2"
              >
                <Text size={theme.text.size.SM} bold={theme.text.bold.sm} className="text-gray-500 mb-2">
                  Selected Districts ({pendingDistricts.length})
                </Text>
                <div className="grid grid-cols-2 gap-2">
                  {pendingDistricts.map((district) => (
                    <button
                      key={district}
                      onClick={() => {
                        setPendingDistricts(prev => 
                          prev.filter(d => d !== district)
                        );
                      }}
                      className="flex items-center gap-1.5 h-[24px] px-3 rounded-full border border-[var(--color-main-primary)] text-[var(--color-main-primary)] text-xs font-medium transition cursor-pointer hover:bg-[var(--color-main-primary)]/10 whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      <span className="w-[16px] h-[16px] rounded-full bg-[var(--color-main-primary)] flex items-center justify-center flex-shrink-0">
                        <IoMdCheckmark size={12} className="text-white" />
                      </span>
                      <span className="truncate">{district.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Apply/Reset button - always show */}
            <div className="flex justify-end mt-3 px-2">
              <button
                onClick={handleApplyDistricts}
                className="px-4 py-1.5 text-white text-sm font-medium rounded-lg transition-colors bg-[var(--color-main-primary)] hover:bg-[var(--color-main-primary)]/90"
              >
                {pendingDistricts.length === 0 ? 'Reset' : 'Apply Filter'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    
      {/* Filter by Date Range */}
      <motion.div
        animate={{ height: isDateCollapsed ? 35 : 380 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full overflow-hidden bg-white/80 backdrop-blur-sm shadow-md px-4 py-[8px] rounded-[10px] mt-2"
      >
        <div 
          className="w-full h-[24px] flex items-center justify-between cursor-pointer"
          onClick={() => setIsDateCollapsed(!isDateCollapsed)}
        >
          <Text size={theme.text.size.SM} bold={theme.text.bold.md} className="!text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
            Filter by date range
          </Text>

          <div className="flex items-center gap-2 text-gray-500">
            {!isDateCollapsed && (
              <motion.div
                onClick={(e) => {
                  e.stopPropagation();
                  handleRefresh();
                }}
                animate={{ rotate: isRefreshing ? 360 : 0 }}
                transition={{ duration: 0.8 }}
                className="cursor-pointer hover:text-gray-700"
              >
                <AiOutlineReload size={14.22} />
              </motion.div>
            )}
            {isDateCollapsed ? (
              <FaChevronRight size={15.06} className="cursor-pointer hover:text-gray-700" onClick={(e) => {
                e.stopPropagation();
                setIsDateCollapsed(false);
              }} />
            ) : (
              <FaChevronDown size={16.06} className="cursor-pointer hover:text-gray-700" onClick={(e) => {
                e.stopPropagation();
                setIsDateCollapsed(true);
              }} />
            )}
          </div>
        </div>

        {!isDateCollapsed && (
          <div className="mt-4 flex flex-col gap-4">
            {/* Months Slider */}
            <div className="rounded-[10px] w-full bg-[#EBEBEB]/140 px-3">
              <Text size={theme.text.size.SM} bold={theme.text.bold.sm} className="text-gray-500 mb-2">
                Select date range using slider
              </Text>
              
              {/* Slider */}
              <div className="relative w-full h-[40px]">
                <div className="absolute top-[50%] left-0 right-0 h-[4px] bg-gray-300 rounded-full -translate-y-1/2" />
                <div
                  className="absolute h-[4px] bg-[var(--color-main-primary)] rounded-full"
                  style={{
                    left: `${(monthRange[0] / (months.length - 1)) * 100}%`,
                    width: `${((monthRange[1] - monthRange[0]) / (months.length - 1)) * 100}%`,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />

                <input
                  type="range"
                  min={0}
                  max={months.length - 1}
                  value={monthRange[0]}
                  onChange={(e) => handleMonthRangeChange(0, parseInt(e.target.value))}
                  className="absolute w-full h-full top-0 left-0 appearance-none bg-transparent z-20 pointer-events-auto"
                />
                <input
                  type="range"
                  min={0}
                  max={months.length - 1}
                  value={monthRange[1]}
                  onChange={(e) => handleMonthRangeChange(1, parseInt(e.target.value))}
                  className="absolute w-full h-full top-0 left-0 appearance-none bg-transparent z-30 pointer-events-auto"
                />
                <style jsx>{`
                  input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 18px;
                    width: 18px;
                    background: var(--color-main-primary);
                    border: 2px solid white;
                    border-radius: 50%;
                    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
                    cursor: pointer;
                    margin-top: -2px;
                    position: relative;
                    z-index: 40;
                  }
                `}</style>
              </div>

              {/* Month Labels */}
              <div className="flex justify-between w-full -mt-3.5 text-xs font-[200] text-gray-500">
                {months.map((month, index) => (
                  <span
                    key={index}
                    className={
                      index === monthRange[0] || index === monthRange[1] 
                        ? "text-[var(--color-main-primary)] font-[500]" 
                        : ""
                    }
                  >
                    {month.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Or use calendar */}
            <div className="text-center text-sm text-gray-500">- or -</div>

            {/* Existing calendar inputs */}
            <div className="flex justify-between px-2">
              {/* FROM */}
              <div className="flex flex-col w-[120px]">
                <Text size={theme.text.size.SM} bold={theme.text.bold.sm} className="!text-[var(--color-text-tetiary)] mb-1">From</Text>
                <div
                  className="flex items-center w-full h-[32px] border-[var(--border-tetiary)] rounded-[10px] justify-around px-[8px] border-[1px] bg-white/80 cursor-pointer hover:bg-white/90 transition-colors"
                  onClick={() => (document.getElementById("from-date-input") as HTMLInputElement)?.showPicker()}
                >
                  <FaCalendar size={14} className="text-[var(--color-text-tetiary)]" />
                  <input
                    id="from-date-input"
                    type="date"
                    placeholder="00/00/0"
                    value={fromDate}
                    max={toDate || undefined}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full text-[12px] text-center text-[var(--color-text-tetiary)] bg-transparent outline-none placeholder:text-gray-400 cursor-pointer"
                    style={{ WebkitAppearance: "none", appearance: "none" }}
                  />
                </div>
              </div>

              {/* Dots */}
              <div className="flex items-end pb-2">
                <Text size={theme.text.size.SM} bold={theme.text.bold.md} className="!text-[var(--color-text-tetiary)]">...</Text>
              </div>

              {/* TO */}
              <div className="flex flex-col w-[120px]">
                <Text size={theme.text.size.SM} bold={theme.text.bold.sm} className="!text-[var(--color-text-tetiary)] mb-1">To</Text>
                <div
                  className="flex items-center w-full h-[32px] border-[var(--border-tetiary)] rounded-[10px] justify-around px-[8px] border-[1px] bg-white/80 cursor-pointer hover:bg-white/90 transition-colors"
                  onClick={() => (document.getElementById("to-date-input") as HTMLInputElement)?.showPicker()}
                >
                  <FaCalendar size={14} className="text-[var(--color-text-tetiary)]" />
                  <input
                    id="to-date-input"
                    type="date"
                    placeholder="00/00/0"
                    value={toDate}
                    min={fromDate || undefined}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full text-[12px] text-center text-[var(--color-text-tetiary)] bg-transparent outline-none placeholder:text-gray-400 cursor-pointer"
                    style={{ WebkitAppearance: "none", appearance: "none" }}
                  />
                </div>
              </div>
            </div>

            {/* Preset ranges */}
            <div className="flex flex-col gap-2">
              {DateRanges.map((label) => (
                <button
                  key={label}
                  onClick={() => handlePresetRange(label)}
                  className={`w-full h-[32px] rounded-[7px] text-[13px] font-medium transition-all cursor-pointer ${
                    activeRange === label
                      ? "bg-[var(--color-main-primary)] text-white hover:bg-[var(--color-main-primary)]/90"
                      : "bg-[#e4e0e0] text-[var(--color-text-secondary)] hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MarkersControl;
