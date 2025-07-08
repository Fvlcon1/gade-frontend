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
import { Status } from "./utils/types"

const statusMapping: Record<string, Status> = {
    "OPEN": "Open",
    "IN_REVIEW": "In Review",
    "FALSE_POSITIVE": "False Positive",
    "CLOSED": "Closed"
}
const ReviewValidation = ({
    mapRef
} : {
    mapRef: React.RefObject<any>;
}) => {
    const [updateCard, setUpdateCard] = useState<SpatialData["features"][number] | null>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    return (
        <>
            <UpdateStatusModal
                isVisible={updateCard != null}
                close={() => setUpdateCard(null)}
                currentStatus={statusMapping[updateCard?.properties.status as string]}
                id={updateCard?.properties.id}
            />
            <SlideIn
                className="z-[1002] absolute top-4 right-[60px]"
            >
                <BlurContainer
                    className="!bg-primary/0"
                >
                    {/* Add a ref to the scrollable panel */}
                    <div
                        ref={panelRef}
                        className="w-[350px] relative overflow-auto h-[900px] gap-4 pb-4 flex flex-col rounded-2xl"
                    >
                        <TopSection />
                        <Filter />
                        <SiteCards
                            updateCard={updateCard}
                            setUpdateCard={setUpdateCard}
                            mapRef={mapRef}
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
        </>
    )
}
export default ReviewValidation