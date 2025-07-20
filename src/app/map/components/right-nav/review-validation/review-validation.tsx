import BlurContainer from "@components/ui/blur-container"
import SlideIn from "@styles/components/slidein"
import TopSection from "./components/top-section"
import SiteCards from "./components/site-cards/site-cards"
import UpdateStatusModal from "./components/update-status-modal"
import { useState } from "react"
import { FloatButton } from "antd"

import { useRef } from "react"
import Filter from "./components/filter"
import { SpatialData } from "@/lib/store/spatial-store"
import { reverseStatusMapping } from "./utils/constants"
import { AnimatePresence } from "framer-motion"
import { useSpatialStore } from "@/lib/store/spatial-store"

const ReviewValidation = () => {
    const [updateCard, setUpdateCard] = useState<SpatialData["features"][number] | null>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const { activeRightNav } = useSpatialStore()
    return (
        <>
            <UpdateStatusModal
                isVisible={updateCard != null}
                close={() => setUpdateCard(null)}
                currentStatus={reverseStatusMapping[updateCard?.properties.status as string]}
                id={updateCard?.properties.id}
            />

            <AnimatePresence>
                {
                    activeRightNav === "Review and Validation" ? (
                        <SlideIn
                            className=""
                            direction="right"
                        >
                            <BlurContainer
                                className="!bg-primary/0"
                            >
                                {/* Add a ref to the scrollable panel */}
                                <div
                                    ref={panelRef}
                                    className="w-[350px] relative overflow-auto h-[calc(100vh-70px)] gap-3 pb-4 flex flex-col rounded-2xl"
                                >
                                    <TopSection />
                                    <Filter />
                                    <SiteCards
                                        updateCard={updateCard}
                                        setUpdateCard={setUpdateCard}
                                    />
                                    {/* FloatButton.BackTop will now scroll the panel, not the window */}
                                    <FloatButton.BackTop
                                        visibilityHeight={50}
                                        target={() => panelRef.current}
                                    />
                                    <div className="fixed rounded-b-2xl pointer-events-none bottom-0 w-full bg-gradient-to-t from-bg-primary to-transparent h-[200px]" />
                                </div>
                            </BlurContainer>
                        </SlideIn>
                    ) : null
                }
            </AnimatePresence>
        </>
    )
}
export default ReviewValidation