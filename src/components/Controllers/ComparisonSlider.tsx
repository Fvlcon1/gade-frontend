"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaArrowsAltH } from "react-icons/fa";

interface ComparisonSliderProps {
  isVisible: boolean;
  sidebarExpanded: boolean;
  position: number;
  setPosition: (pos: number) => void;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ isVisible, sidebarExpanded, position, setPosition }) => {
  const [dragging, setDragging] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    const screenWidth = window.innerWidth;
    const sidebarWidth = sidebarExpanded ? 232 : 72;
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
      {/* Overlay for right side */}
      <div className="absolute top-0 left-full h-full w-screen bg-black/10 pointer-events-none" />
      {/* Vertical slider line */}
      <div className="w-[2px] h-full bg-white/60 translate-x-[-1px]" />
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
