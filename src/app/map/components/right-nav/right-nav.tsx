import { FaBolt, FaClipboardCheck } from "react-icons/fa6"
import { useState, useEffect } from "react"
import { Tooltip } from "antd"
import { useSpatialStore } from "@/lib/store/spatial-store"
import { useTheme } from "@/app/styles/theme-context"
import { RightNav as RightNavType } from "@/lib/store/spatial-store"

const RightNav = () => {
    const {theme} = useTheme()
    const { activeRightNav, setActiveRightNav } = useSpatialStore()
    const navItems : {name : RightNavType, icon : any}[] = [
        {
            name : "Review and Validation",
            icon : FaClipboardCheck
        },
        {
            name : "Priority index Heatmap",
            icon : FaBolt
        }
    ]
    
    return (
        <div className="absolute top-3 right-4 z-[1001] dark:bg-bg-secondary/80 bg-bg-primary/80 backdrop-blur-sm rounded-xl gap-0.5 shadow-xl flex flex-col items-center justify-around p-2 border border-border-secondary">
            {
                navItems.map((item, index) => (
                    <Tooltip
                        key={index}
                        title={item.name}
                        placement="left"
                    >
                        <div
                            className={`flex flex-col items-center  rounded-lg justify-center p-2 cursor-pointer ${activeRightNav === item.name ? 'bg-main-primary/20' : 'hover:bg-bg-quantinary duration-200'}`}
                            onClick={() => setActiveRightNav(activeRightNav === item.name ? null : item.name)}
                        >
                            <item.icon 
                                color={activeRightNav === item.name ? theme.colors.main.primary : theme.colors.text.secondary}
                            />
                        </div>
                    </Tooltip>
                ))
            }
        </div>
    )
}
export default RightNav