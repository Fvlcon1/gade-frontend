
import Text from "@styles/components/text";
import theme from "@styles/theme";
import { ComparisonView } from "../../utils/types";

interface TabToggleProps {
    activeTab: ComparisonView;
    handleTabChange: (tab: ComparisonView) => void;
}

const TabToggle = ({ activeTab, handleTabChange }: TabToggleProps) => {
    return (
        <div className="flex">
            <div
                onClick={() => handleTabChange('slider')}
                className={`flex flex-1 justify-center items-center cursor-pointer ${activeTab === 'slider' ? 'bg-main-primary' : 'bg-bg-primary/80 hover:bg-bg-primary/60'} backdrop-blur-lg rounded-l-lg px-3 py-2.5`}>
                <Text
                    textColor={activeTab === 'slider' ? theme.colors.bg.primary : theme.colors.text.secondary}
                    bold={activeTab === 'slider' ? theme.text.bold.md : theme.text.bold.sm2}
                >
                    Slider
                </Text>
            </div>
            <div
                onClick={() => handleTabChange('side-by-side')}
                className={`flex flex-1 justify-center items-center cursor-pointer ${activeTab === 'side-by-side' ? 'bg-main-primary' : 'bg-bg-primary/80 hover:bg-bg-primary/60'} backdrop-blur-lg rounded-r-lg px-3 py-2.5`}>
                <Text
                    textColor={activeTab === 'side-by-side' ? theme.colors.bg.primary : theme.colors.text.secondary}
                    bold={activeTab === 'side-by-side' ? theme.text.bold.md : theme.text.bold.sm2}
                >
                    Side by Side
                </Text>
            </div>
        </div>
    )
}
export default TabToggle