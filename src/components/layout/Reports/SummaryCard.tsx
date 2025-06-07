'use client';
import React from 'react';
import { AiFillAlert } from "react-icons/ai";

interface PriorityCardProps {
  priority: string;
  count: number;
  type: 'high' | 'medium' | 'low';
}

const PriorityCard: React.FC<PriorityCardProps> = ({ priority, count, type }) => {
  const getStyles = () => {
    switch (type) {
      case 'high':
        return {
          container: 'bg-[#FCFCFC] border-[#EBEBEB] shadow-sm',
          title: 'text-[#D45C4A]',
          count: 'text-[#D45C4A]',
          iconBg: 'bg-[#FEE4E2]',
          iconColor: 'text-[#D45C4A]'
        };
      case 'medium':
        return {
          container: 'bg-[#FCFCFC] border-[#EBEBEB] shadow-sm',
          title: 'text-[#D77E00]',
          count: 'text-[#D77E00]',
          iconBg: 'bg-[#FFEACC]',
          iconColor: 'text-[#D77E00]'
        };
      case 'low':
        return {
          container: 'bg-[#FCFCFC] border-[#EBEBEB] shadow-sm',
          title: 'text-[#009C96]',
          count: 'text-[#009C96]',
          iconBg: 'bg-[#CFF1EF]',
          iconColor: 'text-[#009C96]'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`w-[229px] h-[78px] px-4 py-3 rounded-[15px] border flex flex-col justify-between ${styles.container}`}>
      <div className="flex items-center justify-between">
        <h3 className={`text-sm font-medium ${styles.title}`}>{priority}</h3>
        <div className={`w-[36px] h-[36px] rounded-xl flex items-center justify-center ${styles.iconBg}`}>
          <AiFillAlert className={`w-[18px] h-[18px] ${styles.iconColor}`} />
        </div>
      </div>
      <div className={`text-[32px] leading-[44px] font-bold ${styles.count}`}>
        {count.toString().padStart(2, '0')}
      </div>
    </div>
  );
};

export default PriorityCard;
