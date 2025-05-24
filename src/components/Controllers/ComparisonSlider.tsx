"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaArrowsAltH } from "react-icons/fa";

const ComparisonSlider = ({ isVisible, sidebarExpanded }) => {
  const [position, setPosition] = useState("50%");
  const [dragging, setDragging] = useState(false);

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const screenWidth = window.innerWidth;
    const sidebarWidth = sidebarExpanded ? 232 : 72;
    let newPosition = (e.clientX / screenWidth) * 100;

    if (e.clientX < sidebarWidth + 40) newPosition = ((sidebarWidth + -10) / screenWidth) * 100;
    if (e.clientX > screenWidth - 40) newPosition = ((screenWidth - -10) / screenWidth) * 100;

    setPosition(`${newPosition}%`);
  };

  const handleMouseUp = () => {
    setDragging(false);
    setPosition("50%"); 
  };

  const handleMouseDown = (e) => {
    e.preventDefault(); 
    setDragging(true);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, sidebarExpanded]);

  useEffect(() => {
    if (!isVisible) setPosition("50%");
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute top-0 h-full z-[1000] select-none"
      animate={{ left: position }}
      transition={{ duration: 0.1 }}
    >
      
      <div className="absolute top-0 left-full h-full w-screen bg-black/10 pointer-events-none" />

      
      <div className="w-[2px] h-full bg-white/60 translate-x-[-1px]" />

      
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-[50%] left-[-20px] w-[40px] h-[40px] rounded-full bg-white border border-gray-300 shadow-md flex items-center justify-center cursor-col-resize -translate-y-1/2"
      >
        <FaArrowsAltH className="text-[#6060D0]" />
      </div>
    </motion.div>
  );
};

export default ComparisonSlider;
