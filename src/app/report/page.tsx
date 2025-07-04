'use client'

import LeftPanel from "@components/Layout/LeftPanel/LeftPanel"
import { useState } from "react"
import Header from "@components/header/header";
import { PiFilesFill } from "react-icons/pi";
import Metrics from "./components/metrics/metrics";
import Divider from "@components/ui/divider/divider";
import Controls from "./components/controls/controls";
import Reports from "./components/reports/reports";
import Pagination from "@components/pagination/pagination";
import { useReportsContext } from "./context/report-context";

const Report = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const {pageId, setPageId} = useReportsContext()

    return (
        <div className="w-full h-full flex">
            <div className="fixed top-0 left-1.5 z-[1001] h-full py-4">
                <LeftPanel onExpandChange={setSidebarExpanded} />
            </div>

            <div className={`flex pr-4 w-full duration-400 h-full ${sidebarExpanded ? 'pl-[272px]' : 'pl-[72px]'}`}>
                <div className="flex flex-col w-full">

                    <div className="flex w-full justify-center py-3 sticky top-0 z-10 bg-bg-primary">
                        <div className="w-[1024px]">
                            <Header
                                title="Reports"
                                icon={PiFilesFill}
                                size={"16px"}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full sticky top-13 bg-bg-primary z-10">
                        <Metrics />
                        <Divider />
                        <Controls />
                        <Divider />
                    </div>
                    <Reports />
                    <Pagination 
                        currentPage={pageId}
                        onPageChange={(page) => setPageId(page)}
                        className="pb-4"
                    />
                </div>
            </div>
        </div>
    )
}
export default Report