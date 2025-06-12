'use client';
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; 
import { menuItems } from "./menuItems";
import Link from "next/link";
import Image from "next/image";
import { HelpCircle, Settings } from "lucide-react";
import { LuArrowRightToLine } from "react-icons/lu";
import ClickableTab from "@components/ui/clickable/clickabletab";
import { useAuthStore } from "@/lib/store/auth-store";
import Text from "@/app/styles/components/text";
import { TypographySize, TypographyBold } from "@styles/style.types";


export const getActiveMenuItem = (pathname: string) => {
  return menuItems.find((item) => item.href === pathname);
};

const LeftPanel = ({ onExpandChange }) => {
  const pathname = usePathname();
  const activeItem = getActiveMenuItem(pathname);
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuthStore();

  // Notify parent component when expansion state changes
  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded, onExpandChange]);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (!item.requiredRole) return true; // No role requirement
    return user?.role === item.requiredRole; // Check if user has required role
  });

  return (
    <div
      className={`${
        isExpanded ? "w-[214px]" : "w-[54px]"
      } h-full bg-white/90 backdrop-blur-md  border-[0.5px] border-[var(--color-border-primary)] rounded-xl flex flex-col py-3 px-2 transition-all duration-500 ease-in-out relative `}
    >
      
      <div className={`flex flex-col ${isExpanded ? "items-start" : "items-center"} gap-4`}>
        <div className="flex items-center justify-between w-full relative group">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src="/assets/LeftPanel/logo.png"
                alt="GADE Logo"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            </div>
            {isExpanded && <span className="text-[16px] font-semibold text-[#B58A3D]">GADE</span>}
          </div>

          
          <div
            onClick={toggleExpansion}
            className={`absolute top-1/2 transform -translate-y-1/2 w-[25px] h-[25px] bg-[var(--color-bg-tetiary)] rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 ease-in-out active:scale-90
              ${
                isExpanded 
                  ? "right-[-10] translate-x-1/2" 
                  : "left-[35px] group-hover:opacity-100"
              }
              ${!isExpanded && "opacity-0 group-hover:opacity-100"}
            `}
          >
            <LuArrowRightToLine
              size={14}
              className={`text-[var(--color-main-primary)] transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        <div className="w-full h-px bg-[var(--color-border-primary)]" />
      </div>

      
      <div className={`flex flex-col ${isExpanded ? "items-start" : "items-center"} gap-1 mt-2`}>
        <span className={`text-xs text-gray-400 px-2 ${isExpanded ? "self-start" : "hidden"}`}>Main</span>
        {filteredMenuItems.map((item, index) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link 
              key={index} 
              href={item.href} 
              className="w-full"
              prefetch={false}
            >
              <div
                className={`flex items-center gap-2 px-2 py-[8px] rounded-lg cursor-pointer transition-all ${
                  isActive ? "bg-[var(--main-primary-20)]" : "hover:bg-[var(--color-bg-tetiary)]"
                }`}
              >
                <Icon
                  size={20}
                  className={`${
                    isActive
                      ? "text-[var(--color-main-primary)]"
                      : "text-[var(--color-text-tetiary)]"
                  }`}
                />
                {isExpanded && (
                  <Text
                    textColor="rgb(31 41 55)"
                    size={TypographySize.body}
                    bold={TypographyBold.md}
                  >
                    {item.label}
                  </Text>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      
      <div className={`mt-auto flex flex-col ${isExpanded ? "items-start" : "items-center"} gap-2`}>
        <div className="w-full h-px bg-[var(--color-border-primary)] my-1" />

        <div className="flex items-center gap-2 px-2 py-[8px] rounded-lg hover:bg-[var(--color-bg-tetiary)] cursor-pointer w-full">
          <HelpCircle className="text-[var(--color-text-tetiary)] w-[18px] h-[18px]" />
          {isExpanded && <span className="text-sm text-[var(--color-text-tetiary)]">FAQ</span>}
        </div>

        <div className="flex items-center gap-2 px-2 py-[8px] rounded-lg hover:bg-[var(--color-bg-tetiary)] cursor-pointer w-full">
          <Settings className="text-[var(--color-text-tetiary)] w-[18px] h-[18px]" />
          {isExpanded && <span className="text-sm text-[var(--color-text-tetiary)]">Settings</span>}
        </div>

        <div className="flex items-center gap-2 px-2 py-[8px]">
          <div className="w-[28px] h-[28px] overflow-hidden rounded-full">
            <Image
              src="/assets/LeftPanel/profile.png"
              alt="Profile"
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
          </div>
          {isExpanded && <span className="text-sm text-[var(--color-text-tetiary)] truncate">{user?.email || 'Not logged in'}</span>}
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;