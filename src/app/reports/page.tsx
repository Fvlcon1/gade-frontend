'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { FaSync } from 'react-icons/fa';
import LeftPanel from "@components/Layout/LeftPanel/LeftPanel";
import { menuItems } from "@components/Layout/LeftPanel/menuItems";
import Title from '@components/Layout/Reports/Title';
import Summary from '../../components/Layout/Reports/Summary';
import FilterBar from '@components/Layout/Reports/FilterBar';
import ReportList from '@components/Layout/Reports/ReportList';
import ReportItem from '../../components/Layout/Reports/ReportItem';
import { useSpatialStore, setupReportsRefresh, cleanupReportsRefresh } from '@/lib/store/spatialStore';
import { exportToCSV } from '@/utils/export';
import { exportToPDF } from '@/utils/export';
import { formatReportId } from '@/utils/format';


export default function ReportsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const activeItem = menuItems.find((item) => item.href === pathname);
  const activeTitle = activeItem?.label || "Reports";
  const ActiveIcon = activeItem?.icon;
  const activeIcon = ActiveIcon ? <ActiveIcon size={20} /> : null;

  // Sidebar expansion state
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');
  const [sortOrder, setSortOrder] = useState('Newest First');

  // Get reports from spatial store
  const { reports, isLoading, error, fetchReports } = useSpatialStore();

  // Set up and clean up reports refresh
  useEffect(() => {
    setupReportsRefresh();
    return () => cleanupReportsRefresh();
  }, []);

  // Handle manual refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchReports();
    setTimeout(() => setIsRefreshing(false), 1000); // Show refresh animation for 1 second
  }, [fetchReports]);

  const handleViewOnMap = useCallback((report) => {
    router.push(`/map?lat=${report.location.lat}&lon=${report.location.lon}&zoom=14&report=${report.id}`);
  }, [router]);

  const handleExport = useCallback((filters) => {
    if (!reports) return;

    // Filter reports based on current filters
    const filteredReports = reports.filter(report => {
      const formattedId = formatReportId(report.id);
      const matchesSearch = 
        formattedId.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        report.locality.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesStatus = filters.status === 'All Statuses' || report.status === filters.status;
      const matchesPriority = filters.priority === 'All Priorities' || report.severity === filters.priority.split(' ')[0];

      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Sort reports
    const sortedReports = [...filteredReports].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return filters.sort === 'Newest First' ? dateB - dateA : dateA - dateB;
    });

    // Prepare data for export
    const exportData = sortedReports.map(report => ({
      'Report ID': formatReportId(report.id),
      'Location': report.locality,
      'Status': report.status,
      'Severity': report.severity,
      'Created At': new Date(report.created_at).toLocaleString(),
      'Coordinates': `${report.location.lat}, ${report.location.lon}`
    }));

    // Export based on format
    if (filters.format === 'pdf') {
      exportToPDF(exportData, 'reports_export');
    } else {
      exportToCSV(exportData, 'reports_export');
    }
  }, [reports]);

  // Filter and sort reports
  const filteredReports = reports?.filter(report => {
    const formattedId = formatReportId(report.id);
    // Search term filter (case-insensitive)
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      formattedId.toLowerCase().includes(searchTermLower) ||
      report.locality.toLowerCase().includes(searchTermLower) ||
      (report.title?.toLowerCase().includes(searchTermLower)) ||
      (report.description?.toLowerCase().includes(searchTermLower));

    // Status filter (case-insensitive)
    const matchesStatus = statusFilter === 'All Statuses' || 
      report.status.toLowerCase() === statusFilter.toLowerCase();

    // Priority filter (case-insensitive)
    const priorityLevel = priorityFilter.split(' ')[0].toLowerCase();
    const matchesPriority = priorityFilter === 'All Priorities' || 
      report.severity.toLowerCase() === priorityLevel;

    return matchesSearch && matchesStatus && matchesPriority;
  }).sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === 'Newest First' ? dateB - dateA : dateA - dateB;
  }) || [];

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

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
        <div className="flex items-center justify-between mb-4">
          <Title activeTitle={activeTitle} activeIcon={activeIcon} isActive={true} />
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${isRefreshing 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
          >
            <FaSync className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

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
          <ReportList>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-600 border-t-transparent" />
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-lg">
                No reports found
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <ReportItem
                    key={report.id}
                    id={formatReportId(report.id)}
                    status={report.status}
                    priority={report.severity}
                    createdAt={report.created_at}
                    updatedAt={report.updated_at || report.created_at}
                    location={report.locality}
                    title={report.title}
                    description={report.description}
                    onViewOnMap={() => handleViewOnMap(report)}
                  />
                ))}
              </div>
            )}
          </ReportList>
        </div>
      </div>
    </div>
  );
}
