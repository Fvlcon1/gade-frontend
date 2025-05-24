'use client';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from "next/image";
import Button from "@components/ui/button/button";
import { IoAddCircleOutline } from "react-icons/io5";
import OutlineButton from "@components/ui/button/outlineButton";
import theme from "@styles/theme";
import LeftPanel from "@components/layout/LeftPanel/LeftPanel";
import Mid from "@components/layout/MiddlePanel/Mid";
import { menuItems } from "@components/layout/LeftPanel/menuItems";
import Right from '@components/layout/RightPanel/Right';

export default function Home() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false); // ⬅️ Expansion state

  const activeItem = menuItems.find((item) => item.href === pathname);
  const activeTitle = activeItem?.label || "Dashboard";

  const ActiveIcon = activeItem?.icon;
  const activeIcon = ActiveIcon ? <ActiveIcon size={20} /> : null;

  return (
    <div className="flex w-screen h-screen overflow-hidden pl-2.5">
      <LeftPanel onExpandChange={setIsExpanded} />
      <Mid 
        activeTitle={activeTitle} 
        activeIcon={activeIcon}
        isActive={true}
      />
      <Right />
    </div>
  );
}
