import BlurContainer from "@components/ui/blur-container";
import Text from "@styles/components/text";
import dayjs from "dayjs";
import Button from "@components/ui/button/button";
import OutlineButton from "@components/ui/button/outlineButton";
import { MdOutlineRefresh } from "react-icons/md";
import { DatePicker, Switch } from "antd";
import { useSpatialStore } from "@/lib/store/spatial-store";
import { getMonthsBetweenDates } from "@/utils/date-utils";
import { useState } from "react";
import SlideIn from "@styles/components/slidein";
import usePriorityIndex from "./hooks/use-index";
import Divider from "@components/ui/divider/divider";
import { GoDotFill } from "react-icons/go";
import { useTheme } from "@styles/theme-context";

const { RangePicker } = DatePicker;

const PriorityIndexHeatmap = () => {
	const { setMonths, months, activeRightNav, setIsPriorityIndexVisible, isPriorityIndexVisible } = useSpatialStore();
	const { getHeatmapDataMutation, getHeatmapDataPending, getHeatmapDataSuccess, getHeatmapDataError, setStartDate, setEndDate, startDate, endDate } = usePriorityIndex();
	const { theme } = useTheme()

	const handleDateChange = (dates: [dayjs.Dayjs, dayjs.Dayjs]) => {
		if (dates) {
			setStartDate(dates[0].toDate());
			setEndDate(dates[1].toDate());
			setMonths(getMonthsBetweenDates(dates[0].toDate(), dates[1].toDate()));
		}
	}
	return (
		<>
			{
				activeRightNav === "Priority index Heatmap" ? (
					<SlideIn
						direction="right"
					>
						<BlurContainer
							className="!bg-primary/0"
						>
							<div className="flex flex-col w-[300px] p-3 gap-2">
								<Text
									bold={theme.text.bold.md}
									size={theme.text.size.body2}
									className="pl-0"
								>
									Priority index heatmap
								</Text>
								<div
									onClick={() => setIsPriorityIndexVisible(!isPriorityIndexVisible)}
									className="flex items-center gap-2 cursor-pointer"
								>
									<Switch
										checked={isPriorityIndexVisible}
										onChange={setIsPriorityIndexVisible}
										size="small"
										style={{
											backgroundColor: isPriorityIndexVisible ? theme.colors.main.primary : theme.colors.bg.tetiary,
										}}
									/>
									<Text
										textColor={isPriorityIndexVisible ? theme.colors.main.primary : theme.colors.text.secondary}
										bold={isPriorityIndexVisible ? theme.text.bold.md : theme.text.bold.sm2}
									>
										Show priority index heatmap
									</Text>
								</div>
								{/* <Divider className="!bg-bg-tetiary" /> */}
								<div className="flex flex-col gap-1 p-2 rounded-lg bg-bg-quantinary/50">
									<div className="w-full flex gap-2 justify-between items-center">
										<Text>Low</Text>
										<div className="flex items-center gap-1 flex-1">
											<GoDotFill color={theme.colors.text.tetiary} />
											<div className="flex flex-1 h-[1px] border-b-[1px] border-dashed border-border-tetiary" />
											<GoDotFill color={theme.colors.text.tetiary} />
										</div>
										<Text>High</Text>
									</div>
									<div className="w-full h-[20px] rounded bg-gradient-to-r from-[#070d6c] via-[#00FF00] to-[#FF0000]" />
								</div>
								<RangePicker
									picker="month"
									style={{
										fontFamily: "montserrat",
									}}
									value={[dayjs(startDate), dayjs(endDate)]}
									onChange={handleDateChange}
								/>
								<div className="w-full gap-2 flex items-center mt-0">
									<Button
										text={getHeatmapDataPending ? "Generating..." : "Generate Hotspot"}
										className="!h-[30px] !w-full !py-0"
										onClick={() => getHeatmapDataMutation()}
										loading={getHeatmapDataPending}
									/>
								</div>
							</div>
						</BlurContainer>
					</SlideIn>
				) : null
			}
		</>
	)
}
export default PriorityIndexHeatmap