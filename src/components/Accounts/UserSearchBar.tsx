import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search } from 'lucide-react';
import { IconLayoutColumns, IconChevronDown } from "@tabler/icons-react";

interface UserSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
      <div className="flex flex-wrap items-center gap-4 justify-between">
        {/* Search Input */}
      
        
        {/* Action Buttons (Columns) */}
        <div className="flex items-center gap-2">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <IconLayoutColumns className="h-4 w-4" />
                <span>Columns</span>
                <IconChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" />
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default UserSearchBar; 