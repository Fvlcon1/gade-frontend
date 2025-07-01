const MetricSkeleton = () => {
    return (
        <div className="relative flex flex-col gap-3 bg-bg-primary-lighter rounded-2xl border-[1px] border-border-primary p-2 w-[270px] h-[100px] overflow-hidden">
            {/* Header skeleton */}
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-sm bg-gray-200 animate-pulse" />
                <div className="h-4 w-[100px] bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Body skeleton */}
            <div className="h-10 w-[150px] bg-gray-200 rounded animate-pulse" />

            {/* Footer skeleton */}
            <div className="h-6 w-[120px] bg-gray-200 rounded-lg animate-pulse" />

            {/* Icon skeleton */}
            <div className="absolute top-1/5 right-4 w-[60px] h-[60px] rounded-full bg-gray-200 opacity-10 animate-pulse" />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
        </div>
    )
}

export default MetricSkeleton