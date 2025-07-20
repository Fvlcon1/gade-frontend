import BlurContainer from "@components/ui/blur-container";
import Text from "@styles/components/text";
import theme from "@styles/theme";
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

const { RangePicker } = DatePicker;

const PriorityIndexHeatmap = () => {
	const { setMonths, months, activeRightNav, setIsPriorityIndexVisible, isPriorityIndexVisible } = useSpatialStore();
	const {getHeatmapDataMutation, getHeatmapDataPending, getHeatmapDataSuccess, getHeatmapDataError, setStartDate, setEndDate, startDate, endDate} = usePriorityIndex();

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
									className="pl-0"
								>
									Priority index heatmap
								</Text>
								<div className="flex items-center gap-2">
									<Switch
										checked={isPriorityIndexVisible}
										onChange={setIsPriorityIndexVisible}
										size="small"
									/>
									<Text>
										Show priority index heatmap
									</Text>
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
										text={getHeatmapDataPending ? "Applying..." : "Apply"}
										className="!h-[30px] !w-full !py-0"
										onClick={()=>getHeatmapDataMutation()}
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