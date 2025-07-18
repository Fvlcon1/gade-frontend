import BlurContainer from "@components/ui/blur-container";
import Text from "@styles/components/text";
import theme from "@styles/theme";
import dayjs from "dayjs";
import Button from "@components/ui/button/button";
import OutlineButton from "@components/ui/button/outlineButton";
import { MdOutlineRefresh } from "react-icons/md";
import { FaPlay, FaPause } from "react-icons/fa";
import { DatePicker } from "antd";
import { hexOpacity } from "@/utils/hexOpacity";
import { useState } from "react";
import { Radio } from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox/Group";
import { RadioChangeEvent } from "antd/es/radio/interface";
import Divider from "@components/ui/divider/divider";
import TabToggle from "./tab-toggle";
import { ComparisonView } from "../../utils/types";
import { useSpatialStore } from "@/lib/store/spatial-store";

const { RangePicker } = DatePicker;

const Compare = ({
	resetDate,
	onCompare,
	comparisonStartDate,
	comparisonEndDate,
}) => {
	const [startDate, setStartDate] = useState(comparisonStartDate);
	const [endDate, setEndDate] = useState(comparisonEndDate);
	const { setComparisonViewState, comparisonViewState } = useSpatialStore();

	return (
		<BlurContainer>
			<div className="flex flex-col w-full p-3 gap-3">
				<TabToggle
					activeTab={comparisonViewState}
					handleTabChange={(tab)=>{
						setComparisonViewState(tab)
					}}
				/>
				<Divider />

				<div className="flex flex-col w-full gap-1">
					<Text
						bold={theme.text.bold.md}
						className="pl-0.5"
					>
						Dual date comparison
					</Text>
					<RangePicker
						picker="month"
						style={{
							fontFamily: "montserrat",
						}}
						value={startDate ? [dayjs(startDate), dayjs(endDate)] : undefined}
						onChange={(dates) => {
							if (dates) {
								setStartDate(dates[0].toISOString().split('T')[0]);
								setEndDate(dates[1].toISOString().split('T')[0]);
							} else {
								resetDate();
							}
						}}
					/>
					<Button
						text="Compare"
						onClick={() => {
							if (onCompare && startDate && endDate) onCompare(startDate, endDate);
						}}
						className="!h-[30px] !py-0 !mt-0.5"
					/>
				</div>
			</div>
		</BlurContainer>
	)
}
export default Compare