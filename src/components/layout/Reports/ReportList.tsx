'use client';
import React from 'react';
import { MapPin } from "lucide-react";
import Text from "@styles/components/text";
import theme from "@styles/theme";

const statusStyles = {
  'open': { label: 'Open', bg: '#FFEACC', text: '#D77E00' },
  'in-review': { label: 'In Review', bg: '#D7EDFF', text: '#3B82F6' },
  'resolved': { label: 'Resolved', bg: '#DEF7EC', text: '#047857' },
  'default': { label: 'Unknown', bg: '#F3F4F6', text: '#6B7280' }
};

const ReportList = ({ reports, searchTerm, statusFilter, priorityFilter, sortOrder }) => {
  // Filter and sort reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = searchTerm === '' || 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All Statuses' || report.status === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'All Priorities' || report.priority === priorityFilter.split(' ')[0];
    
    return matchesSearch && matchesStatus && matchesPriority;
  }).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'Newest First' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="space-y-4">
      {filteredReports.map((report, idx) => (
        <div key={idx} className="w-full bg-white rounded-[10px] border border-[#E5E7EB] hover:bg-[#FAFAFA] transition">
          {/* Top Row */}
          <div className="w-full h-[39px] bg-[#F9FAFB] border-b border-[#EBEBEB] flex items-center justify-between px-4 rounded-t-[10px]">
            <div className="flex items-center gap-3">
              <div className={`h-[22px] rounded-full flex items-center justify-center px-3 ${
                report.priority === 'High' ? 'bg-red-100' :
                report.priority === 'Medium' ? 'bg-yellow-100' :
                'bg-green-100'
              }`}>
                <span className={`text-xs font-medium ${
                  report.priority === 'High' ? 'text-red-700' :
                  report.priority === 'Medium' ? 'text-yellow-700' :
                  'text-green-700'
                }`}>{report.priority} Priority</span>
              </div>
              <span className="text-gray-400 text-[11px] font-medium">{report.timeAgo}</span>
            </div>
            <span className="text-gray-400 text-[11px] font-semibold whitespace-nowrap">{report.id}</span>
          </div>

          {/* Main Body */}
          <div className="px-5 py-3 grid grid-cols-[1fr_270px_1fr] gap-x-4 items-center">
            {/* Title + Description */}
            <div>
              <h3 className="text-[#1F2937] text-sm font-semibold leading-5 truncate">{report.title}</h3>
              <p className="text-gray-500 text-[13px] leading-[18px] truncate">{report.description}</p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-[#374151] truncate">
              <MapPin size={16} className="text-gray-400 shrink-0" />
              <span className="text-xs truncate">{report.location}</span>
            </div>

            {/* Status */}
            <div className="flex justify-end">
              <span
                className="text-xs rounded-full px-3 py-[2px] font-semibold whitespace-nowrap"
                style={{ 
                  backgroundColor: statusStyles[report.status]?.bg || statusStyles.default.bg,
                  color: statusStyles[report.status]?.text || statusStyles.default.text
                }}
              >
                {statusStyles[report.status]?.label || statusStyles.default.label}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportList;
