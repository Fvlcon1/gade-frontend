'use client';

import React, { useState } from 'react';
import LeftPanel from '@components/Layout/LeftPanel/LeftPanel';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Left Panel */}
      <div className="absolute top-0 left-1.5 z-[1001] h-full py-4">
        <LeftPanel onExpandChange={setSidebarExpanded} />
      </div>

      {/* Main Content */}
      <div className={`h-full transition-all duration-500 ${sidebarExpanded ? 'pl-[232px]' : 'pl-[72px]'}`}>
        {children}
      </div>
    </div>
  );
} 