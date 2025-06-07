"use client";
import React from "react";
import { MapPin } from "lucide-react";

const reports = [
  {
    priorityLabel: "High Priority",
    priorityColor: "#FF303021",
    textColor: "#B74949",
    date: "2 hours ago | 2nd May 2025",
    title: "Large-scale Mining Operation",
    description: "Suspected galamsey operation behind the abandoned cocoa farm.",
    location: "Obuasi | 5.6037° N, 0.1870° W",
    initials: "CA",
    reporter: "Chris Ampeh",
    status: { label: "Under Review", bg: "#FFEACC", text: "#D77E00" },
  },
  {
    priorityLabel: "Medium Priority",
    priorityColor: "#FFB80021",
    textColor: "#A68126",
    date: "6 hours ago | 2nd May 2025",
    title: "Water Pollution from Mining Activity",
    description: "Discoloration in river water observed near suspected mining site",
    location: "Tarkwa Nsuaem | 5.6037° N, 0.1870° W",
    initials: "BA",
    reporter: "Bright Addae",
    status: { label: "Verified", bg: "#D7EDFF", text: "#3B82F6" },
  },
  {
    priorityLabel: "Medium Priority",
    priorityColor: "#FFB80021",
    textColor: "#A68126",
    date: "3 Days ago | 30th April 2025",
    title: "Unauthorized Land Clearing",
    description: "Authorities have seized equipment and arrested 3 individuals",
    location: "Dunkwa-on-Offin | 5.6037° N, 0.1870° W",
    initials: "MP",
    reporter: "Mawuli Pomary",
    status: { label: "Auth Notified", bg: "#F5E1FF", text: "#B05ACD" },
  },
  {
    priorityLabel: "Low Priority",
    priorityColor: "#7CFF9221",
    textColor: "#1A7F37",
    date: "A week ago | 25th April 2025",
    title: "Suspected Mining Equipment Transport",
    description: "Convoy of trucks carrying mining equipment spotted heading to...",
    location: "Asankragwa | 5.6037° N, 0.1870° W",
    initials: "IO",
    reporter: "Isaac Obeng",
    status: { label: "Resolved", bg: "#DEF7EC", text: "#047857" },
  },
  {
    priorityLabel: "Low Priority",
    priorityColor: "#7CFF9221",
    textColor: "#1A7F37",
    date: "2 weeks ago | 20th April 2025",
    title: "Noise Complaint - Mining Activity",
    description: "Investigation confirmed legal sand quarry operating outside...",
    location: "Prestea | 5.6037° N, 0.1870° W",
    initials: "DB",
    reporter: "Dennis Boakye",
    status: { label: "Verified", bg: "#D7EDFF", text: "#3B82F6" },
  },
];

const ReportItem = () => {
  return (
    <div className="space-y-4">
      {reports.map((report, idx) => (
        <div key={idx} className="w-[1302px] bg-white rounded-[10px] border border-[#E5E7EB] hover:bg-[#FAFAFA] transition">
          {/* Top Row */}
          <div className="w-full h-[39px] bg-[#F9FAFB] border-b border-[#EBEBEB] flex items-center justify-between px-4 rounded-t-[10px]">
            <div className="flex items-center gap-3">
              <div className="h-[22px] rounded-full flex items-center justify-center px-3" style={{ backgroundColor: report.priorityColor }}>
                <span className="text-xs font-medium" style={{ color: report.textColor }}>{report.priorityLabel}</span>
              </div>
              <span className="text-gray-400 text-[11px] font-medium">{report.date}</span>
            </div>
            <span className="text-gray-400 text-[11px] font-semibold whitespace-nowrap">#GADE-2025-057</span>
          </div>

          {/* Main Body */}
          <div className="px-5 py-3 grid grid-cols-[490px_270px_240px_1fr] gap-x-4 items-center">
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

            {/* Reporter */}
            <div className="flex items-center gap-3 truncate ml-[80px]">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F3F4F6] text-xs font-medium text-gray-500">
                {report.initials}
              </div>
              <span className="text-[#1F2937] text-xs font-semibold">{report.reporter}</span>
            </div> 

            {/* Status */}
            <div className="flex justify-end">
              <span
                className="text-xs rounded-full px-3 py-[2px] font-semibold whitespace-nowrap"
                style={{ backgroundColor: report.status.bg, color: report.status.text }}
              >
                {report.status.label}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportItem;