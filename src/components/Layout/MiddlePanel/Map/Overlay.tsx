import React from 'react'
import { MdMap } from "react-icons/md";

const FullMapButton = () => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 z-10 rounded-full backdrop-blur-md bg-white/30 border top-[300px] border-white/40 shadow-sm text-[var(--color-main-primary)] text-sm relative font-medium cursor-pointer">
      <MdMap className="w-[16px] h-[16px] text-[var(--color-main-primary)]" />
      <span>Full map</span>
    </div>
  );
};

export default FullMapButton;
