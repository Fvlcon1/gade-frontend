'use client'

import theme from "@styles/theme";
import Text from "@styles/components/text";
import { AiFillAlert } from "react-icons/ai";
import { useDashboardContext } from "@/app/dashboard/context/dashboard-context";
import RankingSkeleton from "./skeleton/ranking-skeleton";

const MAX_WIDTH = 100;
const MIN_WIDTH = 60;
const getWidthFromRank = (index: number, total: number) => {
    if (total === 1) return `${MAX_WIDTH}%`;
    const step = (MAX_WIDTH - MIN_WIDTH) / (total - 1);
    return `${MAX_WIDTH - index * step}%`;
};

const Ranking = () => {
    const {rankings} = useDashboardContext()
    const {isMetricsPending} = useDashboardContext()
    
    return (
        <div className="flex flex-col gap-3 pl-4">
            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="w-[20px] h-[20px] rounded-sm bg-main-primary/15 flex items-center justify-center">
                    <AiFillAlert color={theme.colors.main.primary} size={12} />
                </div>
                <Text bold={theme.text.bold.md} textColor={theme.colors.main.primary}>
                    Worst affected districts
                </Text>
            </div>

            {/* Rankings List */}
            <div className="flex flex-col gap-2 pr-4">
                {
                    isMetricsPending ? (
                        <RankingSkeleton />
                    ) 
                    : 
                    rankings.map((ranking, index) => {
                    const width = getWidthFromRank(index, rankings.length);

                    return (
                        <div
                            key={ranking.district}
                            className="flex items-center justify-between rounded-full pl-4 pr-1.5 py-1.5 bg-main-primary transition-all duration-300 gap-2"
                            style={{ width }}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <Text
                                    textColor={theme.colors.bg.primary}
                                    bold={theme.text.bold.md}
                                    ellipsis
                                >
                                    {index + 1}
                                </Text>
                                <Text
                                    textColor={theme.colors.bg.primary}
                                    bold={theme.text.bold.md}
                                    className="flex flex-1"
                                    ellipsis
                                >
                                    {ranking.district}
                                </Text>
                            </div>
                            <div className="bg-bg-primary px-2 py-1 rounded-full flex">
                                <Text
                                    textColor={theme.colors.main.primary}
                                    bold={theme.text.bold.md}
                                    ellipsis
                                >
                                    {ranking.area}
                                </Text>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Ranking;
