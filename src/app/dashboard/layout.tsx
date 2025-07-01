'use client';
import LeftPanel from "@components/Layout/LeftPanel/LeftPanel";
import React, { useState } from "react";
import { DashboardProvider } from "@/app/dashboard/context/dashboard-context";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    return (
        <DashboardProvider>
            <div className="flex w-full gap-2 h-full">
                {/* Left Panel */}
                <div className="px-4 z-[1001] h-full min-h-full py-4">
                    <LeftPanel onExpandChange={setSidebarExpanded} />
                </div>

                {/* Main Content */}
                <div className={`h-full w-full overflow-y-auto`}>
                    {children}
                </div>
            </div>
        </DashboardProvider>
    )
}

export default DashboardLayout