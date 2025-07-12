'use client'

import Container from "@components/ui/container/container"
import Overlay from "@components/ui/overlay/overlay"
import Text from "@styles/components/text"
import theme from "@styles/theme"
import { TiWarning } from "react-icons/ti"
import { AnimatePresence } from "framer-motion"
import Button from "@components/ui/button/button"
import OutlineButton from "@components/ui/button/outlineButton"
import { hexOpacity } from "@/utils/hexOpacity"
import { useEffect } from "react"

type ConfirmationModalProps = {
    isVisible: boolean;
    close: () => void;
    description?: string;
    children?: React.ReactNode;
    onConfirm: () => void;
    cta?: string;
    loading?: boolean | (() => boolean);
    title?: string;
    icon?: React.ReactNode;
    color?: string;
};

const ConfirmationModal = ({
    isVisible,
    close,
    description,
    children,
    onConfirm,
    cta,
    loading,
    title,
    icon,
    color,
}: ConfirmationModalProps) => {
    const handleConfirm = () => {
        onConfirm()
    }
    
    return (
        <AnimatePresence>
            {
                isVisible && (
                    <Overlay
                        onClick={close}
                        key={1}
                    >
                        <Container
                            isVisible={isVisible}
                            close={close}
                        >
                            <div className="w-full flex flex-col rounded-xl">

                                {/* Head */}
                                <div 
                                    className="bg-red-50 border-b-[1px] rounded-t-2xl border-border-primary p-2 py-4 flex flex-col gap-1 items-center"
                                    style={{
                                        backgroundColor: color ? color + hexOpacity(10) : theme.colors.main.primary + hexOpacity(10)
                                    }}
                                >
                                    <div 
                                        className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-red-400"
                                        style={{
                                            backgroundColor: color ?? theme.colors.main.primary
                                        }}
                                    >
                                        {icon ?? <TiWarning color={theme.colors.bg.primary} size={20} />}
                                    </div>
                                    <Text
                                        size={theme.text.size.HM}
                                        bold={theme.text.bold.md}
                                    >
                                        {title ?? "Are you Sure?"}
                                    </Text>
                                </div>

                                {/* Body */}
                                <div className="w-full flex flex-col px-4 py-4">
                                    {
                                        description && (
                                            <Text
                                                size={theme.text.size.body2}
                                            >
                                                {description}
                                            </Text>
                                        )
                                    }
                                    {children}
                                </div>

                                {/* Footer */}
                                <div className="w-full flex justify-center items-center gap-2 pb-4 px-4">
                                    <OutlineButton
                                        onClick={close}
                                        text="Cancel"
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={handleConfirm}
                                        text={cta ?? "Continue"}
                                        loading={typeof loading === 'function' ? loading() : loading}
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        </Container>
                    </Overlay>
                )
            }
        </AnimatePresence>
    )
}
export default ConfirmationModal