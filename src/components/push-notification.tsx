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
import { motion } from 'framer-motion';

const PushNotification = () => {
    const { notification } = useNotificationsSocket()
    const { theme, themeColor } = useTheme()

    return (
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
                                    High
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
                    I'm here to snitch on some galamseyers in my community
                </Text>

                <Divider className="my-1 !bg-border-tetiary" />

                <div className="flex items-center justify-between w-full">
                    <div className="items-center flex gap-1">
                        <FaMapPin size={13} color={theme.colors.text.tetiary} />
                        <Text
                            textColor={theme.colors.text.tetiary}
                        >
                            Downtown District
                        </Text>
                    </div>

                    <div className="items-center flex gap-1">
                        <IoMdClock size={13} color={theme.colors.text.tetiary} />
                        <Text
                            textColor={theme.colors.text.tetiary}
                        >
                            5 seconds ago
                        </Text>
                    </div>
                </div>

                <div className="flex w-full gap-2 mt-1">
                    <Button
                        text="View on map"
                        className="flex-1"
                    />
                    <OutlineButton
                        text="Dismiss"
                    />
                </div>

                <motion.div
                    className="rounded-full bg-text-danger h-[5px]"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 10, ease: 'linear', repeat: Infinity }}
                />
            </div>
        </SlideIn>
    )
}
export default PushNotification