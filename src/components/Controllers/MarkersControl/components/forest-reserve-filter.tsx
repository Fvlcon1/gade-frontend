import { Slider } from "antd";
import Text from "@styles/components/text";
import theme from "@styles/theme";
import Input from "@components/ui/input/input";
import { useSpatialStore } from "@/lib/store/spatial-store";

const metersUnit = (
    <Text 
        bold={theme.text.bold.md}
        textColor={theme.colors.text.tetiary}
    >
        m
    </Text>
)

const ForestReserveFilter = () => {
    const { setProximityFilters, minProximityToForestReserve, maxProximityToForestReserve, applyFilters } = useSpatialStore();

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value >= 0 && value <= maxProximityToForestReserve) {
            setProximityFilters({ minProximityToForestReserve: value });
            applyFilters();
        }
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value >= minProximityToForestReserve && value <= 5000) {
            setProximityFilters({ maxProximityToForestReserve: value });
            applyFilters();
        }
    };
    const handleSliderChange = (values: number[]) => {
        setProximityFilters({ minProximityToForestReserve: values[0], maxProximityToForestReserve: values[1] });
        applyFilters();
    };
    return (
        <div className="flex flex-col gap-0 px-3">
            <Text
                bold={theme.text.bold.md}
                className="pl-1"
            >
                Filter by distance to forest reserve
            </Text>

            <div className="w-full px-1">
                <Slider
                    range
                    min={0}
                    max={5000}
                    defaultValue={[minProximityToForestReserve, maxProximityToForestReserve]}
                    value={[minProximityToForestReserve, maxProximityToForestReserve]}
                    styles={{
                        handle: {
                            backgroundColor: theme.colors.main.primary,
                        },
                        track: {
                            backgroundColor: theme.colors.main.primary,
                        },
                        rail: {
                            backgroundColor: theme.colors.bg.quantinary,
                        },
                    }}
                    onChange={handleSliderChange}
                />
            </div>
            <div className="w-full items-center flex gap-2">
                <Input 
                    placeholder="Min"
                    type="number"
                    value={minProximityToForestReserve}
                    onChange={handleMinChange}
                    PostIcon={metersUnit}
                    className="!h-[35px]"
                />
                <Input 
                    placeholder="Max"
                    type="number"
                    value={maxProximityToForestReserve}
                    onChange={handleMaxChange}
                    PostIcon={metersUnit}
                    className="!h-[35px]"
                />
            </div>
        </div>
    )
}
export default ForestReserveFilter