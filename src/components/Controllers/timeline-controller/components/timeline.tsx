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
import { useSpatialStore } from "@/lib/store/spatial-store";
import { getMonthsBetweenDates } from "@/utils/date-utils";
import { useState } from "react";

const { RangePicker } = DatePicker;

const Timeline = ({
	resetDate,
	isPlaying,
	handlePlayClick,
	handleReset,
}) => {
	const { setMonths, months } = useSpatialStore();
	const [startDate, setStartDate] = useState(new Date(months[0].year, months[0].monthIndex));
	const [endDate, setEndDate] = useState(new Date(months[months.length - 1].year, months[months.length - 1].monthIndex));

	const handleDateChange = (dates: [dayjs.Dayjs, dayjs.Dayjs]) => {
		if (dates) {
			setStartDate(dates[0].toDate());
			setEndDate(dates[1].toDate());
			setMonths(getMonthsBetweenDates(dates[0].toDate(), dates[1].toDate()));
		} else {
			resetDate();
		}
	}
	return (
		<BlurContainer>
			<div className="flex flex-col w-full p-3 gap-1">
				<Text
					bold={theme.text.bold.md}
					className="pl-1"
				>
					Mining activity timeline
				</Text>
				<RangePicker
					picker="month"
					style={{
						fontFamily: "montserrat",
					}}
					value={[dayjs(startDate), dayjs(endDate)]}
					onChange={handleDateChange}
				/>
				<div className="w-full gap-2 flex items-center mt-1">
					<Button
						text={isPlaying ? "Pause" : "Play"}
						icon={isPlaying ? <FaPause size={10} /> : <FaPlay size={10} />}
						onClick={handlePlayClick}
						className="!h-[30px] !py-0"
					/>
					<OutlineButton
						text="Reset"
						icon={<MdOutlineRefresh size={15} />}
						onClick={handleReset}
						className="!h-[30px] !py-0 !px-2"
					/>
				</div>
			</div>
		</BlurContainer>
	)
}
export default Timeline