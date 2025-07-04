import { hexOpacity } from "@/utils/hexOpacity"
import SlideIn from "@styles/components/slidein"
import theme from "@styles/theme"

const MetricCardsSkeleton = () => {
    const MetricCardSkeleton = () => {
        return (
            <div className="w-[300px] rounded-xl flex flex-col gap-1 p-4 relative overflow-hidden border-[1px] border-border-secondary bg-bg-primary-light">
                {/* Title and filter skeleton */}
                <div className="flex items-center gap-2">
                    <div className="h-4 w-3/4 rounded-md bg-gray-200 animate-pulse"></div>
                    <div className="h-4 w-16 rounded-lg bg-gray-200 animate-pulse"></div>
                </div>

                {/* Value skeleton */}
                <div className="h-6 w-1/2 rounded-md bg-gray-200 animate-pulse"></div>

                {/* Change indicator skeleton */}
                <div className="flex gap-2 items-center mt-2">
                    <div className="h-3 w-16 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="h-3 w-24 rounded-md bg-gray-200 animate-pulse"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex gap-4 px-4 pt-2">
            {[1, 2, 3, 4].map((_, index) => (
                <SlideIn
                    direction="left"
                    duration={0.5}
                    delay={index * 0.1}
                    key={index}
                >
                    <MetricCardSkeleton />
                </SlideIn>
            ))}
        </div>
    )
}

export default MetricCardsSkeleton