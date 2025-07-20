import ReviewValidation from "../review-validation/review-validation"
import MiningSiteAttribute from "./components/mining-site-attribute"

const RightView = () => {
    return (
        <div className="z-[1002] absolute top-3 right-[75px] pointer-events-auto flex gap-2">
            <MiningSiteAttribute />
            <ReviewValidation />
        </div>
    )
}
export default RightView