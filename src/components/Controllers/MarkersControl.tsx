"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { AiOutlineReload } from "react-icons/ai";
import { FaChevronDown, FaChevronRight, FaCalendar } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import Text from "@styles/components/text";
import theme from "@styles/theme";

const districts = ["Ahanta west municipal", "Shama", "Mpohor", "Jomoro"];

const MarkersControl = ({ isOpen, onClose, sidebarExpanded = false }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMiningCollapsed, setIsMiningCollapsed] = useState(true);
  const [isDateCollapsed, setIsDateCollapsed] = useState(false);
  const [selected, setSelected] = useState(districts);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const toggleDistrict = (district) => {
    setSelected((prev) =>
      prev.includes(district)
        ? prev.filter((d) => d !== district)
        : [...prev, district]
    );
  };

  if (!isOpen) return null;

  // Calculate left position based on sidebar state
  const leftPosition = sidebarExpanded ? '296px' : '136px';

  return (
    <motion.div
      animate={{ left: leftPosition }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute top-[10px] z-[1001] w-[213px]"
    >
      {/* Header */}
      <div className="w-full h-[33px] bg-white/50 backdrop-blur-xs shadow-md px-2 flex mb-2 items-center justify-between rounded-[10px]">
        <Text
          size={theme.text.size.body}
          bold={theme.text.bold.md}
          className="!text-[var(--color-text-primary)]"
        >
          Filter
        </Text>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 text-xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Filter by Districts */}
      <motion.div
        animate={{ height: isCollapsed ? 35 : 155 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full overflow-hidden bg-white/50 backdrop-blur-xs shadow-md px-2 py-[5px] rounded-[10px]"
      >
        <div className="w-full h-[21px] flex items-center justify-between">
          <Text
            size={theme.text.size.SM}
            bold={theme.text.bold.md}
            className="!text-[var(--color-text-secondary)]"
          >
            Filter by districts
          </Text>

          <div className="flex items-center gap-2 text-gray-500">
            {!isCollapsed && (
              <motion.div
                onClick={handleRefresh}
                animate={{ rotate: isRefreshing ? 360 : 0 }}
                transition={{ duration: 0.8 }}
                className="cursor-pointer"
              >
                <AiOutlineReload size={14.22} />
              </motion.div>
            )}
            {isCollapsed ? (
              <FaChevronRight
                size={15.06}
                className="cursor-pointer"
                onClick={toggleCollapse}
              />
            ) : (
              <FaChevronDown
                size={16.06}
                className="cursor-pointer"
                onClick={toggleCollapse}
              />
            )}
          </div>
        </div>

        {!isCollapsed && (
          <div className="mt-1 flex flex-col gap-1">
            <div className="w-full h-[30px] bg-white border border-[var(--color-border-primary)] rounded-[8px] px-2 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search district..."
                className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
            </div>

            <div className="flex-wrap flex h-[78px] overflow-y-auto gap-2 mt-1 hide-scrollbar">
              {districts.map((district) => {
                const isSelected = selected.includes(district);
                return (
                  <button
                    key={district}
                    onClick={() => toggleDistrict(district)}
                    className={`flex items-center gap-1.5 h-[20px] px-2.5 rounded-full border text-xs font-medium transition
                      ${
                        isSelected
                          ? "border-[var(--color-main-primary)] text-[var(--color-main-primary)]"
                          : "border-gray-300 text-gray-500"
                      }
                    `}
                  >
                    <span className="w-[14px] h-[14px] rounded-full bg-[var(--color-main-primary)] flex items-center justify-center">
                      <IoMdCheckmark size={10} className="text-white" />
                    </span>
                    {district}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Filter by Mining Company */}
      <motion.div
        animate={{ height: isMiningCollapsed ? 35 : 90 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full overflow-hidden bg-white/50 backdrop-blur-xs shadow-md px-2 py-[5px] rounded-[10px] mt-2"
      >
        <div className="w-full h-[21px] flex items-center justify-between">
          <Text
            size={theme.text.size.SM}
            bold={theme.text.bold.md}
            className="!text-[var(--color-text-secondary)]"
          >
            Filter by mining company
          </Text>

          {isMiningCollapsed ? (
            <FaChevronRight
              size={15.06}
              className="cursor-pointer text-gray-500"
              onClick={() => setIsMiningCollapsed(false)}
            />
          ) : (
            <FaChevronDown
              size={16.06}
              className="cursor-pointer text-gray-500"
              onClick={() => setIsMiningCollapsed(true)}
            />
          )}
        </div>

        {!isMiningCollapsed && (
          <div className="mt-2">
            <div className="w-full h-[30px] bg-white border border-[var(--color-border-primary)] rounded-[8px] px-2 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search company..."
                className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Filter by Date Range */}
      <motion.div
        animate={{ height: isDateCollapsed ? 35 : 110 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full overflow-hidden bg-white/50 backdrop-blur-xs shadow-md px-2 py-[5px] rounded-[10px] mt-2 border border-[var(--color-border-primary)]"
      >
        <div className="w-full h-[21px] flex items-center justify-between">
          <Text
            size={theme.text.size.SM}
            bold={theme.text.bold.md}
            className="!text-[var(--color-text-secondary)]"
          >
            Filter by date range
          </Text>

          <div className="flex items-center gap-2 text-gray-500">
            {!isDateCollapsed && (
              <motion.div
                onClick={handleRefresh}
                animate={{ rotate: isRefreshing ? 360 : 0 }}
                transition={{ duration: 0.8 }}
                className="cursor-pointer"
              >
                <AiOutlineReload size={14.22} />
              </motion.div>
            )}
            {isDateCollapsed ? (
              <FaChevronRight
                size={15.06}
                className="cursor-pointer"
                onClick={() => setIsDateCollapsed(false)}
              />
            ) : (
              <FaChevronDown
                size={16.06}
                className="cursor-pointer"
                onClick={() => setIsDateCollapsed(true)}
              />
            )}
          </div>
        </div>

        {!isDateCollapsed && (
          <div className="mt-3 flex flex-row justify-between gap-2 px-[2px]">
            {/* FROM */}
            <div className="flex flex-col w-[82px]">
              <Text
                size={theme.text.size.SM}
                bold={theme.text.bold.sm}
                className="!text-[var(--color-text-tetiary)]"
              >
                From
              </Text>
              <div className="flex items-center h-[28px] border rounded-[4px] px-2 gap-1 border-[var(--color-text-tetiary)] bg-white/70">
                <FaCalendar size={12} className="text-[var(--color-text-tetiary)]" />
                <input
                  type="text"
                  placeholder="00/00/0"
                  className="w-full text-[10px] text-[var(--color-text-tetiary)] placeholder-[var(--color-text-tetiary)] bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Dots */}
            <div className="flex items-end pb-2">
              <Text
                size={theme.text.size.SM}
                bold={theme.text.bold.md}
                className="!text-[var(--color-text-tetiary)]"
              >
                ...
              </Text>
            </div>

            {/* TO */}
            <div className="flex flex-col w-[82px]">
              <Text
                size={theme.text.size.SM}
                bold={theme.text.bold.sm}
                className="!text-[var(--color-text-tetiary)]"
              >
                To
              </Text>
              <div className="flex items-center h-[28px] border rounded-[4px] px-2 gap-1 border-[var(--color-text-tetiary)] bg-white/70">
                <FaCalendar size={12} className="text-[var(--color-text-tetiary)]" />
                <input
                  type="text"
                  placeholder="00/00/0"
                  className="w-full text-[10px] text-[var(--color-text-tetiary)] placeholder-[var(--color-text-tetiary)] bg-transparent outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MarkersControl;