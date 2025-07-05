import Text from "@styles/components/text"
import theme from "@styles/theme"
import Input from "@components/ui/input/input"
import { useLeftPanelContext } from "@components/Layout/LeftPanel/context/context"
import { useState, useEffect } from "react"

const DefaultMapView = () => {
    const { settings, setSettings } = useLeftPanelContext()
    const defaultMapView = settings?.defaultMapview
    
    const [lat, setLat] = useState(defaultMapView?.lat || 0)
    const [lon, setLon] = useState(defaultMapView?.lon || 0)
    const [zoom, setZoom] = useState(defaultMapView?.zoom || 0)
    
    const handleDefaultMapViewChange = () => {
        setSettings({
            ...settings,
            defaultMapview: { lat, lon, zoom }
        })
    }

    useEffect(() => {
        handleDefaultMapViewChange()
    }, [lat, lon, zoom])
    
    return (
        <div className="flex flex-col w-full gap-1">
            <div className="flex flex-col">
                <Text>
                    Default Map View
                </Text>
            </div>
            <div className="flex items-center justify-between w-full gap-2">
                <div className="flex flex-col gap-1">
                    <Text textColor={theme.colors.text.tetiary} >Latitude</Text>
                    <Input
                        placeholder="Latitude"
                        value={lat}
                        type="number"
                        className="!w-[120px] !h-[35px]"
                        onChange={(e) => setLat(Number(e.target.value))}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Text textColor={theme.colors.text.tetiary} >Longitude</Text>
                    <Input
                        placeholder="Longitude"
                        value={lon}
                        type="number"
                        className="!w-[120px] !h-[35px]"
                        onChange={(e) => setLon(Number(e.target.value))}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Text textColor={theme.colors.text.tetiary} >Zoom</Text>
                    <Input
                        placeholder="Zoom"
                        value={zoom}
                        type="number"
                        className="!w-[120px] !h-[35px]"
                        onChange={(e) => setZoom(Number(e.target.value))}
                    />
                </div>
            </div>
        </div>
    )
}
export default DefaultMapView