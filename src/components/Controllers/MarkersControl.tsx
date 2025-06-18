"use client";
import { motion } from "framer-motion";
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
    applyFilters 
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
  }, []);

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

  if (!isOpen) return null;
  const leftPosition = sidebarExpanded ? "296px" : "136px";

  return (
    <motion.div
      animate={{ left: leftPosition }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute top-[10px] z-[1001] w-[300px]"
    >
      <div className="w-full h-[33px] bg-white/80 backdrop-blur-sm shadow-md px-4 flex mb-2 items-center justify-between rounded-[10px]">
        <Text size={theme.text.size.body} bold={theme.text.bold.md} className="!text-[var(--color-text-primary)]">
          Filter
        </Text>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-xl leading-none">×</button>
      </div>

      <motion.div
        animate={{ height: isCollapsed ? 35 : 360 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full overflow-hidden bg-white/80 backdrop-blur-sm shadow-md px-4 py-[8px] rounded-[10px] relative"
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
          <div className="flex flex-col pb-9">
            <div className="flex-shrink-0 mt-4">
              <div className="w-full h-[40px] bg-white border border-[var(--color-border-primary)] rounded-[8px] px-3 flex items-center gap-2 relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search district..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none h-full" 
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                )}
              </div>

              <div 
                ref={searchResultsRef} 
                className="mt-3 h-[80px] overflow-y-auto px-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
              >
                <style jsx global>{`
                  .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                  }
                  .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                    border-radius: 3px;
                  }
                  .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 3px;
                    transition: background 0.2s ease;
                  }
                  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                  }
                  .scrollbar-thin {
                    scrollbar-width: thin;
                    scrollbar-color: #d1d5db transparent;
                  }
                `}</style>
                <div className="flex flex-wrap gap-1.5 pr-1">
                  {districtsToShow.length === 0 && searchTerm && !isSearching ? (
                    <div className="w-full text-center text-sm text-gray-500 py-2">
                      No districts found
                    </div>
                  ) : (
                    districtsToShow.map((district) => (
                      <button
                        key={district}
                        onClick={() => toggleDistrict(district)}
                        className="flex items-center gap-1 h-[26px] px-2.5 rounded-full border border-gray-300 text-gray-500 text-xs font-medium transition cursor-pointer hover:border-[var(--color-main-primary)] hover:text-[var(--color-main-primary)]"
                      >
                        {district.toUpperCase()}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {pendingDistricts.length > 0 && (
              <div 
                ref={selectedDistrictsRef}
                className="mt-3 mb-0 pt-2 border-t border-gray-200 bg-gray-50/50 rounded-lg px-2 pb-2"
              >
                <Text size={theme.text.size.SM} bold={theme.text.bold.sm} className="text-gray-500 mb-1">
                  Selected Districts ({pendingDistricts.length})
                </Text>
                <div className="h-[80px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pr-1">
                    {pendingDistricts.map((district) => (
                      <button
                        key={district}
                        onClick={() => toggleDistrict(district)}
                        className="flex items-center gap-1 h-[24px] px-2 rounded-full border border-[var(--color-main-primary)] text-[var(--color-main-primary)] text-xs font-medium transition cursor-pointer hover:bg-[var(--color-main-primary)]/10 whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        <span className="w-[14px] h-[14px] rounded-full bg-[var(--color-main-primary)] flex items-center justify-center flex-shrink-0">
                          <IoMdCheckmark size={10} className="text-white" />
                        </span>
                        <span className="truncate">{district.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!isCollapsed && (
          <div className="absolute bottom-0 right-0 left-0 px-4 py-1.5 border-t border-gray-100 rounded-b-[10px]">
            <div className="flex justify-end">
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
    
      <motion.div
        animate={{ height: isDateCollapsed ? 35 : 325 }}
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
            <div className="rounded-[10px] w-full bg-[#EBEBEB]/40 px-3">
              <Text size={theme.text.size.SM} bold={theme.text.bold.sm} className="text-gray-500 mb-2">
                Select date range using slider
              </Text>
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

            <div className="text-center text-sm text-gray-500">- or -</div>

            <div className="flex justify-between px-2">
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
                    placeholder="Select date"
                    value={fromDate}
                    max={toDate || undefined}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full text-[12px] text-center text-[var(--color-text-tetiary)] bg-transparent outline-none placeholder:text-gray-400 cursor-pointer"
                    style={{ WebkitAppearance: "none", appearance: "none" }}
                  />
                </div>
              </div>

              <div className="flex items-end pb-2">
                <Text size={theme.text.size.SM} bold={theme.text.bold.md} className="!text-[var(--color-text-tetiary)]">...</Text>
              </div>

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
                    placeholder="Select date"
                    value={toDate}
                    min={fromDate || undefined}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full text-[12px] text-center text-[var(--color-text-tetiary)] bg-transparent outline-none placeholder:text-gray-400 cursor-pointer"
                    style={{ WebkitAppearance: "none", appearance: "none" }}
                  />
                </div>
              </div>
            </div>

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