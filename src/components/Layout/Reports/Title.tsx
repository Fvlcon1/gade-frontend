'use client';
import React from 'react';
import Text from '@styles/components/text';
import theme from '@styles/theme';

interface TitleProps {
  activeTitle: string;
  activeIcon?: React.ReactNode;
  isActive?: boolean;
}

const Title: React.FC<TitleProps> = ({ activeTitle, activeIcon, isActive = false }) => {
  return (
    <div className="flex items-center gap-2 pt-2 shrink-0">
      {activeIcon && (
        <div
          className={`w-[32px] h-[30px] rounded-[5px] flex items-center justify-center
            ${
              isActive
                ? "bg-[var(--main-primary-20)] text-[var(--color-main-primary)]"
                : "bg-[var(--bg-secondary)] text-[var(--color-text-tetiary)]"
            }`}
        >
          <span className="w-[14px] h-[14px] flex items-center justify-center">
            {activeIcon}
          </span>
        </div>
      )}

      <Text
        size={theme.text.size.HL}
        bold={theme.text.bold.lg}
        className="!text-[var(--color-main-primary)] leading-none"
      >
        {activeTitle}
      </Text>
    </div>
  );
};

export default Title;
