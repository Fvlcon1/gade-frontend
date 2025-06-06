"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { FaPlay, FaChevronDown, FaChevronRight, FaCalendar } from "react-icons/fa";

import { AiOutlineReload } from "react-icons/ai";
import { motion } from "framer-motion";
import Text from "@styles/components/text";
import theme from "@styles/theme";

const getLastSixMonths = () => {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(date.toLocaleString("default", { month: "short" }));
  }
  return months;
};

const TimelineController = ({ isOpen, onClose, sidebarExpanded = false }) => {
  const months = getLastSixMonths();
  const [range, setRange] = useState([0, months.length - 1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
const [isComparisonCollapsed, setIsComparisonCollapsed] = useState(false);
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleReset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setRange([0, months.length - 1]);
    setIsPlaying(false);
  };

  const handlePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      setRange(([_, to]) => [0, to]);
    }
  };

  useEffect(() => {
    // Cleanup function to clear any existing timeout
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    if (range[0] >= range[1]) {
      handleReset();
      return;
    }

    // Clear any existing timeout before setting a new one
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout with a reasonable duration
    timeoutRef.current = setTimeout(() => {
      setRange(([from, to]) => [from + 1, to]);
    }, 800);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [range, isPlaying]);

  const handleRangeChange = (index, value) => {
    const newRange = [...range];
    newRange[index] = value;
    if (newRange[0] <= newRange[1]) {
      setRange(newRange);
    }
  };

  if (!isOpen) return null;
  const leftPosition = sidebarExpanded ? "296px" : "136px";

  return (
    <motion.div
      animate={{ left: leftPosition }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute top-[10px] z-[1001] w-[245px]"
    >
      {/* Header */}
      <div className="w-[27] h-[26px] bg-white/80 shadow-md px-2 flex mb-2 items-center justify-between rounded-[7px]">
        <Text size={theme.text.size.body} bold={theme.text.bold.md} className="!text-[var(--color-text-primary)]">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-xl leading-none">×</button>
        </Text>
      </div>

      {/* Collapsible Panel */}
      <motion.div
        animate={{ height: isCollapsed ? 35 : 145 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-[213px] h-[120px] overflow-hidden bg-white/65 backdrop-blur-xs shadow-md px-2 py-3 rounded-[10px]"
      >
        <div className="flex items-center justify-between w-full  h-[18px]">
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
            <Text size={theme.text.size.SM} bold={theme.text.bold.sm} className="text-gray-500">
              Filter mining activity by date
            </Text>

            {/* Slider + Labels Container */}
            <div className="rounded-[10px] w-[190px] h-[50px] bg-[#EBEBEB]/140 px-3 ml-[3px] ">
              {/* Slider */}
              <div className="relative w-full  h-[40px]">
                <div className="absolute top-[50%] left-0 right-0 h-[4px] bg-gray-300 rounded-full -translate-y-1/2" />
                <div
                  className="absolute h-[4px] bg-[#635bff]  rounded-full"
                  style={{
                    left: `${(range[0] / (months.length - 1)) * 100}%`,
                    width: `${((range[1] - range[0]) / (months.length - 1)) * 100}%`,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />

                <input
                  type="range"
                  min={0}
                  max={months.length - 1}
                  value={range[0]}
                  onChange={(e) => handleRangeChange(0, parseInt(e.target.value))}
                  className="absolute w-full h-full top-0 left-0 appearance-none bg-transparent z-20 pointer-events-auto"
                />
                <input
                  type="range"
                  min={0}
                  max={months.length - 1}
                  value={range[1]}
                  onChange={(e) => handleRangeChange(1, parseInt(e.target.value))}
                  className="absolute w-full h-full top-0 left-0 appearance-none bg-transparent z-30 pointer-events-auto"
                />
                <style jsx>{`
                  input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 18px;
                    width: 18px;
                    background: #635bff;
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

              {/* Labels */}
              <div className="flex justify-between w-full -mt-3.5 text-xs font-[200] text-gray-500">
                {months.map((month, index) => (
                  <span
                    key={index}
                    className={
                      index === range[0] || index === range[1] ? "text-[#635bff] font-[500]" : ""
                    }
                  >
                    {month}
                  </span>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center w-[50%] mt-2 ml-1">
              <button
                onClick={handlePlay}
                disabled={isPlaying}
                className={`flex items-center justify-center gap-2 w-[63px] h-[24px] text-white text-sm leading-none rounded-[8px] transition-all duration-200 ${
                  isPlaying
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#635bff] hover:bg-[#5148d4]"
                }`}
              >
                <FaPlay size={12} />
                {isPlaying ? "Play" : "Play"}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center justify-center w-[24px] h-[24px] bg-white text-[#425466] border rounded-[7px] shadow-sm leading-none"
              >
                <AiOutlineReload width={13} height={10.6} />
              </button>
            </div>
          </>
        )}
      </motion.div>


<motion.div
  animate={{ height: isComparisonCollapsed ? 35 : 125 }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
  className="w-[213px] overflow-hidden bg-white/50 backdrop-blur-xs shadow-md px-2 py-[5px] rounded-[10px] mt-2"
>
  <div className="w-full h-[21px] flex items-center justify-between">
    <Text size={theme.text.size.SM} bold={theme.text.bold.md} className="!text-[var(--color-text-secondary)]">
      Dual date comparison
    </Text>
    {isComparisonCollapsed ? (
      <FaChevronRight size={15.06} className="cursor-pointer text-gray-500" onClick={() => setIsComparisonCollapsed(false)} />
    ) : (
      <FaChevronDown size={16.06} className="cursor-pointer text-gray-500" onClick={() => setIsComparisonCollapsed(true)} />
    )}
  </div>

  {!isComparisonCollapsed && (
    <div className="mt-3 flex flex-col gap-3 px-1">
      {/* Date Inputs */}
      <div className="flex justify-between">
        {/* START */}
        <div className="flex flex-col w-[82px]">
          <Text size={theme.text.size.SM} bold={theme.text.bold.sm} className="!text-[var(--color-text-tetiary)]">Start</Text>
          <div
            className="flex items-center w-[81px] h-[28px] border-[var(--border-tetiary)] rounded-[10px] justify-around px-[4px] border-[1px] bg-white/50 cursor-pointer"
            onClick={() => (document.getElementById("start-date-input") as HTMLInputElement)?.showPicker()}

          >
            <FaCalendar size={12} className="text-[var(--color-text-tetiary)]" />
            <input
              id="start-date-input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || undefined}
              className="w-full text-[10px] text-center text-[var(--color-text-tetiary)] bg-transparent outline-none placeholder:text-gray-400"
              style={{ WebkitAppearance: "none", appearance: "none" }}
            />
          </div>
        </div>

        <div className="flex items-end pb-2">
          <Text size={theme.text.size.SM} bold={theme.text.bold.md} className="!text-[var(--color-text-tetiary)]">...</Text>
        </div>

        {/* END */}
        <div className="flex flex-col w-[82px]">
          <Text size={theme.text.size.SM} bold={theme.text.bold.sm} className="!text-[var(--color-text-tetiary)]">End</Text>
          <div
            className="flex items-center w-[81px] h-[28px] border-[var(--border-tetiary)] rounded-[10px] justify-around px-[4px] border-[1px] bg-white/50 cursor-pointer"
            onClick={() => (document.getElementById("end-date-input") as HTMLInputElement)?.showPicker()}

          >
            <FaCalendar size={12} className="text-[var(--color-text-tetiary)]" />
            <input
              id="end-date-input"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
              className="w-full text-[10px] text-center text-[var(--color-text-tetiary)] bg-transparent outline-none placeholder:text-gray-400"
              style={{ WebkitAppearance: "none", appearance: "none" }}
            />
          </div>
        </div>
      </div>

      {/* Compare & Reset */}
      <div className="flex items-center gap-2 -mt-2">
        <button
          onClick={() => console.log("Compare", startDate, endDate)}
          className="flex items-center justify-center w-[81px] h-[24px] rounded-[7px] text-white bg-[var(--color-main-primary)] hover:bg-[#4e43c6] text-sm"
        >
          Compare
        </button>
        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
          }}
          className="flex items-center justify-center w-[24px] h-[24px] bg-white border rounded-[5px] shadow-sm text-[#425466]"
        >
          <AiOutlineReload width={12.25} height={10.5} />
        </button>
      </div>
    </div>
  )}
</motion.div>


    </motion.div>
  );
};

export default TimelineController;
