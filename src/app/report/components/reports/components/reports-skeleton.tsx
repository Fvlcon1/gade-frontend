const ReportItemSkeleton = () => {
    return (
        <div className="w-full mt-4 flex justify-center">
            <div className="w-[1024px] flex items-center gap-4 justify-between py-2 pl-3 pr-4 rounded-xl bg-bg-primary-lighter border-[1px] border-border-primary animate-pulse">
                <div className="flex flex-col gap-2 flex-1">
                    <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>

                <div className="h-8 w-20 bg-gray-200 rounded-full"></div>

                <div className="h-4 w-16 bg-gray-200 rounded"></div>

                <div className="h-5 w-5 bg-gray-200 rounded"></div>
            </div>
        </div>
    )
}

export default ReportItemSkeleton