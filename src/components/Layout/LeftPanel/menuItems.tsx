// components/menuItems.tsx

import { IoStatsChart } from "react-icons/io5";
import { MdMap } from "react-icons/md";
import { FaFileAlt, FaUsers } from "react-icons/fa";
import { AiFillAlert } from "react-icons/ai";
import Image from "next/image";
import React from "react";
import type { IconType } from "react-icons";
import { GiEarthAfricaEurope } from "react-icons/gi"
// Custom Icon component using Next.js Image, matching IconType signature
const SegmentationIcon: IconType = () => {

  return (
    <Image
      src="/seg2.svg"
      alt="Segmentation"
      width={25}
      height={25}
      className=''
    />
  );
};

export const menuItems = [
  {
    icon: IoStatsChart,
    label: "Dashboard",
    href: "/",
    requiredRole: null,
  },
  {
    icon: MdMap,
    label: "Map",
    href: "/map",
    requiredRole: null,
  },
  {
    icon: FaFileAlt,
    label: "Reports",
    href: "/reports",
    requiredRole: null,
  },
  {
    icon: AiFillAlert,
    label: "Alerts",
    href: "/alerts",
    requiredRole: null,
  },
  {
    icon: FaUsers,
    label: "Accounts",
    href: "/account",
    requiredRole: "ADMIN",
  },
  {
    icon: GiEarthAfricaEurope,
    label: "Segmentation",
    href: "/segmentation",
    requiredRole: "ADMIN",
  },
];
