'use client';
import LeftPanel from "@components/Layout/LeftPanel/LeftPanel";
import React, { useState } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    return (
        <div className="flex w-full gap-2">
            {/* Left Panel */}
            <div className="absolute top-0 left-1.5 z-[1001] h-full">
                <LeftPanel onExpandChange={setSidebarExpanded} />
            </div>
            {children}
        </div>
    )
}

export default DashboardLayout