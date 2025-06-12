import React from 'react';
import { Button } from "@/components/ui/button";
import { IconUserPlus } from "@tabler/icons-react";
import Text, { Head1 } from '@/app/styles/components/text';
import { TypographySize, TypographyBold } from '@/app/styles/style.types';

interface AccountHeaderProps {
  onInviteUser: () => void;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({ onInviteUser }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <Head1
        textColor="rgb(31 41 55)"
        bold={TypographyBold.md2}
        size={TypographySize.HL}
      >
        User Account Management
      </Head1>
      <Button size="sm" onClick={onInviteUser} className="bg-[var(--color-main-primary)] hover:bg-[var(--color-main-primary)]/90 text-white rounded-lg px-4 py-2 flex items-center space-x-2">
        <IconUserPlus className="h-4 w-4" />
        <Text
          textColor="white"
          size={TypographySize.body}
          bold={TypographyBold.sm2}
        >
          Invite User
        </Text>
      </Button>
    </div>
  );
};

export default AccountHeader; 
