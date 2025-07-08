import { FaClipboardCheck } from "react-icons/fa6"
import { useState, useEffect } from "react"
import theme from "@styles/theme"
import { Tooltip } from "antd"
import { useSpatialStore } from "@/lib/store/spatial-store"

const RightNav = () => {
    const [activeItem, setActiveItem] = useState(null)
    const { setIsReviewValidationVisible } = useSpatialStore()
    const navItems = [
        {
            name : "Review and Validation",
            icon : FaClipboardCheck
        }
    ]

    useEffect(() => {
        if(activeItem === "Review and Validation")
            setIsReviewValidationVisible(true)
        else
            setIsReviewValidationVisible(false)
    }, [activeItem])
    
    return (
        <div className="absolute top-3 right-4 z-[1001] bg-white/80 backdrop-blur-sm rounded-xl gap-0.5 shadow-xl flex flex-col items-center justify-around p-2">
            {
                navItems.map((item, index) => (
                    <Tooltip
                        key={index}
                        title={item.name}
                        placement="left"
                    >
                        <div
                            className={`flex flex-col items-center  rounded-lg justify-center p-2 cursor-pointer ${activeItem === item.name ? 'bg-main-primary/20' : 'hover:bg-bg-quantinary duration-200'}`}
                            onClick={() => setActiveItem(prev => prev === item.name ? null : item.name)}
                        >
                            <item.icon 
                                color={activeItem === item.name ? theme.colors.main.primary : theme.colors.text.secondary}
                            />
                        </div>
                    </Tooltip>
                ))
            }
        </div>
    )
}
export default RightNav