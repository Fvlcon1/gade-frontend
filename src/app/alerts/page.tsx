'use client';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import LeftPanel from "@components/Layout/LeftPanel/LeftPanel";
import { menuItems } from "@components/Layout/LeftPanel/menuItems";
import Title from '@components/Layout/Reports/Title';


export default function Home() {
  const pathname = usePathname();
  const activeItem = menuItems.find((item) => item.href === pathname);
  const activeTitle = activeItem?.label || "Reports";
  const ActiveIcon = activeItem?.icon;
  const activeIcon = ActiveIcon ? <ActiveIcon size={20} /> : null;

  
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-white pl-2.5">
     
      <LeftPanel onExpandChange={setSidebarExpanded} />

      
      
    </div>
  );
}
