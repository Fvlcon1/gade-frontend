'use client'

import Text from "@styles/components/text"
import theme from "@styles/theme"
import SlideIn from "@styles/components/slidein"

const TableSkeleton = () => {
    const tableHeads = ["Hospital Name", "Date", "Patient Name", "Diagnosis", "Drugs", "Status", "Expected Payout", "Actual Payout"]
    const skeletonRows = 10; // Number of skeleton rows to display
    
    return (
        <SlideIn
            direction="bottom"
            delay={0.3}
            className="w-full px-4"
        >
            <div className="flex flex-col w-full rounded-xl border-[1px] border-border-secondary animate-pulse">
                {/* Header Skeleton */}
                <div className="flex w-full justify-between border-b-[1px] border-bg-tetiary h-[45px] items-center px-4 rounded-t-xl">
                    <div className="h-6 w-32 rounded-md bg-gray-200"></div>
                    <div className="h-6 w-20 rounded-md bg-gray-200"></div>
                </div>

                {/* Table Skeleton */}
                <div className="w-full overflow-x-hidden">
                    <table className="w-full">
                        <thead>
                            <tr>
                                {tableHeads.map((_, index) => (
                                    <th
                                        key={index}
                                        className={`text-left px-4 py-4 border-b-[1px] bg-bg-primary-light border-border-secondary min-w-[200px] 
                                            ${index === 0 ? 'sticky left-0' : ''}`}
                                    >
                                        <div className="h-5 w-24 rounded-md bg-gray-200"></div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="text-left border-b-[1px] border-border-secondary"
                                >
                                    {tableHeads.map((_, cellIndex) => (
                                        <td 
                                            key={cellIndex}
                                            className={`px-4 py-4 border-b-[1px] border-border-secondary min-w-[200px]
                                                ${cellIndex === 0 ? 'sticky left-0 bg-bg-primary' : ''}`}
                                        >
                                            {cellIndex === 5 ? ( // Status cell
                                                <div className="flex px-4 py-1 rounded-full w-fit bg-gray-200">
                                                    <div className="h-5 w-16 rounded-md bg-gray-300"></div>
                                                </div>
                                            ) : (
                                                <div className="h-5 rounded-md bg-gray-200" 
                                                     style={{ width: `70%` }}></div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </SlideIn>
    )
}

export default TableSkeleton