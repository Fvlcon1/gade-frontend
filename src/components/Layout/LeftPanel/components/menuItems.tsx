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
    href: "/dashboard",
    requiredRole: null,
    size : 15
  },
  {
    icon: MdMap,
    label: "Map",
    href: "/map",
    requiredRole: null,
    size : 16
  },
  {
    icon: FaFileAlt,
    label: "Reports",
    href: "/report",
    requiredRole: null,
    size : 14
  },
  {
    icon: AiFillAlert,
    label: "Alerts",
    href: "/alerts",
    requiredRole: null,
    size : 17
  },
  {
    icon: FaUsers,
    label: "Accounts",
    href: "/accounts",
    requiredRole: "ADMIN",
    size : 16
  }
];
