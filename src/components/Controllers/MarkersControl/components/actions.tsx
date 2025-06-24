import Button from "@components/ui/button/button"
import OutlineButton from "@components/ui/button/outlineButton"
import { GiMagicBroom } from "react-icons/gi"

const Actions = ({
    handleReset,
    handleApply
}: {
    handleReset: () => void;
    handleApply: () => void;
}) => {
    return (
        <div className="flex items-center gap-2 w-full px-3">
            <OutlineButton 
                text="Reset all"
                icon={<GiMagicBroom size={16} />}
                className="flex-1"
                onClick={handleReset}
            />
            {/* <Button
                text="Apply Filters"
                className="flex-1"
                onClick={handleApply}
            /> */}
        </div>
    )
}
export default Actions