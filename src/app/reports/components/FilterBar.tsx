'use client';
import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { RiDownload2Line } from 'react-icons/ri';
import { IoMdArrowDropdown } from 'react-icons/io';
import { BsBroadcast, BsCheckCircleFill } from 'react-icons/bs';
import { MdSort } from 'react-icons/md';
import { MdCheck } from 'react-icons/md';
import Text from '@styles/components/text';
import theme from '@styles/theme';

const statusOptions = [
  'All Statuses',
  'Under review',
  'Auth Notified',
  'Verified',
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
        className="flex items-center justify-between px-3 w-[160px] h-[40px] bg-[#FBFBFB] border border-gray-200 rounded-[10px] cursor-pointer"
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

const FilterBar = () => {
  const [status, setStatus] = useState('All Statuses');
  const [priority, setPriority] = useState('All Priorities');
  const [sort, setSort] = useState('Newest First');

  return (
    <div className="flex items-center w-full max-w-[1140px] h-[40px] space-x-3 bg-white">
      {/* Search Input */}
      <div className="flex items-center gap-2 w-[440px] mr-8 h-full bg-[#FBFBFB] border border-gray-200 rounded-[10px] px-3">
        <FiSearch className="text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search report id, title, description..."
          className="w-full outline-none bg-transparent placeholder:text-gray-400 text-sm"
        />
      </div>

      {/* Dropdowns */}
      <Dropdown icon={<BsBroadcast size={14} className="text-gray-400" />} options={statusOptions} selected={status} onChange={setStatus} />
      <Dropdown icon={<BsCheckCircleFill size={14} className="text-gray-500" />} options={priorityOptions} selected={priority} onChange={setPriority} />
      <Dropdown icon={<MdSort size={16} className="text-gray-400" />} options={sortOptions} selected={sort} onChange={setSort} />

      {/* Export Button */}
      <button className="ml-auto w-[100px] h-full bg-[var(--color-main-primary)] transition-colors rounded-[10px] text-white flex items-center justify-center gap-2 text-sm font-medium">
        <RiDownload2Line size={16} />
        Export
      </button>
    </div>
  );
};

export default FilterBar;
