import Card from "./components/card"
import RecentActivity from "./components/recent-activity"
import Ranking from "./components/ranking"

const Divider = () => {
    return (
        <div className="w-full pl-3">
            <div className="w-full h-0.25 bg-border-primary" />
        </div>
    )
}

const Right = () => {
    return (
        <div className="fixed right-0 top-0 py-4 flex flex-col gap-6 h-full w-[380px] border-l-[1px] border-border-primary bg-bg-primary-lighter">
            <div className="w-full px-4">
                <Card />
            </div>
            <Divider />
            <RecentActivity />
            <Divider />
            <Ranking />
        </div>
    )
}
export default Right