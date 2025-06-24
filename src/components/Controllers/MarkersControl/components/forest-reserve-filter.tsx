import { Slider } from "antd";
import { colors } from "../../../../app/styles/theme";
import Text from "@styles/components/text";
import theme from "@styles/theme";
import Input from "@components/ui/input/input";
import { useState } from "react";

const metersUnit = (
    <Text 
        bold={theme.text.bold.md}
        textColor={theme.colors.text.tetiary}
    >
        m
    </Text>
)

const ForestReserveFilter = () => {
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(200);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value >= 0 && value <= max) {
            setMin(value);
        }
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value >= min && value <= 500) {
            setMax(value);
        }
    };
    const handleSliderChange = (values: number[]) => {
        setMin(values[0]);
        setMax(values[1]);
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
                    max={500}
                    defaultValue={[min, max]}
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
                    value={min}
                    onChange={handleMinChange}
                    PostIcon={metersUnit}
                    className="!h-[35px]"
                />
                <Input 
                    placeholder="Max"
                    type="number"
                    value={max}
                    onChange={handleMaxChange}
                    PostIcon={metersUnit}
                    className="!h-[35px]"
                />
            </div>
        </div>
    )
}
export default ForestReserveFilter