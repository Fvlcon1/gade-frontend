import React from 'react';
import { Button } from "@/components/ui/button";
import { IconUserPlus } from "@tabler/icons-react";
import Text from '@/app/styles/components/text';
import { TypographySize, TypographyBold } from '@/app/styles/style.types';
import { FaUsers } from "react-icons/fa";

interface AccountHeaderProps {
  onInviteUser: () => void;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({ onInviteUser }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-[var(--main-primary-20)] p-2 rounded-lg">
          <FaUsers className="h-6 w-6 text-[var(--color-main-primary)]" />
        </div>
     <Text
size={TypographySize.HL}
bold={TypographyBold.lg}
className="!text-[var(--color-main-primary)]"
>
{'User Account Management'}
</Text>
      </div>
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
