'use client';

import React from "react";
import Text from "@styles/components/text";
import theme from "@styles/theme";
import Metric from "./MetricCard/Metric";
import Map from "./Map/Map";
import Title from "./Reports/Title";
import ReportList from "./Reports/ReportList";
import Overlay from "@components/ui/overlay/overlay";

interface MidProps {
  activeTitle: string;
  activeIcon?: React.ReactNode;
  isActive?: boolean;
}

const Mid: React.FC<MidProps> = ({ activeTitle, activeIcon, isActive = false }) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-white px-6 pt-2 overflow-hidden">
      {/* Header section */}
      <div className="flex items-center gap-3 mb-2 shrink-0">
        {activeIcon && (
  <div
    className={`w-[32px] h-[30px] rounded-[5px] flex items-center justify-center
      ${isActive ? "bg-[var(--main-primary-20)] text-[var(--color-main-primary)]" : "bg-[var(--bg-secondary)] text-[var(--color-text-tetiary)]"}
    `}
  >
    <span className="w-[14px] h-[14px] flex items-center justify-center">
      {activeIcon}
    </span>
  </div>
)}

        <Text
          size={theme.text.size.HL}
          bold={theme.text.bold.lg}
          className="!text-[var(--color-main-primary)]"
        >
          {activeTitle}
        </Text>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 hide-scrollbar">
        <Metric />
        
        <Map />
        <Title />
        <ReportList />
      </div>
    </div>
  );
};

export default Mid;
