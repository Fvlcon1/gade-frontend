import React from 'react';
import { IconUserPlus } from "@tabler/icons-react";
import Text from '@/app/styles/components/text';
import { TypographySize, TypographyBold } from '@/app/styles/style.types';
import { FaUsers } from "react-icons/fa";
import Button from '@components/ui/button/button';

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
      <Button 
        onClick={onInviteUser}
        text="Invite User"
        icon={<IconUserPlus />}
      />
    </div>
  );
};

export default AccountHeader; 
