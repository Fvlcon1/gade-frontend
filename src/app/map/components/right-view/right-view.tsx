import ReviewValidation from "../right-nav/review-validation/review-validation"
import MiningSiteAttribute from "./components/mining-site-attribute"
import PriorityIndexHeatmap from "../right-nav/priority-index/priority-index-heatmap"
import ConcessionAttribute from "./components/concession-attribute"
import MapDataLoader from "./components/map-data-loader"

const RightView = () => {
    return (
        <div className="z-[1002] absolute top-3 right-[75px] pointer-events-auto flex gap-2">
            <MiningSiteAttribute />
            <ConcessionAttribute />
            <ReviewValidation />
            <PriorityIndexHeatmap />
            <MapDataLoader />
        </div>
    )
}
export default RightView