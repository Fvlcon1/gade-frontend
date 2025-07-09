import Text from "@styles/components/text"
import theme from "@styles/theme"
import { useReviewContext } from "../context/review-context"
import Input from "@components/ui/input/input"
import { useSpatialStore } from "@/lib/store/spatial-store"
import { IoSearch } from "react-icons/io5"
import Divider from "@components/ui/divider/divider"

const Chip = ({
    value,
    isSelected,
    onClick
}) => {
    return (
        <div 
            className={`flex items-center gap-2 cursor-pointer duration-300 rounded-full border-[1px] ${isSelected ? "border-main-primary bg-main-primary/10" : "border-border-primary hover:bg-bg-tetiary"} px-2 py-1`}
            onClick={()=>onClick?.()}
        >
            <Text
                textColor={isSelected ? theme.colors.main.primary : theme.colors.text.secondary}
                bold={isSelected ? theme.text.bold.md2 : theme.text.bold.sm2}
            >
                {isSelected ? `✓ ${value}` : value}
            </Text>
        </div>
    )
}

const Filter = () => {
    const { severities, selectedSeverity, setSelectedSeverity } = useReviewContext()
    const {reviewValidationSearchValue, setReviewValidationSearchValue, applyFilters} = useSpatialStore()
    return (
        <div className="flex flex-col gap-2 px-4">
            {/* <Input 
                placeholder="Search"
                value={reviewValidationSearchValue}
                PreIcon={<IoSearch color={theme.colors.text.tetiary} />}
                onChange={(e) => {
                    setReviewValidationSearchValue(e.target.value)
                    applyFilters()
                }}
                className="!h-[35px] !px-2"
            /> */}
            <div className="flex gap-2">
                {
                    severities.map((severity, index) => {
                        return (
                            <Chip
                                key={index}
                                value={severity}
                                isSelected={selectedSeverity === severity}
                                onClick={() => setSelectedSeverity(severity)}
                            />
                        )
                    })
                }
            </div>
            <Divider className="my-2" />
        </div>
    )
}
export default Filter