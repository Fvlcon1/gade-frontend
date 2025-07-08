"use client"
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from 'leaflet';
import 'leaflet.markercluster';
import MouseCoordinateDisplay from "../MouseCoordinateDisplay";
import ReportZoomHandler from "../ReportZoomHandler";
import { LAYER_STYLES } from "../constants";
import { useSpatialStore } from "@/lib/store/spatial-store";
import { useRef, useMemo } from "react";
import Text from "@styles/components/text";
import theme from "@styles/theme";
import getDate from "@/utils/getDate";

const EndMonthDate = ({ comparisonEndDate }: { comparisonEndDate: string }) => {
    return (
        <div className="absolute top-[30px] z-[1000] left-[50px] flex justify-start w-[300px]">
            <div className="bg-bg-quantinary/30 shadow-xl border-[1px] border-border-secondary/40 backdrop-blur-sm backdrop-filter h-fit flex justify-start px-3 py-1 rounded-full">
                <Text
                    textColor={theme.colors.bg.primary}
                    size={theme.text.size.body2}
                    bold={theme.text.bold.md2}
                >
                    {getDate(new Date(comparisonEndDate))}
                </Text>
            </div>
        </div>
    )
}

const StartMonthDate = ({ comparisonStartDate }: { comparisonStartDate: string }) => {
    return (
        <div className="absolute top-[30px] z-[1000] right-[50px] flex justify-end w-[300px]">
            <div className="bg-bg-quantinary/30 shadow-xl border-[1px] border-border-secondary/40 backdrop-blur-sm backdrop-filter h-fit flex justify-end px-3 py-1 rounded-full">
                <Text
                    textColor={theme.colors.bg.primary}
                    size={theme.text.size.body2}
                    bold={theme.text.bold.md2}
                >
                    {getDate(new Date(comparisonStartDate))}
                </Text>
            </div>
        </div>
    )
}

const SideBySide = ({
    mapRef,
    topMapRef,
    miningSitesLeft,
    miningSitesRight,
    comparisonStartDate,
    getPlanetUrlForMonth,
    comparisonEndDate,
    MapSynchronizer,
    reports,
    searchParams,
    initialView
}) => {
    return (
        <div className="w-full h-full flex">
            {/* Bottom Map - Start Month */}
            <div className="flex flex-1 w-full border-r-[1.5px] border-bg-primary relative">
                <StartMonthDate comparisonStartDate={comparisonStartDate} />
                <MapContainer
                    ref={mapRef}
                    center={initialView.center}
                    zoom={initialView.zoom}
                    zoomControl={false}
                    className="w-full h-full"
                >
                    <TileLayer
                        url={getPlanetUrlForMonth(comparisonStartDate)}
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {/* Start month mining sites */}
                    {miningSitesLeft && (
                        <GeoJSON
                            key={`comparison-start-${comparisonStartDate}`}
                            data={miningSitesLeft}
                            style={{ ...LAYER_STYLES.mining_sites, opacity: 1, fillOpacity: 0.7 }}
                        />
                    )}
                    <ReportZoomHandler reports={reports} searchParams={searchParams} />
                    <MapSynchronizer targetMap={topMapRef} />
                </MapContainer>
            </div>

            {/* Top Map - End Month (masked by slider) */}
            <div className="flex flex-1 w-full border-l-[1.5px] border-bg-primary relative">
                <EndMonthDate comparisonEndDate={comparisonEndDate} />
                <MapContainer
                    ref={topMapRef}
                    center={initialView.center}
                    zoom={initialView.zoom}
                    zoomControl={false}
                    className="w-full h-full"
                >
                    <TileLayer
                        url={getPlanetUrlForMonth(comparisonEndDate)}
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {/* End month mining sites */}
                    {miningSitesRight && (
                        <GeoJSON
                            key={`comparison-end-${comparisonEndDate}`}
                            data={miningSitesRight}
                            style={{ ...LAYER_STYLES.mining_sites, opacity: 1, fillOpacity: 0.7 }}
                        />
                    )}
                </MapContainer>
            </div>

            {/* <MouseCoordinateDisplay /> */}
        </div>
    )
}
export default SideBySide