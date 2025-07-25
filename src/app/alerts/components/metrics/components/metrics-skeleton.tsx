import SlideIn from "@styles/components/slidein"

const MetricCardSkeleton = () => {
    return (
        <div className="w-full flex justify-center">
            <div className="w-[1024px] py-3 flex items-center gap-2">
                {[1, 2, 3, 4].map((_, index) => (
                    <SlideIn
                        direction="left"
                        duration={0.5}
                        delay={index * 0.1}
                        key={index}
                    >
                        <div className="w-[250px] rounded-xl flex flex-col gap-0 p-2 px-4 relative overflow-hidden border-[1px] border-border-secondary bg-bg-primary-light">
                            <div className="flex items-center gap-2">
                                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                            </div>

                            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse my-2"></div>

                            <div className="absolute w-[100px] h-[100px] rounded-full top-[-40px] right-[-30px] flex items-center justify-center bg-gray-200 animate-pulse">
                                <div className="absolute top-[50px] left-[25px] h-6 w-6 bg-gray-300 rounded-full"></div>
                            </div>
                        </div>
                    </SlideIn>
                ))}
            </div>
        </div>
    )
}

export default MetricCardSkeleton