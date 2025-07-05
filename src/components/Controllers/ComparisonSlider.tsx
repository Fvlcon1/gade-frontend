"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaArrowsAltH } from "react-icons/fa";
import Text from "@styles/components/text";
import theme from "@styles/theme";
import getDate from "@/utils/getDate";

interface ComparisonSliderProps {
  isVisible: boolean;
  sidebarExpanded: boolean;
  position: number;
  comparisonStartDate: string;
  comparisonEndDate: string;
  setPosition: (pos: number) => void;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ isVisible, sidebarExpanded, position, comparisonStartDate, comparisonEndDate, setPosition }) => {
  const [dragging, setDragging] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    const screenWidth = window.innerWidth;
    const sidebarWidth = sidebarExpanded ? 268 : 72;
    let newPosition = (e.clientX / screenWidth);
    // Clamp between 0 and 1
    newPosition = Math.max(0, Math.min(1, newPosition));
    setPosition(newPosition);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  useEffect(() => {
    if (!isVisible) setPosition(0.5);
  }, [isVisible, setPosition]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute top-0 h-full z-[1000] select-none"
      animate={{ left: `${position * 100}%` }}
      transition={{ duration: 0.1 }}
    >
      {/* Start Date */}
      <div className="absolute top-[30px] right-[50px] flex justify-end w-[300px]">
        <div className="bg-bg-quantinary/30 shadow-xl border-[1px] border-border-secondary/40 backdrop-blur-sm backdrop-filter h-fit flex justify-end px-3 py-1 rounded-full">
          <Text
            textColor={theme.colors.bg.primary}
            size={theme.text.size.body2}
            bold={theme.text.bold.md2}
          >
            {getDate(new Date(comparisonStartDate))}
          </Text>
        </div>
      </div>

      {/* End Date */}
      <div className="absolute top-[30px] left-[50px] flex justify-start w-[300px]">
        <div className="bg-bg-quantinary/30 shadow-xl border-[1px] border-border-secondary/40 backdrop-blur-sm backdrop-filter h-fit flex justify-start px-3 py-1 rounded-full">
          <Text
            textColor={theme.colors.bg.primary}
            size={theme.text.size.body2}
            bold={theme.text.bold.md2}
          >
            {getDate(new Date(comparisonEndDate))}
          </Text>
        </div>
      </div>

      {/* Vertical slider line */}
      <div className="w-[2px] h-full bg-white/60 translate-x-[1px]" />

      {/* Drag handle */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-[50%] left-[-20px] w-[40px] h-[40px] rounded-full bg-white border border-gray-300 shadow-md flex items-center justify-center cursor-col-resize -translate-y-1/2"
      >
        <FaArrowsAltH className="text-[#6060D0]" />
      </div>

      {/* Close button */}
     
    </motion.div>
  );
};

export default ComparisonSlider;
