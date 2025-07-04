import NoData from "@components/ui/NoData/noData"
import { useReportsContext } from "../../context/report-context"
import ReportCard from "./components/report-card"
import ReportsSkeleton from "./components/reports-skeleton"

const Reports = () => {
    const {reportsData, reportsLoading, reportsIsFetching} = useReportsContext()

    if(reportsLoading) {
        return (
            <div className="flex flex-col gap-3">
                {
                    Array.from({ length: 3 }).map((_, index) => (
                        <ReportsSkeleton key={index} />
                    ))
                }
            </div>
        )
    }

    if(reportsData.length === 0) {
        return (
            <NoData />
        )
    }

    return (
        <div className={`flex ${reportsIsFetching ? "cursor-wait opacity-50" : ""} pt-5 justify-center w-full`}>
            <div className="flex flex-col gap-3">
                {
                    reportsData.map((report, index) => (
                        <ReportCard
                            key={index}
                            report={report}
                            reportsIsFetching={reportsIsFetching}
                        />
                    ))
                }
            </div>
        </div>
    )
}
export default Reports