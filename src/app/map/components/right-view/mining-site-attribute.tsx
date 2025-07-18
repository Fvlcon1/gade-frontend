'use client'

import { SpatialData, useSpatialStore } from "@/lib/store/spatial-store";
import getDate, { getRelativeTime, getTime } from "@/utils/getDate";
import { formatNumber } from "@/utils/number-utils";
import { formatWithPrefix, formatWithUnit } from "@/utils/unit-utils";
import { capitalizeWords } from "@/utils/utils";
import Button from "@components/ui/button/button";
import Copychip from "@components/ui/chip/copyChip";
import ClickableTab from "@components/ui/clickable/clickabletab"
import Text from "@styles/components/text"
import theme from "@styles/theme"
import { AnimatePresence, motion } from 'framer-motion';
import L from "leaflet";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { useTheme } from "@/app/styles/theme-context"
import { feature } from "@turf/turf";
import { IoIosCloseCircle } from "react-icons/io";

const Dot = () => {
    const { theme } = useTheme()
    return (
        <div className="p-1 rounded-full bg-white/50">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>
    )
}

const Info = ({
    title,
    value
}) => {
    const { theme } = useTheme()
    return (
        <div className="flex flex-col gap-1">
            <Text
                textColor={theme.colors.text.tetiary}
                ellipsis
            >
                {title}
            </Text>
            {
                value ? (
                    <Text
                        size={theme.text.size.HM}
                        bold={theme.text.bold.md}
                        className="max-w-[100px]"
                        ellipsis
                    >
                        {value}
                    </Text>
                ) :
                    <Text
                        size={theme.text.size.HM}
                        bold={theme.text.bold.md}
                        textColor={theme.colors.text.tetiary}
                    >
                        N/A
                    </Text>
            }
        </div>
    )
}

const VerticalDivider = () => (
    <div className="w-[1px] h-[40px] bg-border-primary/40" />
)

const variants = {
    expand: {
        height: "fit-content",
        opacity: 1
    },
    collapse: {
        height: 0,
        opacity: 0
    }
}

const Chip = ({
    title,
    value
}) => {
    const { theme } = useTheme()
    return (
        <div className="flex px-2 py-1.5 border-[1px] border-main-primary rounded-full">
            <Text textColor={theme.colors.main.primary}>
                {title}:&nbsp;
            </Text>
            <Text
                bold={theme.text.bold.md}
                textColor={theme.colors.main.primary}
            >
                {value}
            </Text>
        </div>
    )
}

const parseViolationTypes = (input: string): string[] => {
    if (!input) return [];
    return input.split(",").map(item =>
        item
            .toLowerCase()
            .split("_")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    );
}

const getSeverityTailwindColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
        case "low":
            return "bg-green-700"
        case "medium":
            return "bg-orange-600"
        case "high":
            return "bg-[#E3655E]"
        default:
            return "bg-[#E3655E]"
    }
}

const getSeverityBgColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
        case "low":
            return "#00C853"
        case "medium":
            return "#f64a00"
        case "high":
            return "#E3655E"
        default:
            return "#E3655E"
    }
}

const MiningSiteAttribute = () => {
    const { selectedMiningSite, setSelectedMiningSite } = useSpatialStore()
    const { severity, area, district, region, detected_date, severity_score, all_violation_types, distance_to_forest_m, distance_to_water_m } = selectedMiningSite?.properties || {}
    const violationTypes = parseViolationTypes(all_violation_types)

    const areaValue = formatWithUnit({ value: area, type: "area" }).split(" ")
    const areaFigure = areaValue[0]
    const areaUnit = areaValue[1]

    useEffect(() => {
        console.log({selectedMiningSite})
    }, [selectedMiningSite])

    return (
        <AnimatePresence>
            {
                selectedMiningSite ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex h-fit w-[350px] shadow-xl flex-col relative cursor-pointer hover:shadow-xl duration-300 rounded-2xl`}
                    >
                        <div className="w-full flex justify-between gap-2">
                            <div className={`px-3 py-1.5 w-fit ${getSeverityTailwindColor(severity)} rounded-t-xl flex items-center gap-1.5`}>
                                <Dot />
                                <Text
                                    textColor={theme.colors.bg.primary}
                                    bold={theme.text.bold.md}
                                >
                                    {capitalizeWords(severity) || "Unknown Severity"}
                                </Text>
                            </div>
                            <ClickableTab
                                onClick={() => setSelectedMiningSite(null)}
                                className="!rounded-full"
                            >
                                <IoIosCloseCircle />
                            </ClickableTab>
                        </div>
                        <div className={`absolute left-0 top-4 z-[-1] w-[50px] h-[50px] ${getSeverityTailwindColor(severity)}`} />
                        <div className={`w-full px-3 py-2 flex flex-col gap-0 bg-bg-primary-lighter relative rounded-2xl border-[1px] border-[${getSeverityBgColor(severity)}]`}>
                            <div className="flex flex-col gap-1.5">
                                <Text
                                    size={theme.text.size.body2}
                                    bold={theme.text.bold.md}
                                >
                                    Mining Violation - <Text bold={theme.text.bold.md} textColor={theme.colors.main.primary}>{getRelativeTime(new Date(detected_date))}</Text>
                                </Text>
                                <Text textColor={theme.colors.text.tetiary}>
                                    Severity Score: {severity_score ?? "N/A"}
                                </Text>
                            </div>

                            <div className="flex gap-2 flex-wrap my-2">
                                {
                                    violationTypes.map((type, index) => {
                                        return (
                                            <div
                                                className="px-2 py-1 flex rounded-full bg-[#E3655E]/10 border-[1px] border-[#E3655E]"
                                                key={index}
                                            >
                                                <Text
                                                    textColor="#E3655E"
                                                    bold={theme.text.bold.md}
                                                >
                                                    {type}
                                                </Text>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex bg-bg-primary w-full px-3 py-2 border-[1px] rounded-xl border-border-primary/40 gap-3 items-center">
                                        <Info title={`Area (${areaUnit})`} value={areaFigure} />
                                        <VerticalDivider />
                                        <Info title="District" value={capitalizeWords(district)} />
                                        <VerticalDivider />
                                        <Info title="Severity" value={capitalizeWords(severity)} />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Chip
                                            title="Forest Distance"
                                            value={formatWithUnit({ value: distance_to_forest_m })}
                                        />
                                        <Chip
                                            title="River Distance"
                                            value={formatWithUnit({ value: distance_to_water_m })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : null
            }
        </AnimatePresence>
    )
}
export default MiningSiteAttribute