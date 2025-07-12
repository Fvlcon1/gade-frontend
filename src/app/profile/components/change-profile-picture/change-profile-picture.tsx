'use client'

import { AnimatePresence } from "framer-motion"
import Overlay from "@components/ui/overlay/overlay"
import Container from "@components/ui/container/container"
import Text from "@styles/components/text"
import { useTheme } from "@styles/theme-context"
import { theme } from "antd"
import { useState, useEffect } from "react"
import { FaCloudUploadAlt } from "react-icons/fa"
import Button from "@components/ui/button/button"
import { MdFileUpload } from "react-icons/md"
import Upload from "./components/upload"
import EditImage from "./components/edit"
import Success from "./components/success"

const ChangeProfilePicture = ({
    isVisible,
    close
}: {
    isVisible: boolean;
    close: () => void;
}) => {
    const { theme } = useTheme();
    const [activeStep, setActiveStep] = useState(0)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleNext = () => {
        setActiveStep(prev => prev + 1)
    }

    const handleBack = () => {
        setActiveStep(prev => prev - 1)
    }

    useEffect(() => {
        setSelectedFile(null)
        setActiveStep(0)
    }, [isVisible])

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
                            className="!w-[500px] !border-[1px] !border-border-primary"
                        >
                            <div className="w-full h-full flex flex-col gap-4 px-4 py-10 items-center">
                                <div className="flex flex-col gap-1.5 items-center">
                                    <Text
                                        size={theme.text.size.HM2}
                                        bold={theme.text.bold.md2}
                                    >
                                        Change profile picture
                                    </Text>
                                    <Text>
                                        Please choose a photo that represents you best
                                    </Text>
                                </div>

                                <div className="flex items-center gap-2">
                                    {
                                        [1, 2, 3].map((index: number) => {
                                            return (
                                                <>
                                                    <div key={index} className={`h-3 w-3 rounded-full ${activeStep === 2 ? "bg-[#32ba50]" : activeStep >= index - 1 ? "bg-main-primary" : "bg-bg-tetiary"}`} />
                                                    {
                                                        index <= 2 ? (
                                                            <div key={`divider-${index}`} className={`w-[50px] h-[1px] ${activeStep === 2 ? "bg-[#32ba50]" : activeStep >= index ? "bg-main-primary" : "bg-bg-tetiary"}`} />
                                                        ) : null

                                                    }
                                                </>
                                            )
                                        })
                                    }
                                </div>

                                {
                                    activeStep === 0 ? (
                                        <Upload 
                                            selectedFile={selectedFile}
                                            setSelectedFile={setSelectedFile}
                                            handleNext={handleNext}
                                        />
                                    ) : activeStep === 1 ? (
                                        <EditImage
                                            imageSrc={selectedFile ? URL.createObjectURL(selectedFile) : ""}
                                            onSave={handleNext}
                                        />
                                    ) : activeStep === 2 ? (
                                        <Success
                                            onContinue={close}
                                        />
                                    ) : null
                                }
                            </div>
                        </Container>
                    </Overlay>
                )
            }
        </AnimatePresence>
    )
}
export default ChangeProfilePicture