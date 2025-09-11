import React from "react";
import { FaEnvelope, FaEye, FaBell, FaFileAlt } from "react-icons/fa";
import Text from "@styles/components/text";
import theme from "@styles/theme";

export interface RecentActivity {
  icon: React.ReactNode;
  title: React.ReactNode;
  time: React.ReactNode;
}

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[38px] h-[38px] rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center">
    {children}
  </div>
);

export const recentActivities: RecentActivity[] = [
  {
    icon: (
      <IconWrapper>
        <FaEnvelope className="text-[var(--color-main-primary)]" size={18} />
      </IconWrapper>
    ),
    title: (
      <Text
        
        bold={theme.text.bold.sm}
        className="!text-[var(--color-text-secondary)] font-normal"
      >
        Email notification sent to:{" "}
        <span className="font-semibold">ghanapolice, nsb and 2 others</span>
      </Text>
    ),
    time: (
      <Text
        
        bold={theme.text.bold.sm}
        className="!text-[var(--color-text-tetiary)] font-light mt-[2px]"
      >
        2 Hours ago
      </Text>
    ),
  },
  {
    icon: (
      <IconWrapper>
        <FaEye className="text-[var(--color-main-primary)]" size={18} />
      </IconWrapper>
    ),
    title: (
      <Text
        
        bold={theme.text.bold.md}
        className="!text-[var(--color-text-primary)] font-normal"
      >
        Segmentation Analysis completed for Eastern Region
      </Text>
    ),
    time: (
      <Text
        
        bold={theme.text.bold.sm}
        className="!text-[var(--color-text-tetiary)] font-light mt-[2px]"
      >
        2 Hours ago
      </Text>
    ),
  },
  {
    icon: (
      <IconWrapper>
        <FaBell className="text-[var(--color-main-primary)]" size={18} />
      </IconWrapper>
    ),
    title: (
      <Text
        
        bold={theme.text.bold.sm}
        className="!text-[var(--color-text-secondary)] font-normal"
      >
        New Alert: <span className="font-semibold">Mining activity detected</span>
      </Text>
    ),
    time: (
      <Text
        
        bold={theme.text.bold.sm}
        className="!text-[var(--color-text-tetiary)] font-light mt-[2px]"
      >
        2 Hours ago
      </Text>
    ),
  },
  {
    icon: (
      <IconWrapper>
        <FaFileAlt className="text-[var(--color-main-primary)]" size={18} />
      </IconWrapper>
    ),
    title: (
      <Text
        
        bold={theme.text.bold.sm}
        className="!text-[var(--color-text-secondary)] font-normal"
      >
        Report <span className="font-semibold">#GADE-2025-056</span> uploaded
      </Text>
    ),
    time: (
      <Text
        
        bold={theme.text.bold.sm}
        className="!text-[var(--color-text-tetiary)] font-light mt-[2px]"
      >
        2 Hours ago
      </Text>
    ),
  },
];
