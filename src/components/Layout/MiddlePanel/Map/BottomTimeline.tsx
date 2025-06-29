"use client";
import { useSpatialStore } from "@/lib/store/spatial-store";
import Text from "@styles/components/text";
import theme from "@styles/theme";
import React, { useRef, useState, useEffect } from "react";
import { FaSortDown } from "react-icons/fa6";

interface BottomTimelineProps {
	isVisible: boolean;
	onClose: () => void;
	sidebarExpanded?: boolean;
	range: [number, number];
	onRangeChange: (index: number, value: number) => void;
	selectedYear: number;
	playhead?: number | null;
	isPlaying?: boolean;
	setPlayhead?: (playhead: number | null) => void;
}

const getMonths = () => [
	'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const BottomTimeline: React.FC<BottomTimelineProps> = ({
	isVisible,
	onClose,
	sidebarExpanded = false,
	range,
	onRangeChange,
	selectedYear,
	playhead = null,
	isPlaying = false,
	setPlayhead,
}) => {
	const trackRef = useRef<HTMLDivElement>(null);
	const [dragging, setDragging] = useState<null | 0 | 1>(null);
	const {months} = useSpatialStore();

	const getPositionValue = (e: MouseEvent | React.MouseEvent) => {
		const track = trackRef.current;
		if (!track) return 0;
		const rect = track.getBoundingClientRect();
		const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
		const ratio = x / rect.width;
		return Math.round(ratio * (months.length - 1));
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (dragging === null || isPlaying) return;
		const value = getPositionValue(e);
		onRangeChange(dragging, value);
	};

	const handleMouseUp = () => {
		setDragging(null);
	};

	const handleTrackClick = (e: React.MouseEvent) => {
		if (isPlaying) return;
		const clickedValue = getPositionValue(e);
		const distanceToStart = Math.abs(clickedValue - range[0]);
		const distanceToEnd = Math.abs(clickedValue - range[1]);
		const closestIndex = distanceToStart <= distanceToEnd ? 0 : 1;
		onRangeChange(closestIndex, clickedValue);
	};

	useEffect(() => {
		if (dragging !== null) {
			window.addEventListener("mousemove", handleMouseMove);
			window.addEventListener("mouseup", handleMouseUp);
		} else {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		}
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [dragging]);

	if (!isVisible) return null;

	const leftPercent = (range[0] / (months.length - 1)) * 100;
	const rightPercent = (range[1] / (months.length - 1)) * 100;

	return (
		<div
			className="absolute bottom-0 pb-8 h-[150px] flex items-end z-[1000] pl-[70px] w-full bg-gradient-to-t from-[#ffffff] to-[#ffffff00]"
		>
			<div className="flex flex-col justify-center w-full items-center px-4 sm:px-6 py-3 gap-1">
				{/* Timeline Slider */}
				<div className="w-full">
					<div
						className="relative h-[6px] bg-gray-100 rounded-lg w-full cursor-pointer"
						ref={trackRef}
						onClick={handleTrackClick}
					>
						{/* Active Range */}
						<div
							className="absolute h-[6px] bg-main-primary rounded-full"
							style={{
								left: `${leftPercent}%`,
								width: `${rightPercent - leftPercent}%`,
								top: "0",
							}}
						/>

						{/* Thumb Start */}
						<div
							onMouseDown={() => !isPlaying && setDragging(0)}
							className="absolute top-1/2 w-4 h-4 bg-main-primary border-2 border-white rounded-full shadow-md -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
							style={{
								left: `${leftPercent}%`,
							}}
						/>

						{/* Thumb End */}
						<div
							onMouseDown={() => !isPlaying && setDragging(1)}
							className="absolute top-1/2 w-4 h-4 bg-main-primary border-2 border-white rounded-full shadow-md -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
							style={{
								left: `${rightPercent}%`,
							}}
						/>
					</div>
				</div>

				{/* Month Labels */}
				<div className="w-full flex justify-between text-xs text-gray-500 px-1 mt-1">
					{months.map((month, index) => (
						playhead === index ? (
							<div 
								key={index} 
								className="relative flex flex-col items-center"
							>
								{/* Playhead */}
								<FaSortDown
									color={theme.colors.main.primary}
									size={20}
									className="absolute top-[-40px]"
								/>

								{/* Text */}
								<div className="px-2 py-1 rounded-full bg-main-primary">
									<Text
										textColor={theme.colors.bg.primary}
										bold={theme.text.bold.md}
									>
										{new Date(month.year, month.monthIndex).toLocaleDateString('default', { month: 'short', year: '2-digit' })}
									</Text>
								</div>
							</div>
						) : (
							<div
								key={index}
								className="px-2 py-1 rounded-full hover:bg-[#00000026] cursor-pointer"
								onClick={() => setPlayhead(index)}
							>
								<Text
									bold={theme.text.bold.md}
								>
									{new Date(month.year, month.monthIndex).toLocaleDateString('default', { month: 'short', year: '2-digit' })}
								</Text>
							</div>
						)
					))}
				</div>

				{/* Selected Range */}
				{/* <div className="text-xs text-gray-600 text-center">
          {selectedYear}: {months[range[0]]} - {months[range[1]]}
        </div> */}
			</div>
		</div>
	);
};

export default BottomTimeline;
