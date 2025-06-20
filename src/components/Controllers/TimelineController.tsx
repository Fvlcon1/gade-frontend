"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { FaPlay, FaChevronDown, FaChevronRight, FaCalendar, FaClock, FaPause } from "react-icons/fa";
import { AiOutlineReload } from "react-icons/ai";
import { motion } from "framer-motion";
import Text from "@styles/components/text";
import theme from "@styles/theme";

interface TimelineControllerProps {
  isOpen: boolean;
  onClose: () => void;
  sidebarExpanded?: boolean;
  onModeChange: (mode: 'timeline' | 'comparison') => void;
  range: [number, number];
  onRangeChange: (index: number, value: number) => void;
  selectedYear: number;
  onYearChange: (year: number) => void;
  playhead?: number | null;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onPlayheadChange?: (playhead: number) => void;
  onReset?: () => void;
  onCompare?: (startDate: string, endDate: string) => void;
}

const getLastSixMonths = () => {
  const now = new Date();
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(date.toLocaleString("default", { month: "short" }));
  }
  return months;
};

const TimelineController: React.FC<TimelineControllerProps> = ({ 
  isOpen, 
  onClose, 
  sidebarExpanded = false, 
  onModeChange,
  range: externalRange,
  onRangeChange: externalOnRangeChange,
  selectedYear: externalSelectedYear,
  onYearChange: externalOnYearChange,
  playhead,
  isPlaying,
  onPlay,
  onPause,
  onPlayheadChange,
  onReset,
  onCompare
}) => {
  const months = getLastSixMonths();
  const [activeTab, setActiveTab] = useState('timeline');
  const [range, setRange] = useState(externalRange || [0, months.length - 1]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedYear, setSelectedYear] = useState(externalSelectedYear || new Date().getFullYear());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with external state
  useEffect(() => {
    if (externalRange) {
      setRange(externalRange);
    }
  }, [externalRange]);

  useEffect(() => {
    if (externalSelectedYear) {
      setSelectedYear(externalSelectedYear);
    }
  }, [externalSelectedYear]);

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i);
    }
    return years;
  };

  const years = getYears();

  const handleReset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const newRange = [0, months.length - 1];
    setRange(newRange);
    if (externalOnRangeChange) {
      externalOnRangeChange(0, 0);
      externalOnRangeChange(1, months.length - 1);
    }
    if (onPlayheadChange) {
      onPlayheadChange(0);
    }
    if (onPause) {
      onPause();
    }
    if (onReset) {
      onReset();
    }
  };

  const handlePlayClick = () => {
    if (!isPlaying) {
      if (onPlay) onPlay();
    } else {
      if (onPause) onPause();
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onModeChange(tab);
    if (onPause) onPause();
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    if (externalOnYearChange) {
      externalOnYearChange(year);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || playhead == null) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // If we've reached the end of the range
    if (playhead >= range[1]) {
      handleReset();
      return;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Schedule next update
    timeoutRef.current = setTimeout(() => {
      const nextPlayhead = playhead + 1;
      if (nextPlayhead <= range[1]) {
        if (onPlayheadChange) {
          onPlayheadChange(nextPlayhead);
        }
      } else {
        handleReset();
      }
    }, 2200);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [playhead, isPlaying, range, onPlayheadChange]);

  const handleRangeChange = (index, value) => {
    const newRange = [...range];
    newRange[index] = value;
    if (newRange[0] <= newRange[1]) {
      setRange(newRange);
      if (externalOnRangeChange) {
        externalOnRangeChange(index, value);
      }
      // Ensure playhead stays within new range
      if (playhead != null && (playhead < newRange[0] || playhead > newRange[1])) {
        if (onPlayheadChange) {
          onPlayheadChange(newRange[0]);
        }
      }
    }
  };

  // Set initial mode when component mounts
  useEffect(() => {
    if (isOpen && onModeChange) {
      onModeChange(activeTab as 'timeline' | 'comparison');
    }
  }, [isOpen, onModeChange, activeTab]);

  if (!isOpen) return null;
  const leftPosition = sidebarExpanded ? "296px" : "136px";

  return (
    <motion.div
      animate={{ left: leftPosition }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute top-[10px] z-[1001] w-[280px]"
    >
      {/* Header */}
      <div className="w-[27] h-[26px] bg-white/80 shadow-md px-2 flex mb-2 items-center justify-between rounded-[7px]">
        <Text size={theme.text.size.body} bold={theme.text.bold.md} className="!text-[var(--color-text-primary)]">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-xl leading-none">×</button>
        </Text>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-white/80 backdrop-blur-sm rounded-lg shadow-md mb-2 overflow-hidden">
        <button
          onClick={() => handleTabChange('timeline')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 cursor-pointer px-3 text-sm font-medium transition-colors ${
            activeTab === 'timeline'
              ? 'bg-[var(--color-main-primary)] text-white'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          <FaClock size={12} />
          Timeline
        </button>
        <button
          onClick={() => handleTabChange('comparison')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium transition-colors ${
            activeTab === 'comparison'
              ? 'bg-[var(--color-main-primary)] text-white'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          <FaCalendar size={12} />
          Compare
        </button>
      </div>

      {/* Timeline Tab Content */}
      {activeTab === 'timeline' && (
        <motion.div
          animate={{ height: isCollapsed ? 35 : 145 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-[280px] overflow-hidden bg-white/85 backdrop-blur-xs shadow-md px-2 py-3 rounded-[10px]"
        >
          <div className="flex items-center justify-between w-full h-[18px]">
            <Text size={theme.text.size.SM} bold={theme.text.bold.md} className="text-gray-700">
              Mining activity timeline
            </Text>
            {isCollapsed ? (
              <FaChevronRight size={14} className="cursor-pointer text-gray-500" onClick={() => setIsCollapsed(false)} />
            ) : (
              <FaChevronDown size={14} className="cursor-pointer text-gray-500" onClick={() => setIsCollapsed(true)} />
            )}
          </div>

          {!isCollapsed && (
            <>
              <Text size={theme.text.size.SM} bold={theme.text.bold.sm} className="text-gray-500 mt-2">
                Filter mining activity by date
              </Text>

              {/* Year Selection */}
              <div className="flex items-center gap-2 mt-3 mb-3">
                <FaCalendar size={12} className="text-gray-400" />
                <select
                  value={selectedYear}
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
                  className="text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#635bff] flex-1"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={handlePlayClick}
                  className={`flex items-center justify-center gap-1 px-3 py-1.5 text-white text-xs leading-none rounded transition-all duration-200 ${
                    isPlaying
                      ? "bg-[var(--color-main-primary)] hover:bg-[#5148d4]"
                      : "bg-[var(--color-main-primary)] hover:bg-[#5148d4]"
                  }`}
                >
                  {isPlaying ? <FaPause size={10} /> : <FaPlay size={10} />}
                  {isPlaying ? "Pause" : "Play"}
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-1 px-2 py-1.5 bg-white text-gray-600 border border-gray-300 rounded text-xs hover:bg-gray-50 transition-colors"
                >
                  <AiOutlineReload size={10} />
                  Reset
                </button>

                <div className="text-xs text-gray-500 ml-auto">
                  {selectedYear}: {months[range[0]]} - {months[range[1]]}
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Comparison Tab Content */}
      {activeTab === 'comparison' && (
        <motion.div
          animate={{ height: isCollapsed ? 35 : 150 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-[280px] overflow-hidden bg-white/85 backdrop-blur-xs shadow-md px-3 py-3 rounded-[10px]"
        >
          <div className="w-full h-[21px] flex items-center justify-between">
            <Text size={theme.text.size.SM} bold={theme.text.bold.md} className="!text-[var(--color-text-secondary)]">
              Dual date comparison
            </Text>
            {isCollapsed ? (
              <FaChevronRight size={15.06} className="cursor-pointer text-gray-500" onClick={() => setIsCollapsed(false)} />
            ) : (
              <FaChevronDown size={16.06} className="cursor-pointer text-gray-500" onClick={() => setIsCollapsed(true)} />
            )}
          </div>

          {!isCollapsed && (
            <div className="mt-3 flex flex-col gap-3">
              {/* Date Inputs */}
              <div className="flex justify-between items-end">
                {/* START */}
                <div className="flex flex-col w-[110px]">
                  <Text size={theme.text.size.SM} bold={theme.text.bold.sm} className="!text-[var(--color-text-tetiary)] mb-1">Start</Text>
                  <div
                    className="flex items-center w-full h-[28px] border-[var(--border-tetiary)] rounded-[6px] justify-center px-1 border-[1px] bg-white/50 cursor-pointer hover:bg-white/70 transition-colors"
                    onClick={() => (document.getElementById("start-date-input") as HTMLInputElement)?.showPicker()}
                  >
                    <FaCalendar size={10} className="text-[var(--color-text-tetiary)] mr-1" />
                    <input
                      id="start-date-input"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      max={endDate || undefined}
                      className="flex-1 text-[11px] text-center text-[var(--color-text-tetiary)] bg-transparent outline-none placeholder:text-gray-400"
                      style={{ WebkitAppearance: "none", appearance: "none" }}
                    />
                  </div>
                </div>

                <div className="flex items-end pb-2 px-1">
                  <Text size={theme.text.size.SM} bold={theme.text.bold.md} className="!text-[var(--color-text-tetiary)]">...</Text>
                </div>

                {/* END */}
                <div className="flex flex-col w-[110px]">
                  <Text size={theme.text.size.SM} bold={theme.text.bold.sm} className="!text-[var(--color-text-tetiary)] mb-1">End</Text>
                  <div
                    className="flex items-center w-full h-[28px] border-[var(--border-tetiary)] rounded-[6px] justify-center px-1 border-[1px] bg-white/50 cursor-pointer hover:bg-white/70 transition-colors"
                    onClick={() => (document.getElementById("end-date-input") as HTMLInputElement)?.showPicker()}
                  >
                    <FaCalendar size={10} className="text-[var(--color-text-tetiary)] mr-1" />
                    <input
                      id="end-date-input"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || undefined}
                      className="flex-1 text-[11px] text-center text-[var(--color-text-tetiary)] bg-transparent outline-none placeholder:text-gray-400"
                      style={{ WebkitAppearance: "none", appearance: "none" }}
                    />
                  </div>
                </div>
              </div>

              {/* Compare & Reset */}
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => { 
                  if (onCompare && startDate && endDate) onCompare(startDate, endDate);
                   }}
                  className="flex items-center justify-center flex-1 h-[28px] cursor-pointer rounded-[6px] text-white bg-[var(--color-main-primary)] hover:bg-[#4e43c6] text-sm font-medium transition-colors"
                >
                  Compare
                </button>
                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="flex items-center justify-center w-[28px] h-[28px] bg-white border border-gray-300 rounded-[6px] shadow-sm text-[#425466] hover:bg-gray-50 transition-colors"
                >
                  <AiOutlineReload size={12} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default TimelineController;