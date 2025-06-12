"use client"

import React from "react";
import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconChevronDown, IconRefresh } from "@tabler/icons-react";
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 px-4 mb-2">
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-8 bg-[var(--color-main-primary)] text-white hover:bg-[var(--color-main-primary)]/90 hover:text-white"
            >
              {isRefreshing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Refreshing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <IconRefresh className="h-4 w-4" />
                  <span>Refresh</span>
                </div>
              )}
            </Button>
          </div>

          {/* Status Filter */}
          <Select value={currentStatusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Statuses">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>

          {/* Role Filter */}
          <Select value={currentRoleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Roles">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="STANDARD">Standard</SelectItem>
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