import React from 'react';
import theme from '@styles/theme';
import SlideIn from '@styles/components/slidein';

const ClaimsTimelineChartSkeleton = () => {
    return (
        <SlideIn direction="bottom" className="flex flex-1 rounded-xl border-[1px] border-border-secondary">
            <div className="w-full h-full flex flex-col gap-4 p-4 pr-0">
                {/* Header skeleton */}
                <div className="flex flex-col gap-2">
                    <div className="h-6 w-1/3 rounded-md bg-gray-200 animate-pulse"></div>
                    <div className="h-4 w-2/3 rounded-md bg-gray-200 animate-pulse"></div>
                </div>

                {/* Chart skeleton */}
                <div className="relative h-[450px] w-full ml-[-10px] mt-[-10px]">
                    {/* Y-axis */}
                    <div className="absolute left-2 top-0 h-full w-8 flex flex-col justify-between pr-2">
                        {[0, 1, 2, 3].map((_, i) => (
                            <div key={i} className="h-4 w-full rounded-md bg-gray-200 animate-pulse"></div>
                        ))}
                    </div>

                    {/* Main chart area */}
                    <div className="absolute left-8 right-0 top-0 h-full">
                        {/* Grid lines */}
                        <div className="relative h-full w-full">
                            {[0, 1, 2, 3].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute left-0 right-0 h-px bg-gray-200"
                                    style={{ top: `${25 + (i * 25)}%` }}
                                ></div>
                            ))}
                        </div>

                        {/* Chart content */}
                        <div className="relative h-full w-full overflow-hidden">
                            {/* Simulated chart lines */}
                            <div className="absolute bottom-0 left-0 right-0 h-3/4">
                                <div className="absolute bottom-0 w-full h-1/3 bg-gray-200 opacity-30 rounded-t-lg"></div>
                                <div className="absolute bottom-0 w-full h-2/3 bg-gray-200 opacity-20 rounded-t-lg"></div>
                            </div>
                        </div>
                    </div>

                    {/* X-axis */}
                    <div className="absolute left-8 right-0 bottom-0 h-6 flex justify-between px-4">
                        {['', '', '', '', '', ''].map((_, i) => (
                            <div key={i} className="h-4 w-8 rounded-md bg-gray-200 animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        </SlideIn>

    );
};

export default ClaimsTimelineChartSkeleton;