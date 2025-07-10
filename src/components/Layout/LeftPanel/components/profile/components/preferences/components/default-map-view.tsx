import Text from "@styles/components/text"
import theme from "@styles/theme"
import Input from "@components/ui/input/input"
import { useSettingsContext } from "@/app/context/settings-context"
import { useState, useEffect } from "react"

const DefaultMapView = () => {
    const { settings, saveSettings, storeSettings } = useSettingsContext()
    const defaultMapView = settings?.defaultMapview;

    const [lat, setLat] = useState(defaultMapView?.lat || 0);
    const [lon, setLon] = useState(defaultMapView?.lon || 0);
    const [zoom, setZoom] = useState(defaultMapView?.zoom || 0);

    // Sync local state with context/settings changes
    useEffect(() => {
        setLat(defaultMapView?.lat || 0);
        setLon(defaultMapView?.lon || 0);
        setZoom(defaultMapView?.zoom || 0);
    }, [defaultMapView]);

    // Debounced save: only if values changed from settings
    useEffect(() => {
        if (
            lat === (defaultMapView?.lat || 0) &&
            lon === (defaultMapView?.lon || 0) &&
            zoom === (defaultMapView?.zoom || 0)
        ) {
            return; // Don't save if nothing changed
        }
        const handler = setTimeout(() => {
            const newSettings = {
                ...settings,
                defaultMapview: { lat, lon, zoom },
            };
            storeSettings(newSettings);
            saveSettings(newSettings);
        }, 600);
        return () => clearTimeout(handler);
    }, [lat, lon, zoom, defaultMapView, settings]);
    
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