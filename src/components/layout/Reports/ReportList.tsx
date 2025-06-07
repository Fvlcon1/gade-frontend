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

const ReportList = ({ children }) => {
  return (
    <div className="space-y-4">
      {children}
    </div>
  );
};

export default ReportList;
