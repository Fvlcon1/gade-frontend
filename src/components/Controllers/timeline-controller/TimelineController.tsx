"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { FaPlay, FaChevronDown, FaChevronRight, FaCalendar, FaClock, FaPause } from "react-icons/fa";
import { AiOutlineReload } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import Text from "@styles/components/text";
import theme from "@styles/theme";
import BlurContainer from "@components/ui/blur-container";
import { IoClose } from "react-icons/io5";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import Button from "@components/ui/button/button";
import { GiMagicBroom } from "react-icons/gi";
import OutlineButton from "@components/ui/button/outlineButton";
import { MdOutlineRefresh } from "react-icons/md";
import Timeline from "./components/timeline";
import Compare from "./components/compare/compare";
import TabToggle from "./components/tab-toggle";
import { useSpatialStore } from "@/lib/store/spatial-store";

const { RangePicker } = DatePicker;
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
  comparisonStartDate?: string;
  comparisonEndDate?: string;
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
  onCompare,
  comparisonStartDate,
  comparisonEndDate
}) => {
  const { months } = useSpatialStore();
  const [activeTab, setActiveTab] = useState('timeline');
  const [range, setRange] = useState(externalRange || [0, months.length - 1]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedYear, setSelectedYear] = useState(externalSelectedYear || new Date().getFullYear());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetDate = () => {
    setStartDate("");
    setEndDate("");
    setSelectedYear(new Date().getFullYear());
    if (onReset) onReset();
  };

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

  const leftPosition = sidebarExpanded ? "332px" : "136px";

  return (
    <AnimatePresence>
      {
        isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ left: leftPosition }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute top-[10px] z-[1001] w-[280px] flex flex-col gap-2"
          >
            {/* Header */}
            <BlurContainer className="!w-fit !rounded-md p-1 hover:opacity-80 cursor-pointer">
              <IoClose size={15} onClick={onClose} color={theme.colors.text.secondary} />
            </BlurContainer>

            <TabToggle
              activeTab={activeTab}
              handleTabChange={handleTabChange}
            />

            {
              activeTab === 'timeline' && (
                <Timeline
                  resetDate={resetDate}
                  isPlaying={isPlaying}
                  handlePlayClick={handlePlayClick}
                  handleReset={handleReset}
                />
              )
            }

            {
              activeTab === 'comparison' && (
                <Compare
                  resetDate={resetDate}
                  onCompare={onCompare}
                  comparisonStartDate={comparisonStartDate}
                  comparisonEndDate={comparisonEndDate}
                />
              )
            }
          </motion.div>
        )
      }
    </AnimatePresence>
  );
};

export default TimelineController;