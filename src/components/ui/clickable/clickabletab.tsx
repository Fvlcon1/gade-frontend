'use client'

import { baseProps } from "@/utils/@types"
import { useState } from "react"

interface ClickableTabProps extends baseProps {
    scaleFactor?: number
}

const ClickableTab = ({
    children,
    className,
    onClick,
    scaleFactor
} : ClickableTabProps) => {

    const [onHover, setOnHover] = useState<boolean>(false)
    const [onPress, setOnPress] = useState<boolean>(false)

    return (
        <div 
            className={`flex p-[4px] w-fit h-fit rounded-md duration-200 hover:bg-bg-tetiary cursor-pointer ${className}`}
            onClick={onClick ? (e)=>onClick(e) : ()=>{}}
            onMouseOver={()=>setOnHover(true)}
            onMouseLeave={()=>setOnHover(false)}
            onMouseDown={()=>setOnPress(true)}
            onMouseUp={()=>setOnPress(false)}
            style={{
                transform: `scale(${onPress ? scaleFactor ?? 0.97 : 1})`,
            }}
        >
            {children}
        </div>
    )
}
export default ClickableTab