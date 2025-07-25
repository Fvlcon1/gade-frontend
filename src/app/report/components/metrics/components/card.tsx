import { hexOpacity } from "@/utils/hexOpacity"
import Text from "@styles/components/text"
import { useTheme } from "@styles/theme-context";
import { IMetricCard } from "@/app/accounts/utils/types"

const MetricCard = ({
    metric
} : {
    metric : IMetricCard
}) => {
    const { theme } = useTheme()
    
    return (
        <div 
            className="flex-1 rounded-xl flex flex-col gap-0 p-2 px-4 relative overflow-hidden border-[1px] border-border-primary"
            style={{
                backgroundColor : "#" + metric.color + hexOpacity(5),
                borderColor : "#" + metric.color + hexOpacity(10)
            }}
        >
            <div className="flex items-center gap-2">
                <Text
                    textColor={"#" + metric.color}
                >
                    {metric.title}
                </Text>
            </div>

            <Text
                size={"40px"}
                bold={theme.text.bold.md}
                textColor={"#" + metric.color}
                lineHeight={1}
            >
                {metric.value || 0}
            </Text>

            <div 
                className="absolute w-[100px] h-[100px] rounded-full top-[-40px] right-[-30px] flex items-center justify-center"
                style={{
                    backgroundColor : "#" + metric.color + hexOpacity(10)
                }}
            >
                <metric.icon
                    color={"#" + metric.color}
                    size={25}
                    className="absolute top-[50px] left-[25px]"
                />
            </div>
        </div>
    )
}

export default MetricCard