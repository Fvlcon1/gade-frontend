import { getLastTwelveMonths } from "@/utils/date-utils";
import { TileLayer } from "react-leaflet";

const getPlanetUrlByMonth = (year: number, month: number) => {
	const monthStr = String(month + 1).padStart(2, '0');
	return `https://tiles.planet.com/basemaps/v1/planet-tiles/global_monthly_${year}_${monthStr}_mosaic/gmap/{z}/{x}/{y}.png?api_key=${process.env.NEXT_PUBLIC_PL_KEY}`;
};

const TimelineTiles = ({
	playhead,
	months
}: {
	playhead: number;
	months: Array<{ monthIndex: number; year: number }>;
}) => {
	return (
		months.map((month, index) => {
			const url = getPlanetUrlByMonth(month.year, month.monthIndex);
			const isVisible = playhead === index;

			return (
				<TileLayer
					key={`planet-${index}`}
					url={url}
					opacity={isVisible ? 1 : 0}
					zIndex={isVisible ? 100 : 1}
				/>
			);
		})
	)
}

export default TimelineTiles