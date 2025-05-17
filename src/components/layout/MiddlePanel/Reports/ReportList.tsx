'use client';
import React from 'react';
import { reports } from '@/data/reportsData'; 
import Text from "@styles/components/text";
import theme from "@styles/theme";
import ClickableTab from '@components/ui/clickable/clickabletab';

const statusStyles = {
  'under-review': 'bg-[var(--bg-under-review)] text-[var(--under-review-text)]',
  'verified': 'bg-[var(--bg-verified)] text-[var(--verified-text)]',
  'notified': 'bg-[var(--bg-notified)] text-[var(--notified-text)]',
  'resolved': 'bg-[var(--bg-resolved)] text-[var(--resolved-text)]',
  
};

const ReportList = () => {
  return (
    <div className="flex flex-col gap-3 mt-2 ">
      {reports.map((report, index) => (
        <div
          key={index}
          className="flex justify-between items-center cursor-pointer bg-[var(--color-bg-primary-lighter)] border border-[var(--color-border-secondary)] rounded-xl px-4 py-3 w-[951px] h-[73px]"
        >
          
          <div className="flex flex-col w-[360px] overflow-hidden">
            <Text 
          size={theme.text.size.SM} 
          bold={theme.text.bold.md} 
          className="!text-[var(--color-text-primary)] truncate"
        >
          {report.title}
        </Text>
           
            <Text 
          size={theme.text.size.SM} 
          bold={theme.text.bold.sm} 
          className="!text-[var(--color-text-secondary)] truncate"
        >
          {report.description}
        </Text>

        <Text 
          size={theme.text.size.SM} 
          bold={theme.text.bold.sm} 
          className="!text-[var(--color-text-tetiary)] truncate"
        >
          {report.location}
        </Text>
            
          </div>

          
          <div className="flex items-center gap-4">
            <div className="w-7 h-7 bg-[var(--color-bg-secondary)] rounded-full flex items-center justify-center ">
              
        <Text 
          size={theme.text.size.SM} 
          bold={theme.text.bold.sm} 
          className="!text-[var(--color-text-tetiary)] truncate"
        >
          {report.initials}
        </Text>
            </div>

            <span className="text-sm  w-[120px] truncate">
                <Text 
          size={theme.text.size.SM} 
          bold={theme.text.bold.sm} 
          className="!text-[var(--color-text-secondary)] truncate"
        >
          {report.reporter}
        </Text>
              
            </span>

            <div className={`px-3 py-[2px] text-xs font-medium rounded-xl w-[120px] text-center truncate ${statusStyles[report.statusColor] || statusStyles.default}`}>
              
              {report.status}
            </div>

            <p className="text-xs text-[var(--color-text-tetiary)] w-[70px] text-right truncate">
              {report.timeAgo}
            </p>

            <div className="text-[var(--color-text-tetiary)] text-lg  text-center">
                <ClickableTab>•••</ClickableTab>
                </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportList;
