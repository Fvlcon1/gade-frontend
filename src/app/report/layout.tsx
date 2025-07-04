import { ReportsContextProvider } from "./context/report-context";

const ReportLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <ReportsContextProvider>
            {children}
        </ReportsContextProvider>
    )
}
export default ReportLayout