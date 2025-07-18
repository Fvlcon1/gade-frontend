'use client'

import Text from "@styles/components/text"
import { useTheme } from "@styles/theme-context"
import Image from "next/image"
import { useState, useEffect } from "react"
import { GoDotFill } from "react-icons/go"

export const Video = () => {
    return (
        <video
            key={"video"}
            autoPlay
            loop
            muted
            playsInline
            poster="/assets/bg-video-poster.jpg"
            preload="auto"
            src="/assets/bg-video.mp4"
            className="absolute top-0 left-0 w-screen h-screen object-cover z-0 transition-opacity duration-300"
        />
    )
}

export const FullDarkLogo = () => (
    <Image
        src="/assets/gade-logo-full-dark.svg"
        alt="GADE Logo"
        width={80}
        height={80}
        className="object-cover"
    />
)

export const Footer = () => {
    const [isMounted, setIsMounted] = useState(false)
    
    useEffect(() => {
        setIsMounted(true)
    }, [])
    
    if(!isMounted) return null
    
    return (
        <div className="flex gap-4">
            <Text>
                © GADE - A Blvck Sapphire product
            </Text>
            <Text>•</Text>
            <Text>
                Privacy Policy
            </Text>
            <Text>•</Text>
            <Text>
                Terms of Use
            </Text>
        </div>
    )
}

export const SideImage = () => {
    const { theme } = useTheme()
    const [isMounted, setIsMounted] = useState(false)
    
    useEffect(() => {
        setIsMounted(true)
    }, [])
    
    if(!isMounted) return null
    
    return (
        <div className="relative flex flex-1 bg-bg-secondary/60 overflow-hidden rounded-xl">
            <div className="flex flex-col gap-2 pt-[30px] pl-[70px]">
                <div className="flex items-center w-fit rounded-full px-2.5 py-1.5 border border-border-tetiary gap-2">
                    <GoDotFill size={10} color={theme.colors.text.tetiary} />
                    <Text textColor={theme.colors.text.tetiary}>Galamsey Detection System</Text>
                </div>
                <Text className="pl-0.5">
                    Automated surveillance against illegal mining in <b>Ghana</b>
                </Text>
                <div className="w-[700px] h-[500px]">
                    <Image
                        src="/assets/dashboard.png"
                        alt="Dashboard"
                        width={700}
                        height={500}
                        className="object-contain rounded-xl"
                    />
                </div>
            </div>

            <div className="w-full h-[300px] absolute bottom-0 left-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />
        </div>
    )
}