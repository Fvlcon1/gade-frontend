"use client";
import React, { useState } from "react";
import { FaCalendar, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { AiOutlineReload } from "react-icons/ai";
import { motion } from "framer-motion";

interface DualDateComparisonProps {
  isVisible: boolean;
  onClose: () => void;
}

const DualDateComparison: React.FC<DualDateComparisonProps> = ({ isVisible, onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCompare = () => {
    if (startDate && endDate) {
      console.log("Comparing dates:", startDate, endDate);
      // TODO: Implement comparison logic
    }
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
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
          <h3 className="text-sm font-medium text-gray-700">Dual Date Comparison</h3>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isCollapsed ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-lg cursor-pointer leading-none"
        >
          ×
        </button>
      </div>

      {!isCollapsed && (
        <div className="px-4 py-3">
          <p className="text-xs text-gray-500 mb-4">Compare mining activity between two dates</p>
          
          {/* Date Inputs */}
          <div className="flex items-center gap-4 mb-4">
            {/* Start Date */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-2">Start Date</label>
              <div className="relative">
                <div
                  className="flex items-center w-full h-10 border border-gray-300 rounded-lg px-3 bg-white cursor-pointer hover:border-gray-400"
                  onClick={() => (document.getElementById("start-date-input") as HTMLInputElement)?.showPicker()}
                >
                  <FaCalendar size={14} className="text-gray-400 mr-2" />
                  <input
                    id="start-date-input"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={endDate || undefined}
                    className="flex-1 text-sm text-gray-700 bg-transparent outline-none"
                    style={{ WebkitAppearance: "none", appearance: "none" }}
                  />
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="flex items-center pt-6">
              <span className="text-gray-400 text-lg">...</span>
            </div>

            {/* End Date */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-2">End Date</label>
              <div className="relative">
                <div
                  className="flex items-center w-full h-10 border border-gray-300 rounded-lg px-3 bg-white cursor-pointer hover:border-gray-400"
                  onClick={() => (document.getElementById("end-date-input") as HTMLInputElement)?.showPicker()}
                >
                  <FaCalendar size={14} className="text-gray-400 mr-2" />
                  <input
                    id="end-date-input"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                    className="flex-1 text-sm text-gray-700 bg-transparent outline-none"
                    style={{ WebkitAppearance: "none", appearance: "none" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCompare}
              disabled={!startDate || !endDate}
              className={`flex items-center gap-2 px-4 py-2 text-white text-sm rounded-lg cursor-pointer transition-all duration-200 ${
                !startDate || !endDate
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#635bff] hover:bg-[#5148d4]"
              }`}
            >
              Compare
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              <AiOutlineReload size={12} />
              Reset
            </button>

            {startDate && endDate && (
              <div className="text-xs text-gray-500">
                Comparing: {startDate} to {endDate}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DualDateComparison; 