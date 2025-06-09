import React from 'react';
import { Button } from "@/components/ui/button";
import { IconUserPlus } from "@tabler/icons-react";

interface AccountHeaderProps {
  onInviteUser: () => void;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({ onInviteUser }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      <Button size="sm" onClick={onInviteUser} className="bg-[var(--color-main-primary)] hover:bg-[var(--color-main-primary)]/90 text-white rounded-lg px-4 py-2 flex items-center space-x-2">
        <IconUserPlus className="h-4 w-4" />
        <span>Invite User</span>
      </Button>
    </div>
  );
};

export default AccountHeader; 