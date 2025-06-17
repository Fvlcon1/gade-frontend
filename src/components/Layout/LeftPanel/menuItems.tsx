// components/menuItems.tsx

import { IoStatsChart } from "react-icons/io5";
import { MdMap } from "react-icons/md";
import { FaFileAlt, FaUsers } from "react-icons/fa";
import { AiFillAlert } from "react-icons/ai";
import React from "react";
import type { IconType } from "react-icons";

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
  }
];
