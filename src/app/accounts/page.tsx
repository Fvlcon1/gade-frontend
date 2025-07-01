'use client'

import LeftPanel from "@components/Layout/LeftPanel/LeftPanel"
import Text from "@styles/components/text";
import { useState } from "react"

const Accounts = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    return (
        <div className="w-full h-full flex">
            <div className="absolute top-0 left-1.5 z-[1001] h-full py-4">
                <LeftPanel onExpandChange={setSidebarExpanded} />
            </div>

            <div className={`flex w-full duration-400 h-full pt-4 ${sidebarExpanded ? 'pl-[272px]' : 'pl-[72px]'}`}>
                <div className="w-[250px] h-[80%] rounded-2xl border-[1px] border-border-primary">
                    <div className="w-full h-[50px] flex px-3 items-center rounded-t-2xl bg-bg-primary-lighter border-b-[1px] border-border-primary">
                        <Text>
                            Filter
                        </Text>
                    </div>
                </div>
                <div className="flex flex-1 w-full h-full">
                    
                </div>
            </div>
        </div>
    )
}
export default Accounts