"use client";
import React from "react";
import { MapPin } from "lucide-react";

interface ReportItemProps {
  id: string;
  status: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  createdAt: string;
  updatedAt: string;
  location: string;
  onViewOnMap: () => void;
}

// Mock data for titles and descriptions
const mockReports = [
  {
    title: "Large-scale Mining Operation",
    description: "Suspected galamsey operation behind the abandoned cocoa farm.",
  },
  {
    title: "Water Pollution from Mining Activity",
    description: "Discoloration in river water observed near suspected mining site",
  },
  {
    title: "Unauthorized Land Clearing",
    description: "Authorities have seized equipment and arrested 3 individuals",
  },
  {
    title: "Suspected Mining Equipment Transport",
    description: "Convoy of trucks carrying mining equipment spotted heading to...",
  },
  {
    title: "Noise Complaint - Mining Activity",
    description: "Investigation confirmed legal sand quarry operating outside...",
  }
];

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
  onViewOnMap
}) => {
  const timeAgo = new Date(createdAt).toLocaleDateString();
  
  // Get a consistent mock report based on the ID
  const mockIndex = parseInt(id.split('-').pop() || '0') % mockReports.length;
  const mockReport = mockReports[mockIndex];

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
            <span 
              className="text-sm font-medium"
              style={{ color: priorityStyles[priority].text }}
            >
              {formattedPriority} Priority
            </span>
          </div>
          <span className="text-gray-400 text-sm font-medium">{timeAgo}</span>
        </div>
        <span className="text-gray-400 text-sm font-semibold whitespace-nowrap">{id}</span>
      </div>

      {/* Main Body */}
      <div className="px-6 py-4 grid grid-cols-[1fr_300px_1fr] gap-x-6 items-center min-h-[100px]">
        {/* Title + Description */}
        <div className="space-y-2">
          <h3 className="text-[#1F2937] text-base font-semibold leading-6 line-clamp-1">{mockReport.title}</h3>
          <p className="text-gray-500 text-sm leading-5 line-clamp-2">{mockReport.description}</p>
        </div>

        {/* Location */}
        <div 
          className="flex items-center gap-2 text-[#374151] truncate cursor-pointer hover:text-[var(--color-main-primary)] group"
          onClick={onViewOnMap}
        >
          <MapPin size={18} className="text-gray-400 shrink-0 group-hover:text-[var(--color-main-primary)]" />
          <span className="text-sm truncate">{location}</span>
        </div>

        {/* Status */}
        <div className="flex justify-end">
          <span
            className="text-sm rounded-full px-4 py-1.5 font-semibold whitespace-nowrap"
            style={{ 
              backgroundColor: statusStyles[status.toLowerCase()]?.bg || statusStyles.default.bg,
              color: statusStyles[status.toLowerCase()]?.text || statusStyles.default.text
            }}
          >
            {statusStyles[status.toLowerCase()]?.label || statusStyles.default.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReportItem;