'use client'

import { useState, useEffect } from "react"
import { TbLocationFilled } from "react-icons/tb"
import { useTheme } from "@/app/styles/theme-context"
import { FaRulerCombined } from "react-icons/fa6"
import { GeomanControls } from './geaman-controls';
import './toolbar.css'
import { IoClose } from "react-icons/io5"
import { AnimatePresence } from "framer-motion"

const Toolbar = () => {
    const [isToolbarOpen, setIsToolbarOpen] = useState(false)
    const { theme } = useTheme()

    const handleToolbarClick = () => {
        setIsToolbarOpen(prev => !prev)
    }

    useEffect(() => {
        console.log({isToolbarOpen})
    }, [isToolbarOpen])

    return (
        <div
            className="toolbar absolute right-4 bottom-50 flex flex-col gap-4 z-[1002] rounded-lg w-[40px] h-[40px] dark:bg-bg-secondary/80 bg-bg-primary/80 filter backdrop-blur-sm cursor-pointer items-center justify-center hover:bg-white/70 hover:dark:bg-white/20 duration-200"
            onClick={handleToolbarClick}
        >
            <AnimatePresence>
                {isToolbarOpen && (
                    <GeomanControls />
                )}
            </AnimatePresence>
            {
                isToolbarOpen ? (
                    <IoClose
                        color={theme.colors.text.secondary}
                        size={15}
                    />
                ) : (
                    <FaRulerCombined
                        color={theme.colors.text.secondary}
                        size={15}
                    />
                )
            }
        </div>
    )
}
export default Toolbar