'use client';
import React from 'react';
import { AiFillAlert } from "react-icons/ai";
import { useSpatialStore } from '@/lib/store/spatial-store';
import Text, { Head1 } from '@/app/styles/components/text';
import { TypographySize, TypographyBold } from '@/app/styles/style.types';
import { IconReport, IconAlertCircle, IconClock, IconCheck } from "@tabler/icons-react";

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
    <div className={`rounded-2xl ${styles.container} w-full h-[120px] border px-6 py-4 flex justify-between items-start`}>
      {/* Text section: priority + count */}
      <div className="flex flex-col items-start">
        <Text
          textColor={type === 'high' ? 'rgb(220 38 38)' : type === 'medium' ? 'rgb(215 126 0)' : 'rgb(13 148 136)'}
          size={TypographySize.body2}
          bold={TypographyBold.sm}
          className={styles.title}
        >
          {priority}
        </Text>
        <Head1
          textColor={type === 'high' ? 'rgb(220 38 38)' : type === 'medium' ? 'rgb(215 126 0)' : 'rgb(13 148 136)'}
          bold={TypographyBold.lg}
          size={TypographySize.HL}
          className={styles.count}
        >
          {count.toString().padStart(2, '0')}
        </Head1>
      </div>

      {/* Icon section */}
      <div className={`w-[40px] h-[40px] rounded-xl ${styles.iconBg} flex items-center justify-center`}>
        <AiFillAlert className={`w-[20px] h-[20px] ${styles.iconColor}`} />
      </div>
    </div>
  );
};

const Summary = () => {
  // Get reports from spatial store
  const { reports } = useSpatialStore();

  // Calculate counts for each priority level
  const counts = React.useMemo(() => {
    if (!reports || reports.length === 0) {
      return { high: 0, medium: 0, low: 0 };
    }

    // Count reports by severity
    return reports.reduce((acc, report) => {
      switch (report.severity) {
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
          acc.low++;
          break;
      }
      return acc;
    }, { high: 0, medium: 0, low: 0 });
  }, [reports]);

  // const totalReports = reports?.length;
  // const openReports = reports.filter(report => report.status === 'OPEN').length;
  // const inReviewReports = reports.filter(report => report.status === 'IN REVIEW').length;
  // const resolvedReports = reports.filter(report => report.status === 'RESOLVED').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
  );
};

export default Summary;
