'use client';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import LeftPanel from "@components/Layout/LeftPanel/LeftPanel";
import { menuItems } from "@components/Layout/LeftPanel/menuItems";
import Text from '@/app/styles/components/text';
import { TypographySize, TypographyBold } from '@/app/styles/style.types';
import Image from 'next/image';

export default function SegmentationPage() {
  const pathname = usePathname();
  const activeItem = menuItems.find((item) => item.href === pathname);
  const activeTitle = activeItem?.label || "Segmentation";
  const ActiveIcon = activeItem?.icon;
  const activeIcon = ActiveIcon ? <ActiveIcon size={20} /> : null;

  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-white pl-2.5">
      <LeftPanel onExpandChange={setSidebarExpanded} />
      
      <div className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ${
        sidebarExpanded ? "px-3" : "px-5"
      } pt-4`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          {activeIcon && (
            <div className="w-[32px] h-[30px] rounded-[5px] flex items-center justify-center bg-[var(--main-primary-20)] text-[var(--color-main-primary)]">
              <span className="w-[14px] h-[14px] flex items-center justify-center">
                {activeIcon}
              </span>
            </div>
          )}
          <Text
            size={TypographySize.HL}
            bold={TypographyBold.lg}
            className="!text-[var(--color-main-primary)]"
          >
            {activeTitle}
          </Text>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 hide-scrollbar">
          <Text
            size={TypographySize.body}
            className="text-gray-500"
          >
            Segmentation management coming soon...
          </Text>
        </div>
      </div>
    </div>
  );
} 