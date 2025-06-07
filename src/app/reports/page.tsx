'use client';
import { usePathname } from 'next/navigation';
import { useState, useCallback } from 'react';
import LeftPanel from "@components/layout/LeftPanel/LeftPanel";
import { menuItems } from "@components/layout/LeftPanel/menuItems";
import Title from '@components/layout/Reports/Title';
import Summary from '../../components/layout/Reports/Summary';
import FilterBar from '@/components/layout/Reports/FilterBar';
import ReportList from '@/components/layout/Reports/ReportList';
import ReportItem from '../../components/layout/Reports/ReportItem';
import { reports } from '@/data/reportsData';
import { exportToCSV } from '@/lib/utils/export';
import { exportToPDF } from '@/lib/utils/export';

export default function Home() {
  const pathname = usePathname();
  const activeItem = menuItems.find((item) => item.href === pathname);
  const activeTitle = activeItem?.label || "Reports";
  const ActiveIcon = activeItem?.icon;
  const activeIcon = ActiveIcon ? <ActiveIcon size={20} /> : null;

  // 👇 Sidebar expansion state
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');
  const [sortOrder, setSortOrder] = useState('Newest First');

  const handleExport = useCallback((filters) => {
    // Filter reports based on current filters
    const filteredReports = reports.filter(report => {
      const matchesSearch = 
        report.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        report.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesStatus = filters.status === 'All Statuses' || report.status === filters.status.toLowerCase();
      const matchesPriority = filters.priority === 'All Priorities' || report.priority === filters.priority.split(' ')[0];

      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Sort reports
    const sortedReports = [...filteredReports].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return filters.sort === 'Newest First' ? dateB - dateA : dateA - dateB;
    });

    // Prepare data for export
    const exportData = sortedReports.map(report => ({
      'Report ID': report.id,
      'Title': report.title,
      'Description': report.description,
      'Location': report.location,
      'Status': report.status,
      'Priority': report.priority,
      'Created At': new Date(report.createdAt).toLocaleString(),
      'Last Updated': new Date(report.updatedAt).toLocaleString()
    }));

    // Export based on format
    if (filters.format === 'pdf') {
      exportToPDF(exportData, 'reports_export');
    } else {
      exportToCSV(exportData, 'reports_export');
    }
  }, []);

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
          <FilterBar
            onSearch={setSearchTerm}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
            onSortChange={setSortOrder}
            onExport={handleExport}
          />
          <ReportList
            reports={reports}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            sortOrder={sortOrder}
          />
        </div>
      </div>
    </div>
  );
}
