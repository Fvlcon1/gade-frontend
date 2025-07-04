'use client'

import LeftPanel from "@components/Layout/LeftPanel/LeftPanel"
import { useState } from "react"
import Filter from "./components/filter";
import { FaUsers } from "react-icons/fa6";
import Metrics from "./components/metrics/metrics";
import Header from "@components/header/header";
import Divider from "@components/ui/divider/divider";
import Controls from "./components/controls/controls";
import Table from "./components/table";
import Pagination from "@components/pagination/pagination";
import { useAccountsContext } from "./context/context";

const Accounts = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const {pageId, setPageId, pageSize, setPageSize} = useAccountsContext()

    return (
        <div className="w-full h-full flex">
            <div className="absolute top-0 left-1.5 z-[1001] h-full py-4">
                <LeftPanel onExpandChange={setSidebarExpanded} />
            </div>

            <div className={`flex gap-4 pr-4 w-full duration-400 h-full pt-5 ${sidebarExpanded ? 'pl-[272px]' : 'pl-[72px]'}`}>
                <div className="flex flex-col gap-3 w-full">
                    <Header
                        title="User Account Management"
                        icon={FaUsers}
                        size={"16px"}
                    />

                    <div className="flex flex-col gap-4 w-full">
                        <Metrics />
                        <Divider />
                        <Controls />
                        <Divider />
                        <Table />
                        <Pagination 
                            currentPage={pageId}
                            onPageChange={(page) => setPageId(page)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Accounts