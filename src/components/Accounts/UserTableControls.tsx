"use client"

import React from "react";
import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconChevronDown } from "@tabler/icons-react";
import { FaSync } from 'react-icons/fa';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface UserTableControlsProps<TData> {
  table: Table<TData>;
  onRefresh: () => void;
  isRefreshing: boolean;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: string) => void;
  onRoleFilterChange: (role: string) => void;
  currentStatusFilter: string;
  currentRoleFilter: string;
}

export function UserTableControls<TData>({
  table,
  onRefresh,
  isRefreshing,
  onSearchChange,
  onStatusFilterChange,
  onRoleFilterChange,
  currentStatusFilter,
  currentRoleFilter,
}: UserTableControlsProps<TData>) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 px-4 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between py-4 space-y-4 md:space-y-0 md:space-x-4">
        <Input
          placeholder="Search user, eg: Dennis Boachie"
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("email")?.setFilterValue(event.target.value);
            onSearchChange(event.target.value);
          }}
          className="flex-1 w-full md:w-auto"
        />
        <div className="flex items-center space-x-2 flex-wrap justify-center md:justify-end gap-2">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`flex items-center justify-center size-8 p-0 rounded-md text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors
              ${isRefreshing ? 'cursor-not-allowed animate-spin' : 'cursor-pointer'}`}
          >
            <FaSync className="size-4" />
          </button>

          {/* Status Filter */}
          <Select value={currentStatusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Statuses">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          {/* Role Filter */}
          <Select value={currentRoleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Roles">All Roles</SelectItem>
              <SelectItem value="super admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>

          {/* Column visibility dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <IconChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Pagination controls */}
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 