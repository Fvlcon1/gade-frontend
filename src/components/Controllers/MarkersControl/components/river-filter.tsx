import { Slider } from "antd";
import { colors } from "../../../../app/styles/theme";
import Text from "@styles/components/text";
import theme from "@styles/theme";
import Input from "@components/ui/input/input";
import { useState } from "react";
import { useSpatialStore } from "@/lib/store/spatial-store";

const metersUnit = (
    <Text 
        bold={theme.text.bold.md}
        textColor={theme.colors.text.tetiary}
    >
        m
    </Text>
)

const RiverFilter = () => {
    const { setProximityFilters, minProximityToRiver, maxProximityToRiver, applyFilters } = useSpatialStore();

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value >= 0 && value <= maxProximityToRiver) {
            setProximityFilters({ minProximityToRiver: value });
            applyFilters();
        }
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value >= minProximityToRiver && value <= 5000) {
            setProximityFilters({ maxProximityToRiver: value });
            applyFilters();
        }
    };
    const handleSliderChange = (values: number[]) => {
        setProximityFilters({ minProximityToRiver: values[0], maxProximityToRiver: values[1] });
        applyFilters();
    };
    return (
        <div className="flex flex-col gap-0 px-3">
            <Text
                bold={theme.text.bold.md}
                className="pl-1"
            >
                Filter by distance to river
            </Text>

            <div className="w-full px-1">
                <Slider
                    range
                    min={0}
                    max={5000}
                    defaultValue={[minProximityToRiver, maxProximityToRiver]}
                    value={[minProximityToRiver, maxProximityToRiver]}
                    styles={{
                        handle: {
                            backgroundColor: colors.main.primary,
                        },
                        track: {
                            backgroundColor: colors.main.primary,
                        },
                        rail: {
                            backgroundColor: colors.bg.quantinary,
                        },
                    }}
                    onChange={handleSliderChange}
                />
            </div>
            <div className="w-full items-center flex gap-2">
                <Input 
                    placeholder="Min"
                    type="number"
                    value={minProximityToRiver}
                    onChange={handleMinChange}
                    PostIcon={metersUnit}
                    className="!h-[35px]"
                />
                <Input 
                    placeholder="Max"
                    type="number"
                    value={maxProximityToRiver}
                    onChange={handleMaxChange}
                    PostIcon={metersUnit}
                    className="!h-[35px]"
                />
            </div>
        </div>
    )
}
export default RiverFilter