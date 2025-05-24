'use client';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import LeftPanel from "@components/layout/LeftPanel/LeftPanel";
import { menuItems } from "@components/layout/LeftPanel/menuItems";
import Title from '@components/layout/Reports/Title';
import Summary from './components/Summary';
import FilterBar from './components/FilterBar';
import ReportList from '@components/layout/MiddlePanel/Reports/ReportList';
import ReportItem from './components/ReportItem';

export default function Home() {
  const pathname = usePathname();
  const activeItem = menuItems.find((item) => item.href === pathname);
  const activeTitle = activeItem?.label || "Reports";
  const ActiveIcon = activeItem?.icon;
  const activeIcon = ActiveIcon ? <ActiveIcon size={20} /> : null;

  // 👇 Sidebar expansion state
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-white pl-2.5">
      {/* Sidebar */}
      <LeftPanel onExpandChange={setSidebarExpanded} />

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ${
          sidebarExpanded ? "px-3" : "px-5"
        } pt-4`}
      >
        <Title activeTitle={activeTitle} activeIcon={activeIcon} isActive={true} />

        {/* Scrollable content area */}
        <div className="flex-1 flex flex-col overflow-y-auto pr-2 space-y-4 hide-scrollbar">
          <Summary />
          <FilterBar />
          <ReportItem />
        </div>
      </div>
    </div>
  );
}
