import { IoStatsChart } from "react-icons/io5";
import { MdMap } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { AiFillAlert } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";

export const menuItems = [
  { icon: IoStatsChart, label: "Dashboard", href: "/" },
  { icon: MdMap, label: "Map", href: "/map" },
  { icon: FaFileAlt, label: "Reports", href: "/reports" },
  { icon: AiFillAlert, label: "Alerts", href: "/alerts" },
  { icon: FaUsers, label: "Accounts", href: "/account" },
];