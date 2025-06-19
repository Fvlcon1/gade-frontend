"use client";
import React from "react";

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

  if (!isVisible) return null;

  return (
    <div
      className="absolute bottom-10 z-[1002] bg-white/50 backdrop-blur-sm shadow-lg rounded-4xl border border-gray-200 w-full max-w-[600px] sm:max-w-[60vw]"
      style={{ left: "50%", transform: "translateX(-50%)" }}
    >
      <div className="h-full flex flex-col justify-center items-center px-4 sm:px-6 py-3 gap-1.5">
        {/* Timeline Slider */}
        <div className="w-full">
          <div className="relative h-2 bg-gray-100 rounded-lg flex items-center w-full">
            {/* Active Range */}
            <div
              className="absolute h-2 bg-[#635bff] rounded-full"
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
              onChange={(e) => onRangeChange(0, parseInt(e.target.value))}
              className="absolute w-full h-full top-0 left-0 appearance-none bg-transparent z-20 pointer-events-auto cursor-pointer"
              style={{ WebkitAppearance: 'none', appearance: 'none' }}
              disabled={isPlaying}
            />
            <input
              type="range"
              min={0}
              max={months.length - 1}
              value={range[1]}
              onChange={(e) => onRangeChange(1, parseInt(e.target.value))}
              className="absolute w-full h-full top-0 left-0 appearance-none bg-transparent z-30 pointer-events-auto cursor-pointer"
              style={{ WebkitAppearance: 'none', appearance: 'none' }}
              disabled={isPlaying}
            />

            {/* Custom Thumb Styles */}
            <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                height: 18px;
                width: 18px;
                background: #635bff;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                cursor: pointer;
                transition: all 0.2s ease;
              }

              input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
              }

              input[type="range"]::-moz-range-thumb {
                height: 18px;
                width: 18px;
                background: #635bff;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                cursor: pointer;
                transition: all 0.2s ease;
              }

              input[type="range"]::-moz-range-thumb:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
              }
            `}</style>
          </div>
        </div>

        {/* Month Labels */}
        <div className="w-full flex justify-between text-xs text-gray-500 px-1">
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
              {/* Playhead indicator */}
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
