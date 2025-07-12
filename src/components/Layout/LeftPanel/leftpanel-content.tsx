'use client';
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { menuItems } from "./components/menuItems";
import Link from "next/link";
import Image from "next/image";
import { LuArrowRightToLine } from "react-icons/lu";
import { useAuthStore } from "@/lib/store/auth-store";
import Text from "@/app/styles/components/text";
import Dropdown from "@components/ui/dropdown/dropdown";
import ProfileView from "./components/profile/profile-view";
import ProfileHead from "./components/profile-head";
import { useTheme } from "@styles/theme-context";
import ConfirmationModal from "@components/ui/confirmation-modal/confirmation-modal";
import { FaUserGear } from "react-icons/fa6";
import { useSettingsContext } from "@/app/context/settings-context";

export const getActiveMenuItem = (pathname: string) => {
  return menuItems.find((item) => item.href === pathname);
};

const LeftPanel = () => {
  const [hasMounted, setHasMounted] = useState(false); // <-- ADD
  const pathname = usePathname();
  const activeItem = getActiveMenuItem(pathname)
  const { user, sidebarExpanded: isExpanded, setSidebarExpanded: setIsExpanded } = useAuthStore();
  const { theme } = useTheme();

  useEffect(() => {
    setHasMounted(true); // <-- ADD
  }, []);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.requiredRole) return true;
    return user?.role === item.requiredRole;
  });

  if (!hasMounted) return null; // <-- PREVENT HYDRATION MISMATCH

  return (
    <>
      <div className="h-full">
        <div
          className={`${isExpanded ? "w-[250px]" : "w-[54px]"
            } h-full bg-bg-primary/80 z-[1005] backdrop-blur-md border-[1px] border-border-primary rounded-2xl flex flex-col transition-all duration-500 ease-in-out relative `}
        >
          <div className={`flex flex-col ${isExpanded ? "items-start" : "items-center"} gap-4 `}>
            <div className={`flex items-center ${isExpanded ? "justify-between px-3" : "justify-center px-1"} z-[1006] w-full relative group border-b-[1px] border-border-primary bg-bg-primary-lighter py-3 rounded-t-2xl`}>
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
                className={`absolute z-[1005] top-1/2 transform -translate-y-1/2 w-[25px] h-[25px] bg-[var(--color-bg-tetiary)] rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 ease-in-out active:scale-90
                  ${isExpanded
                    ? "right-5 translate-x-1/2"
                    : "right-[-30px] group-hover:opacity-100"
                  }
                  ${!isExpanded && "opacity-0 group-hover:opacity-100"}
                `}
              >
                <LuArrowRightToLine
                  size={14}
                  className={`text-[var(--color-main-primary)] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
                    }`}
                />
              </div>
            </div>
          </div>

          <div className={`flex flex-col ${isExpanded ? "items-start" : "items-center"} gap-1 mt-2 px-2`}>
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
                  legacyBehavior={false}
                >
                  <div
                    className={`flex items-center gap-2 px-2 py-[8px] rounded-lg cursor-pointer transition-all 
                      ${isActive ? "bg-main-primary/10" : "hover:bg-[var(--color-bg-tetiary)]"}
                      ${!isExpanded ? "justify-center" : ""}   
                    `}
                  >
                    <Icon
                      size={item.size ?? 16}
                      className={`${isActive
                        ? "text-[var(--color-main-primary)]"
                        : "text-[var(--color-text-tetiary)]"
                        }`}
                    />
                    {isExpanded && (
                      <Text
                        textColor={isActive ? theme.colors.main.primary : theme.colors.text.secondary}
                        bold={isActive ? theme.text.bold.md : theme.text.bold.sm2}
                      >
                        {item.label}
                      </Text>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className={`mt-auto flex flex-col ${isExpanded ? "items-start w-full" : "items-center"} gap-0`}>
            <Dropdown
              component={<ProfileView />}
              position="top-left"
              className="!w-fit !p-0 !rounded-2xl !ml-4 !overflow-visible !max-h-fit !z-[1006]"
              outterContainerClassName="w-full"
            >
              <div className="flex flex-1 w-full items-center rounded-b-2xl border-[1px] border-border-primary gap-2 px-3 justify-center py-3 bg-bg-primary-lighter hover:bg-bg-secondary duration-200 cursor-pointer">
                {/* <div className="min-w-[28px] min-h-[28px] overflow-hidden rounded-full flex">
                  <Image
                    src="/assets/LeftPanel/profile.png"
                    alt="Profile"
                    width={28}
                    height={28}
                    className="rounded-full object-cover"
                  />
                </div> */}
                <ProfileHead />
                {isExpanded && (
                  <div className="flex flex-1 w-full flex-col gap-1 overflow-x-hidden">
                    <div className="flex flex-1 w-full">
                      <Text ellipsis>
                        {`${user?.first_name} ${user?.last_name}` || 'Not logged in'}
                      </Text>
                    </div>
                    <div className="flex flex-1 w-full mt-[-2px]">
                      <Text ellipsis textColor={theme.colors.text.tetiary}>
                        {user?.email || 'Not logged in'}
                      </Text>
                    </div>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftPanel;
