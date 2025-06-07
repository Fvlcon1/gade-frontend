'use client';
import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { RiDownload2Line } from 'react-icons/ri';
import { IoMdArrowDropdown } from 'react-icons/io';
import { BsBroadcast, BsCheckCircleFill } from 'react-icons/bs';
import { MdSort, MdCheck } from 'react-icons/md';
import Text from '@styles/components/text';
import theme from '@styles/theme';

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

  return (
    <div className="relative">
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

const FilterBar = ({ onSearch, onStatusChange, onPriorityChange, onSortChange, onExport }) => {
  const [status, setStatus] = useState('All Statuses');
  const [priority, setPriority] = useState('All Priorities');
  const [sort, setSort] = useState('Newest First');
  const [searchTerm, setSearchTerm] = useState('');
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

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
    <div className="flex flex-wrap items-center gap-3 w-full max-w-[1140px] bg-white">
      {/* Search Input */}
      <div className="flex items-center gap-2 flex-1 min-w-[280px] h-[40px] bg-[#FBFBFB] border border-gray-200 rounded-[10px] px-3">
        <FiSearch className="text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search report id, title, description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full outline-none bg-transparent placeholder:text-gray-400 text-sm"
        />
      </div>

      {/* Dropdowns */}
      <div className="flex flex-wrap gap-3">
        <Dropdown 
          icon={<BsBroadcast size={14} className="text-gray-400" />} 
          options={statusOptions} 
          selected={status} 
          onChange={setStatus} 
        />
        <Dropdown 
          icon={<BsCheckCircleFill size={14} className="text-gray-500" />} 
          options={priorityOptions} 
          selected={priority} 
          onChange={setPriority} 
        />
        <Dropdown 
          icon={<MdSort size={16} className="text-gray-400" />} 
          options={sortOptions} 
          selected={sort} 
          onChange={setSort} 
        />
      </div>

      {/* Export Button with Dropdown */}
      <div className="relative ml-auto">
        <button 
          onClick={() => setExportMenuOpen(!exportMenuOpen)}
          className="w-[120px] h-[40px] bg-[var(--color-main-primary)] hover:bg-[var(--color-main-primary)]/90 transition-colors rounded-[10px] text-white flex items-center justify-center gap-2.5 text-sm font-medium px-4 shadow-sm hover:shadow-md active:shadow-sm"
        >
          <RiDownload2Line size={16} className="flex-shrink-0" />
          <span className="flex-shrink-0">Export</span>
          <IoMdArrowDropdown size={16} className="ml-0.5 flex-shrink-0" />
        </button>
        
        {exportMenuOpen && (
          <div className="absolute top-[calc(100%+4px)] right-0 w-[140px] bg-white rounded-lg border border-gray-200 shadow-lg z-10">
            <button
              onClick={() => handleExport('csv')}
              className="w-full flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-t-lg transition-colors"
            >
              <span className="text-xs font-medium">CSV</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="w-full flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-b-lg transition-colors"
            >
              <span className="text-xs font-medium">PDF</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
