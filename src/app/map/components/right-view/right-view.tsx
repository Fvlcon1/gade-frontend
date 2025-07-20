import ReviewValidation from "../right-nav/review-validation/review-validation"
import MiningSiteAttribute from "./components/mining-site-attribute"
import PriorityIndexHeatmap from "../right-nav/priority-index/priority-index-heatmap"

const RightView = () => {
    return (
        <div className="z-[1002] absolute top-3 right-[75px] pointer-events-auto flex gap-2">
            <MiningSiteAttribute />
            <ReviewValidation />
            <PriorityIndexHeatmap />
        </div>
    )
}
export default RightView