import SatelliteSpinner from "@components/ui/loaders/satellite-spinner"

const Loading = () => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <SatelliteSpinner />
        </div>
    )
}
export default Loading