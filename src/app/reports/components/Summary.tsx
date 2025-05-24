'use client';
import React from 'react';
import { AiFillAlert } from "react-icons/ai";

const PriorityCard = ({ 
  priority, 
  count, 
  type = 'high' 
}) => {
  const getStyles = () => {
    switch (type) {
      case 'high':
        return {
          container: 'bg-[#FBFBFB] border-[#EBEBEB]',
          title: 'text-red-600',
          count: 'text-red-600',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-500'
        };
      case 'medium':
        return {
          container: 'bg-[#FBFBFB] border-[#EBEBEB]',
          title: 'text-[#D77E00]',
          count: 'text-[#D77E00]',
          iconBg: 'bg-[#FFEACC]',
          iconColor: 'text-[#D77E00]'
        };
      case 'low':
        return {
          container: 'bg-[#FBFBFB] border-[#EBEBEB]',
          title: 'text-teal-600',
          count: 'text-teal-600',
          iconBg: 'bg-teal-100',
          iconColor: 'text-teal-500'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`rounded-2xl ${styles.container} w-[229px] h-[78px] border px-4 py-3 flex justify-between items-start`}>
      {/* Text section: priority + count */}
      <div className="flex flex-col items-start">
        <h3 className={`text-xs font-[300] ${styles.title}`}>
          {priority}
        </h3>
        <div className={`text-[38px] leading-[46px] font-bold ${styles.count}`}>
          {count.toString().padStart(2, '0')}
        </div>
      </div>

      {/* Icon section */}
      <div className={`w-[36px] h-[36px] rounded-xl ${styles.iconBg} flex items-center justify-center`}>
        <AiFillAlert className={`w-[18px] h-[18px] ${styles.iconColor}`} />
      </div>
    </div>
  );
};


const PriorityDashboard = () => {
  return (
    <div className="  flex mt-2 items-start ">
      <div className="flex gap-6 flex-wrap">
        <PriorityCard 
          priority="High Priority" 
          count={6} 
          type="high" 
        />
        <PriorityCard 
          priority="Medium Priority" 
          count={18} 
          type="medium" 
        />
        <PriorityCard 
          priority="Low Priority" 
          count={3} 
          type="low" 
        />
      </div>
    </div>
  );
};

export default PriorityDashboard;
