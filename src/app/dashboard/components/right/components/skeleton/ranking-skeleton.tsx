const MAX_WIDTH = 100;
const MIN_WIDTH = 60;
const getWidthFromRank = (index: number, total: number) => {
    if (total === 1) return `${MAX_WIDTH}%`;
    const step = (MAX_WIDTH - MIN_WIDTH) / (total - 1);
    return `${MAX_WIDTH - index * step}%`;
};

const RankingSkeleton = () => {
    // Show 5 skeleton items (typical number for rankings)
    const skeletonItems = Array(5).fill(null);

    return (
        <div className="flex flex-col gap-3">
            {/* Rankings List skeleton */}
            <div className="flex flex-col gap-2">
                {skeletonItems.map((_, index) => {
                    const width = getWidthFromRank(index, skeletonItems.length);

                    return (
                        <div
                            key={`skeleton-${index}`}
                            className="flex items-center justify-between rounded-full pl-4 pr-1.5 py-1.5 bg-gray-200 animate-pulse transition-all duration-300 gap-2"
                            style={{ width }}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div className="h-5 w-5 bg-gray-300 rounded-full" />
                                <div className="h-5 w-[100px] bg-gray-300 rounded" />
                            </div>
                            <div className="bg-gray-300 px-4 py-1 rounded-full">
                                <div className="h-5 w-[40px] bg-gray-400 rounded" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RankingSkeleton
