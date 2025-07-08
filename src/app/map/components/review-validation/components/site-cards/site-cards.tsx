import { useMemo, useState } from "react"
import Card from "./card"
import { useSpatialStore } from "@/lib/store/spatial-store"
import { useReviewContext } from "../../context/review-context"
import { SpatialData } from "@/lib/store/spatial-store"

const SiteCards = ({
    updateCard,
    setUpdateCard,
    mapRef
}) => {
    const [expandedCard, setExpandedCard] = useState<number | null>(null)
    const [selectedSite, setSelectedSite] = useState<SpatialData["features"][number] | null>(null)
    const {filteredMiningSites} = useSpatialStore()
    const { order, setOrder, selectedSeverity } = useReviewContext();
    const localfilteredSites = filteredMiningSites?.features.length ? [...filteredMiningSites?.features] : []

    if(localfilteredSites)
        localfilteredSites.length = 40

    const sortSites = (sites: SpatialData["features"]) => {
        if(order === "Newest")
            return sites?.sort((a, b) => new Date(b.properties.detected_date).getTime() - new Date(a.properties.detected_date).getTime())
        if(order === "Oldest")
            return sites?.sort((a, b) => new Date(a.properties.detected_date).getTime() - new Date(b.properties.detected_date).getTime())
        return sites
    }
    const filteredSites = useMemo(()=>{
        let sites = sortSites(localfilteredSites)
        if(selectedSeverity != "All")
            sites = sites?.filter((site) => site.properties.severity?.toLowerCase() === selectedSeverity.toLowerCase())
        return sites
    }, [order, selectedSeverity, localfilteredSites])

    return (
        <>
            <div className="flex flex-col gap-4 px-4">
                {
                    filteredSites?.map((siteFeature, index) => (
                        <Card 
                            key={index} 
                            setExpandedCard={setExpandedCard} 
                            setUpdateCard={setUpdateCard}
                            isExpanded={expandedCard === index} 
                            index={index}
                            feature={siteFeature}
                            mapRef={mapRef}
                            isSelected={selectedSite === siteFeature}
                        />
                    ))
                }
            </div>
        </>
    )
}
export default SiteCards