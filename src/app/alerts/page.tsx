'use client'

import LeftPanel from "@components/Layout/LeftPanel/LeftPanel"
import Header from "@components/header/header";
import { PiFilesFill } from "react-icons/pi";
import Metrics from "./components/metrics/metrics";
import Divider from "@components/ui/divider/divider";
import Controls from "./components/controls/controls";
import Alerts from "./components/alerts/alerts";
import Pagination from "@components/pagination/pagination";
import { useAlertsContext } from "./context/alert-context";
import { useAuthStore } from "@/lib/store/auth-store";

const AlertsPage = () => {
    const { sidebarExpanded } = useAuthStore();
    const {pageId, setPageId} = useAlertsContext()

    return (
        <div className="w-full h-full flex">
            <div className="fixed top-0 left-1.5 z-[1001] h-full py-4">
                <LeftPanel />
            </div>

            <div className={`flex pr-4 pt-2 w-full duration-400 h-full ${sidebarExpanded ? 'pl-[272px]' : 'pl-[72px]'}`}>
                <div className="flex flex-col w-full">

                    <div className="flex w-full justify-center py-3 sticky top-0 z-10 bg-bg-primary">
                        <div className="w-[1024px]">
                            <Header
                                title="Alerts"
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
                    <Alerts />
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
export default AlertsPage