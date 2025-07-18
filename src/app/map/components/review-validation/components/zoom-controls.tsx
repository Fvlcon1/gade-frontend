import { FaPlus, FaMinus } from "react-icons/fa6"
import { useTheme } from "@/app/styles/theme-context"
import { TbLocationFilled } from "react-icons/tb";
import useGeolocation from "@/hooks/use-geolocation";
import { useSpatialStore } from "@/lib/store/spatial-store";

const ZoomControls = ({
    zoomIn,
    zoomOut,
}: {
    zoomIn: () => void,
    zoomOut: () => void,
}) => {
    const { theme } = useTheme()
    const { getLocation } = useGeolocation()
    const {setBounds} = useSpatialStore()

    const handleLocationClick = async () => {
        try {
            const location = await getLocation()
            setBounds({
                type: "Feature",
                properties: {
                    name: "Location"
                },
                geometry: {
                    type: "Point",
                    coordinates: [location.lng, location.lat]
                }
            })
        } catch (error) {
            console.error("Error getting location:", error)
        }
    }

    return (
        <div className="absolute right-4 bottom-10 flex flex-col gap-4 z-[1000]">
            <div className="flex flex-col">
                <div
                    className="flex flex-col border-b-[1px] border-border-tetiary rounded-t-lg w-[40px] h-[40px] dark:bg-bg-secondary/80 bg-bg-primary/80 filter backdrop-blur-sm cursor-pointer items-center justify-center hover:bg-white/70 hover:dark:bg-white/20 duration-200"
                    onClick={zoomIn}
                >
                    <FaPlus
                        color={theme.colors.text.secondary}
                        size={15}
                    />
                </div>
                <div
                    className="flex flex-col rounded-b-lg w-[40px] h-[40px] dark:bg-bg-secondary/80 bg-bg-primary/80 filter backdrop-blur-sm cursor-pointer items-center justify-center hover:bg-white/70 hover:dark:bg-white/20 duration-200"
                    onClick={zoomOut}
                >
                    <FaMinus
                        color={theme.colors.text.secondary}
                        size={15}
                    />
                </div>
            </div>

            <div
                className="flex flex-col rounded-lg w-[40px] h-[40px] dark:bg-bg-secondary/80 bg-bg-primary/80 filter backdrop-blur-sm cursor-pointer items-center justify-center hover:bg-white/70 hover:dark:bg-white/20 duration-200"
                onClick={handleLocationClick}
            >
                <TbLocationFilled
                    color={theme.colors.text.secondary}
                    size={15}
                />
            </div>
        </div>
    )
}
export default ZoomControls