"use client";
import React from "react";
import { MapPin } from "lucide-react";
import Text, { Head1 } from '@/app/styles/components/text';
import { TypographySize, TypographyBold } from '@/app/styles/style.types';

interface ReportItemProps {
  id: string;
  status: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  createdAt: string;
  updatedAt: string;
  location: string;
  title?: string;
  description?: string;
  onViewOnMap: () => void;
}

// Remove mock data
// const mockReports = [...];

const statusStyles = {
  'open': { label: 'Open', bg: '#FFEACC', text: '#D77E00' },
  'in-review': { label: 'In Review', bg: '#D7EDFF', text: '#3B82F6' },
  'resolved': { label: 'Resolved', bg: '#DEF7EC', text: '#047857' },
  'default': { label: 'Unknown', bg: '#F3F4F6', text: '#6B7280' }
};

const priorityStyles = {
  'HIGH': { bg: '#FFE5E5', text: '#B91C1C' },
  'MEDIUM': { bg: '#FEF3C7', text: '#92400E' },
  'LOW': { bg: '#DCFCE7', text: '#166534' }
};

const ReportItem: React.FC<ReportItemProps> = ({
  id,
  status,
  priority,
  createdAt,
  updatedAt,
  location,
  title,
  description,
  onViewOnMap
}) => {
  // Format date to human readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Remove mock report logic
  // const mockIndex = Math.abs(parseInt(id.replace(/\D/g, '') || '0')) % mockReports.length;
  // const mockReport = mockReports[mockIndex] || mockReports[0];

  // Format priority to capitalize only first letter
  const formattedPriority = priority.charAt(0) + priority.slice(1).toLowerCase();

  return (
    <div className="w-full bg-white rounded-[10px] border border-[#E5E7EB] hover:bg-[#FAFAFA] transition">
      {/* Top Row */}
      <div className="w-full h-[48px] bg-[#F9FAFB] border-b border-[#EBEBEB] flex items-center justify-between px-6 rounded-t-[10px]">
        <div className="flex items-center gap-4">
          <div 
            className="h-[28px] rounded-full flex items-center justify-center px-4"
            style={{ backgroundColor: priorityStyles[priority].bg }}
          >
            <Text
              textColor={priorityStyles[priority].text}
              size={TypographySize.body}
              bold={TypographyBold.md}
            >
              {formattedPriority} Priority
            </Text>
          </div>
          <Text
            textColor="rgb(156 163 175)"
            size={TypographySize.body}
            bold={TypographyBold.md}
          >
            {formatDate(createdAt)}
          </Text>
        </div>
        <Text
          textColor="rgb(156 163 175)"
          size={TypographySize.body}
          bold={TypographyBold.md2}
          className="whitespace-nowrap"
        >
          {id}
        </Text>
      </div>

      {/* Main Body */}
      <div className="px-6 py-4 grid grid-cols-[1fr_300px_1fr] gap-x-6 items-center min-h-[100px]">
        {/* Title + Description */}
        <div className="space-y-2">
          <Head1
            textColor="rgb(31 41 55)"
            size={TypographySize.HM}
            bold={TypographyBold.md2}
            className="line-clamp-1"
          >
            {title || 'No Title'}
          </Head1>
          <Text
            textColor="rgb(107 114 128)"
            size={TypographySize.body}
            className="line-clamp-2"
          >
            {description || 'No Description'}
          </Text>
        </div>

        {/* Location */}
        <div 
          className="flex items-center gap-2 text-[#374151] truncate cursor-pointer hover:text-[var(--color-main-primary)] group"
          onClick={onViewOnMap}
        >
          <MapPin size={18} className="text-gray-400 shrink-0 group-hover:text-[var(--color-main-primary)]" />
          <Text
            textColor="rgb(55 65 81)"
            size={TypographySize.body}
            className="truncate group-hover:text-[var(--color-main-primary)]"
          >
            {location}
          </Text>
        </div>

        {/* Status */}
        <div className="flex justify-end">
          <Text
            textColor={statusStyles[status.toLowerCase()]?.text || statusStyles.default.text}
            size={TypographySize.body}
            bold={TypographyBold.md2}
            className="rounded-full px-4 py-1.5 whitespace-nowrap"
            style={{ 
              backgroundColor: statusStyles[status.toLowerCase()]?.bg || statusStyles.default.bg,
            }}
          >
            {statusStyles[status.toLowerCase()]?.label || statusStyles.default.label}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default ReportItem;