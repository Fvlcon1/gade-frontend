"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { AiOutlineReload } from "react-icons/ai";
import { motion } from "framer-motion";

interface BottomTimelineProps {
  isVisible: boolean;
  onClose: () => void;
}

const getLastSixMonths = () => {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(date.toLocaleString("default", { month: "short" }));
  }
  return months;
};

const BottomTimeline: React.FC<BottomTimelineProps> = ({ isVisible, onClose }) => {
  const months = getLastSixMonths();
  const [range, setRange] = useState([0, months.length - 1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
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
    } else {
      setIsPlaying(false);
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

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setRange(([from, to]) => [from + 1, to]);
    }, 800);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [range, isPlaying]);

  const handleRangeChange = (index: number, value: number) => {
    const newRange = [...range];
    newRange[index] = value;
    if (newRange[0] <= newRange[1]) {
      setRange(newRange);
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: 200 }}
      animate={{ y: 0 }}
      exit={{ y: 200 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="absolute bottom-0 left-0 right-0 z-[1002] bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-700">Mining Activity Timeline</h3>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isCollapsed ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-lg leading-none"
        >
          ×
        </button>
      </div>

      {!isCollapsed && (
        <div className="px-4 py-3">
          <p className="text-xs text-gray-500 mb-3">Filter mining activity by date range</p>
          
          {/* Timeline Slider */}
          <div className="mb-4">
            <div className="relative h-8 bg-gray-100 rounded-lg px-3">
              {/* Slider Track */}
              <div className="absolute top-1/2 left-3 right-3 h-1 bg-gray-300 rounded-full -translate-y-1/2" />
              <div
                className="absolute h-1 bg-[#635bff] rounded-full"
                style={{
                  left: `${(range[0] / (months.length - 1)) * 100}%`,
                  width: `${((range[1] - range[0]) / (months.length - 1)) * 100}%`,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />

              {/* Range Inputs */}
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
            </div>

            {/* Month Labels */}
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {months.map((month, index) => (
                <span
                  key={index}
                  className={
                    index === range[0] || index === range[1] ? "text-[#635bff] font-medium" : ""
                  }
                >
                  {month}
                </span>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlay}
              className={`flex items-center gap-2 px-4 py-2 text-white text-sm rounded-lg transition-all duration-200 ${
                isPlaying
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#635bff] hover:bg-[#5148d4]"
              }`}
            >
              {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
              {isPlaying ? "Pause" : "Play"}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              <AiOutlineReload size={12} />
              Reset
            </button>

            <div className="text-xs text-gray-500">
              {months[range[0]]} - {months[range[1]]}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BottomTimeline; 