import Text from "@styles/components/text"
import theme from "@styles/theme"
import { useReviewContext } from "../context/review-context"

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
    return (
        <div className="flex gap-2 px-4">
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
    )
}
export default Filter