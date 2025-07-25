'use client'

import useNotificationsSocket from "@/hooks/use-notifications-socket"
import SlideIn from "@styles/components/slidein"
import Text from "@styles/components/text"
import { TiWarning } from "react-icons/ti"
import { useTheme } from "@styles/theme-context"
import ClickableTab from "./ui/clickable/clickabletab"
import { IoMdClock, IoMdCloseCircle } from "react-icons/io"
import Divider from "./ui/divider/divider"
import { IoLocation } from "react-icons/io5"
import Button from "./ui/button/button"
import OutlineButton from "./ui/button/outlineButton"
import { FaMapPin } from "react-icons/fa"
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from "react"
import { getRelativeTime } from "@/utils/getDate"
import { useRouter } from "next/navigation"

const PushNotification = () => {
    const router = useRouter()
    const { notification } = useNotificationsSocket()
    const { theme, themeColor } = useTheme()
    const [showNotification, setShowNotification] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const countdown = 10

    useEffect(() => {
        // Initialize isMounted when component mounts
        if(typeof window !== 'undefined') {
            setIsMounted(true)
        }

        // Handle notification state
        if(notification && isMounted) {
            setShowNotification(true)
            const timer = setTimeout(() => {
                setShowNotification(false)
            }, countdown * 1000)

            return () => clearTimeout(timer)
        }
    }, [notification])

    return (
        <AnimatePresence>
            {
                showNotification && (
                    <SlideIn
                        direction="right"
                        className="fixed bottom-6 right-6 z-[1001]"
                    >
                        <div className="p-2 px-3 flex flex-col gap-2 w-[300px] rounded-2xl bg-bg-tetiary/60 backdrop-blur-2xl border border-border-tetiary shadow-xl shadow-text-primary/5">
                            <div className="flex w-full justify-between">
                                <div className="flex items-center gap-1">
                                    <TiWarning size={13} color={theme.colors.text.secondary} />
                                    <div className="flex items-center gap-2">
                                        <Text
                                            size={theme.text.size.body2}
                                            bold={theme.text.bold.md}
                                        >
                                            New Report -
                                        </Text>
                                        <div className="flex px-2 py-1 rounded-full bg-text-danger/20 dark:bg-text-danger/50 border border-text-danger">
                                            <Text textColor={themeColor === "dark" ? theme.colors.text.primary : theme.colors.text.danger}>
                                                {notification?.payload?.severity}
                                            </Text>
                                        </div>
                                    </div>
                                </div>

                                <ClickableTab
                                    onClick={() => { }}
                                    className="!rounded-full"
                                >
                                    <IoMdCloseCircle size={15} color={theme.colors.text.tetiary} />
                                </ClickableTab>
                            </div>


                            <Text lineHeight={1.2}>
                                {notification?.payload?.description}
                            </Text>

                            <Divider className="my-1 !bg-border-tetiary" />

                            <div className="flex items-center justify-between w-full">
                                <div className="items-center flex gap-1">
                                    <FaMapPin size={13} color={theme.colors.text.tetiary} />
                                    <Text
                                        textColor={theme.colors.text.tetiary}
                                    >
                                        {notification?.payload?.locality}
                                    </Text>
                                </div>

                                <div className="items-center flex gap-1">
                                    <IoMdClock size={13} color={theme.colors.text.tetiary} />
                                    <Text
                                        textColor={theme.colors.text.tetiary}
                                    >
                                        {getRelativeTime(new Date(notification?.payload?.created_at))}
                                    </Text>
                                </div>
                            </div>

                            <div className="flex w-full gap-2 mt-1">
                                <Button
                                    text="View on map"
                                    className="flex-1"
                                    onClick={() => router.push(`/map?lat=${notification?.payload?.location?.lat}&lon=${notification?.payload?.location?.lon}&zoom=14&report=${notification?.payload?.id}`)}
                                />
                                <OutlineButton
                                    text="Dismiss"
                                    onClick={() => setShowNotification(false)}
                                />
                            </div>

                            <motion.div
                                className="rounded-full bg-text-danger h-[5px]"
                                initial={{ width: '100%' }}
                                animate={{ width: '0%' }}
                                transition={{ duration: 10, ease: 'linear', repeat: 0 }}
                            />
                        </div>
                    </SlideIn>
                )
            }
        </AnimatePresence>
    )
}
export default PushNotification