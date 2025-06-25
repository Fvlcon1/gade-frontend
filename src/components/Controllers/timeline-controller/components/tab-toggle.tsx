
import Text from "@styles/components/text";
import theme from "@styles/theme";

interface TabToggleProps {
    activeTab: string;
    handleTabChange: (tab: string) => void;
}

const TabToggle = ({ activeTab, handleTabChange }: TabToggleProps) => {
    return (
        <div className="flex">
            <div
                onClick={() => handleTabChange('timeline')}
                className={`flex flex-1 justify-center items-center cursor-pointer ${activeTab === 'timeline' ? 'bg-main-primary' : 'bg-bg-primary/80 hover:bg-bg-primary/60'} backdrop-blur-lg shadow-xl border-r-[1px] border-text-secondary/20 rounded-l-lg px-3 py-2`}>
                <Text
                    textColor={activeTab === 'timeline' ? theme.colors.bg.primary : theme.colors.text.secondary}
                    bold={activeTab === 'timeline' ? theme.text.bold.md : theme.text.bold.sm2}
                >
                    Timeline
                </Text>
            </div>
            <div
                onClick={() => handleTabChange('comparison')}
                className={`flex flex-1 justify-center items-center cursor-pointer ${activeTab === 'comparison' ? 'bg-main-primary' : 'bg-bg-primary/80 hover:bg-bg-primary/60'} backdrop-blur-lg shadow-xl rounded-r-lg px-3 py-2`}>
                <Text
                    textColor={activeTab === 'comparison' ? theme.colors.bg.primary : theme.colors.text.secondary}
                    bold={activeTab === 'comparison' ? theme.text.bold.md : theme.text.bold.sm2}
                >
                    Comparison
                </Text>
            </div>
        </div>
    )
}
export default TabToggle