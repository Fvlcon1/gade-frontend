'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import { RiDownload2Line } from 'react-icons/ri';
import { IoMdArrowDropdown } from 'react-icons/io';
import { BsBroadcast, BsCheckCircleFill } from 'react-icons/bs';
import { MdSort, MdCheck } from 'react-icons/md';
import Text from '@styles/components/text';
import theme from '@styles/theme';
import { FaSync } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDownload, IconChevronDown } from "@tabler/icons-react";

const statusOptions = [
  'All Statuses',
  'Open',
  'In Review',
  'Resolved'
];

const priorityOptions = [
  'All Priorities',
  'High Priority',
  'Medium Priority',
  'Low Priority'
];

const sortOptions = [
  'Newest First',
  'Oldest First'
];

const Dropdown = ({ icon, options, selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center justify-between px-3 w-[160px] h-[40px] bg-[#FBFBFB] border border-gray-200 rounded-[10px] cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        {icon}
        <Text size={theme.text.size.SM} bold={theme.text.bold.md} className="text-gray-700">
          {selected}
        </Text>
        <IoMdArrowDropdown size={16} className="text-gray-400" />
      </div>
      {open && (
        <div className="absolute top-[110%] left-0 w-full bg-white rounded-lg border border-gray-200 shadow-sm z-10">
          {options.map((option) => {
            const isSelected = selected === option;
            return (
              <div
                key={option}
                className={`flex items-center gap-2 text-sm cursor-pointer rounded-[8px] px-2 py-1 mx-2 my-1 ${
                  isSelected
                    ? 'bg-[var(--main-primary-20)] text-[var(--color-main-primary)] font-[400]'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                {isSelected && <MdCheck className="text-[var(--color-main-primary)]" size={16} />}
                <span>{option}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface FilterBarProps {
  onSearch: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onExport: (filters: any) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  onStatusChange,
  onPriorityChange,
  onSortChange,
  onExport,
  onRefresh,
  isRefreshing,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const [status, setStatus] = useState('All Statuses');
  const [priority, setPriority] = useState('All Priorities');
  const [sort, setSort] = useState('Newest First');
  const [searchTerm, setSearchTerm] = useState('');
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const exportMenuRef = useRef(null);

  // Handle click outside for export menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setExportMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  // Handle filter changes
  useEffect(() => {
    onStatusChange(status);
  }, [status, onStatusChange]);

  useEffect(() => {
    onPriorityChange(priority);
  }, [priority, onPriorityChange]);

  useEffect(() => {
    onSortChange(sort);
  }, [sort, onSortChange]);

  const handleExport = (format) => {
    onExport({
      status,
      priority,
      sort,
      searchTerm,
      format
    });
    setExportMenuOpen(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
      <div className="flex flex-wrap items-center gap-4 justify-between">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 h-10 bg-white border border-gray-200 rounded-lg px-3">
            <FiSearch className="text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none bg-transparent placeholder:text-gray-400 text-sm"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Select
            defaultValue="All Statuses"
            onValueChange={onStatusChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Statuses">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Review">In Review</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue="All Priorities"
            onValueChange={onPriorityChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Priorities">All Priorities</SelectItem>
              <SelectItem value="High Priority">High Priority</SelectItem>
              <SelectItem value="Medium Priority">Medium Priority</SelectItem>
              <SelectItem value="Low Priority">Low Priority</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue="Newest First"
            onValueChange={onSortChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Newest First">Newest First</SelectItem>
              <SelectItem value="Oldest First">Oldest First</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-10 bg-[var(--color-main-primary)] text-white hover:bg-[var(--color-main-primary)]/90 hover:text-white"
          >
            <FaSync className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 bg-[var(--color-main-primary)] text-white hover:bg-[var(--color-main-primary)]/90 px-4 py-2 hover:text-white border border-gray-200 rounded-lg flex items-center gap-2">
                <IconDownload className="h-4 w-4" />
                <span>Export</span>
                <IconChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onExport({ format: 'csv' })}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport({ format: 'pdf' })}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2 ml-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-10 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-10 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
