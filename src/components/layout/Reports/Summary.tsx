'use client';
import React from 'react';
import { AiFillAlert } from "react-icons/ai";
import { useSpatialStore } from '@/lib/store/spatialStore';

// Define valid status types
type ReportStatus = 'OPEN' | 'IN REVIEW' | 'RESOLVED' | 'CLOSED';

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

const Summary = () => {
  const { reports } = useSpatialStore();

  // Calculate counts for each priority level
  const counts = React.useMemo(() => {
    if (!reports || reports.length === 0) {
      return { high: 0, medium: 0, low: 0 };
    }

    // Count reports by severity, only counting OPEN reports by default
    const counts = reports.reduce((acc, report) => {
      // Normalize status to handle variations
      const status = (report.status || 'OPEN').toUpperCase() as ReportStatus;
      
      // Debug log for status
      console.log('Report status:', { id: report.id, status, originalStatus: report.status });
      
      // Only count reports that are OPEN
      if (status !== 'OPEN') {
        return acc;
      }

      // Normalize severity to uppercase
      const severity = (report.severity || 'LOW').toUpperCase();
      
      switch (severity) {
        case 'HIGH':
          acc.high++;
          break;
        case 'MEDIUM':
          acc.medium++;
          break;
        case 'LOW':
          acc.low++;
          break;
        default:
          // If severity is not set or unknown, treat as LOW priority
          console.warn(`Unknown severity for report ${report.id}:`, severity);
          acc.low++;
          break;
      }
      return acc;
    }, { high: 0, medium: 0, low: 0 });

    console.log('Reports count by priority (OPEN status only):', counts);
    return counts;
  }, [reports]);

  return (
    <div className="flex mt-2 items-start">
      <div className="flex gap-6 flex-wrap">
        <PriorityCard 
          priority="High Priority"
          count={counts.high} 
          type="high" 
        />
        <PriorityCard 
          priority="Medium Priority"
          count={counts.medium} 
          type="medium" 
        />
        <PriorityCard 
          priority="Low Priority"
          count={counts.low} 
          type="low" 
        />
      </div>
    </div>
  );
};

export default Summary;
