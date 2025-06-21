"use client";
import React, { useRef, useState, useEffect } from "react";

interface BottomTimelineProps {
  isVisible: boolean;
  onClose: () => void;
  sidebarExpanded?: boolean;
  range: [number, number];
  onRangeChange: (index: number, value: number) => void;
  selectedYear: number;
  playhead?: number | null;
  isPlaying?: boolean;
}

const getMonths = () => [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const BottomTimeline: React.FC<BottomTimelineProps> = ({
  isVisible,
  onClose,
  sidebarExpanded = false,
  range,
  onRangeChange,
  selectedYear,
  playhead = null,
  isPlaying = false
}) => {
  const months = getMonths();
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<null | 0 | 1>(null);

  const getPositionValue = (e: MouseEvent | React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const ratio = x / rect.width;
    return Math.round(ratio * (months.length - 1));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging === null || isPlaying) return;
    const value = getPositionValue(e);
    onRangeChange(dragging, value);
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    if (isPlaying) return;
    const clickedValue = getPositionValue(e);
    const distanceToStart = Math.abs(clickedValue - range[0]);
    const distanceToEnd = Math.abs(clickedValue - range[1]);
    const closestIndex = distanceToStart <= distanceToEnd ? 0 : 1;
    onRangeChange(closestIndex, clickedValue);
  };

  useEffect(() => {
    if (dragging !== null) {
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

  if (!isVisible) return null;

  const leftPercent = (range[0] / (months.length - 1)) * 100;
  const rightPercent = (range[1] / (months.length - 1)) * 100;

  return (
    <div
      className="absolute bottom-10 z-[1002] bg-white/80 backdrop-blur-sm shadow-lg rounded-4xl border border-gray-200 w-full max-w-[600px] sm:max-w-[60vw]"
      style={{ left: "50%", transform: "translateX(-50%)" }}
    >
      <div className="h-full flex flex-col justify-center items-center px-4 sm:px-6 py-3 gap-1.5">
        {/* Timeline Slider */}
        <div className="w-full">
          <div
            className="relative h-2 bg-gray-100 rounded-lg w-full cursor-pointer"
            ref={trackRef}
            onClick={handleTrackClick}
          >
            {/* Active Range */}
            <div
              className="absolute h-2 bg-[#635bff] rounded-full"
              style={{
                left: `${leftPercent}%`,
                width: `${rightPercent - leftPercent}%`,
                top: "0",
              }}
            />

            {/* Thumb Start */}
            <div
              onMouseDown={() => !isPlaying && setDragging(0)}
              className="absolute top-1/2 w-4 h-4 bg-[#635bff] border-2 border-white rounded-full shadow-md -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              style={{
                left: `${leftPercent}%`,
              }}
            />

            {/* Thumb End */}
            <div
              onMouseDown={() => !isPlaying && setDragging(1)}
              className="absolute top-1/2 w-4 h-4 bg-[#635bff] border-2 border-white rounded-full shadow-md -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              style={{
                left: `${rightPercent}%`,
              }}
            />

            {/* Playhead */}
            {playhead != null && (
              <div
                className="absolute top-1/2 bg-[#ff5733] rounded-full"
                style={{
                  left: `${(playhead / (months.length - 1)) * 100}%`,
                  width: isPlaying ? "6px" : "2px",
                  height: "100%",
                  transform: "translateY(-50%)",
                }}
              />
            )}
          </div>
        </div>

        {/* Month Labels */}
        <div className="w-full flex justify-between text-xs text-gray-500 px-1 mt-1">
          {months.map((month, index) => (
            <span
              key={index}
              className={`transition-colors ${
                (isPlaying && playhead === index)
                  ? "text-[#635bff] font-bold underline underline-offset-2"
                  : (index === range[0] || index === range[1])
                    ? "text-[#635bff] font-medium"
                    : ""
              }`}
            >
              {month}
              {isPlaying && playhead === index && (
                <span className="block w-1 h-1 mx-auto mt-0.5 rounded-full bg-[#635bff]" />
              )}
            </span>
          ))}
        </div>

        {/* Selected Range */}
        <div className="text-xs text-gray-600 text-center">
          {selectedYear}: {months[range[0]]} - {months[range[1]]}
        </div>
      </div>
    </div>
  );
};

export default BottomTimeline;
