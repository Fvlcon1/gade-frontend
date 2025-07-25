import { AnimatePresence } from "framer-motion"
import Overlay from "@components/ui/overlay/overlay"
import Text from "@styles/components/text"
import { RiFilePaper2Line } from "react-icons/ri"
import Container from "@components/ui/container/container"
import { ReactNode, useState } from "react"
import { useTheme } from "@styles/theme-context"
import Button from "@components/ui/button/button"
import { HiDownload } from "react-icons/hi"
import OutlineButton from "@components/ui/button/outlineButton"

interface Modal1Props {
    isVisible?: boolean
    close?: () => void
    title?: string
    description?: string
    icon?: ReactNode
    children?: ReactNode
    ctaText?: string
    ctaAction?: () => void
    showDefaultActions?: boolean
}

const Header = ({
    title,
    description,
    icon
}: {
    title?: string
    description?: string
    icon?: ReactNode
}) => {
    const { theme } = useTheme()

    return (
        <div className="w-full flex flex-col gap-1.5 items-center">
            <div className="bg-main-primary/30 rounded-full p-2">
                <div className="bg-main-primary rounded-full p-2 shadow-lg shadow-main-primary/50">
                    {icon ?? <RiFilePaper2Line color="white" size={20} />}
                </div>
            </div>
            <Text
                size={theme.text.size.HM}
                bold={theme.text.bold.md2}
                textColor={theme.colors.main.primary}
            >
                {title}
            </Text>
            <Text textColor={theme.colors.text.tetiary}>
                {description}
            </Text>
        </div>
    )
}

const Actions = ({
    close,
    ctaText,
    ctaAction
}: {
    close?: () => void
    ctaText?: string
    ctaAction?: () => void
}) => {
    return (
        <div className="w-full flex justify-end gap-2">
            <Button
                text={ctaText}
                onClick={ctaAction}
                className="flex-1"
            />
            <OutlineButton
                text="Cancel"
                onClick={close}
                className="flex-1"
            />
        </div>
    )
}

const Modal1 = ({ 
    isVisible = true, 
    close,
    showDefaultActions = true,
    children,
    title,
    description,
    icon,
    ctaText,
    ctaAction
 }: Modal1Props) => {
    const { theme } = useTheme()

    return (
        <AnimatePresence>
            {
                isVisible && (
                    <Overlay key={1} onClick={close}>
                        <Container
                            isVisible={isVisible}
                            close={close}
                            className="border-[1px] border-border-primary"
                        >
                            <div className="w-[400px] flex flex-col rounded-xl py-6 px-6 gap-3">
                                <Header title={title} description={description} icon={icon}/>
                                {children}
                                {showDefaultActions && <Actions close={close} ctaText={ctaText} ctaAction={ctaAction} />}
                            </div>
                        </Container>
                    </Overlay>
                )
            }
        </AnimatePresence>
    )
}

export default Modal1
