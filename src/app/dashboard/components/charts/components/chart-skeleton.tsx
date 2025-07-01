import React from 'react';
import theme from '@styles/theme';

const ChartSkeleton = () => {
    return (
        <div className="animate-pulse w-full px-2 py-2" style={{ height: '450px' }}>
            {/* Chart Title Skeleton */}
            <div className="h-6 w-1/4 rounded-md bg-gray-200 mb-4"></div>

            {/* Legend Skeleton */}
            <div className="flex justify-center gap-6 mb-6">
                {['Submitted', 'Approved', 'Flagged', 'Declined'].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                        <div className="h-4 w-16 rounded-md bg-gray-200"></div>
                    </div>
                ))}
            </div>

            {/* Chart Area Skeleton */}
            <div className="relative h-[350px] w-full border border-gray-200 rounded-lg p-4">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full w-8 flex flex-col justify-between pr-2">
                    {[0, 25, 50, 75, 100].map((val) => (
                        <div key={val} className="h-4 w-full rounded-md bg-gray-200"></div>
                    ))}
                </div>

                {/* Main chart area */}
                <div className="absolute left-8 right-0 top-0 h-full">
                    {/* Grid lines */}
                    <div className="relative h-full w-full">
                        {[0, 25, 50, 75, 100].map((val, i) => (
                            <div
                                key={i}
                                className="absolute left-0 right-0 h-px bg-gray-200"
                                style={{ top: `${val}%` }}
                            ></div>
                        ))}
                    </div>

                    {/* Bars - Simulating 12 months of data */}
                    <div className="absolute bottom-0 left-0 right-0 h-full flex items-end gap-1 px-8">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end gap-1">
                                {/* Stacked bars */}
                                <div className="h-1/4 bg-indigo-200 rounded-t-sm"></div>
                                <div className="h-1/3 bg-emerald-200 rounded-t-sm"></div>
                                <div className="h-1/5 bg-amber-200 rounded-t-sm"></div>
                                <div className="h-1/6 bg-red-200 rounded-t-sm"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* X-axis labels */}
                <div className="absolute left-8 right-0 bottom-0 h-8 flex justify-between px-8">
                    {['', '', '', '', '', '', '', '', '', '', '', ''].map((_, i) => (
                        <div key={i} className="h-4 w-6 rounded-md bg-gray-200"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChartSkeleton;