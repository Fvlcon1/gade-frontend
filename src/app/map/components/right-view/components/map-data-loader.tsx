import { useSpatialStore } from "@/lib/store/spatial-store"

const MapDataLoader = () => {
    const { isLoading, error } = useSpatialStore()
    return (
        <>
            {isLoading && (
                <div className="bg-bg-secondary/50 backdrop-blur-sm p-3 border border-border-secondary rounded-lg shadow-xl z-[1002] flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-[var(--color-main-primary)] border-t-transparent" />
                </div>
            )}

            {error && (
                <div className="bg-bg-secondary/50 backdrop-blur-sm p-3 border border-border-secondary rounded-lg shadow-xl z-[1002] flex items-center gap-2">
                    <span className="text-sm text-red-500 font-medium">Could not load layers</span>
                </div>
            )}
        </>
    )
}
export default MapDataLoader