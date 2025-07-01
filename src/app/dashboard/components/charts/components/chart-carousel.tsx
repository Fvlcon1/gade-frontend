"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import LineChart from "./line-chart/line-chart";
import BarChart from "./bar-chart/bar-chart";
import ReportsBarChart from "./reports-bar-chart/reports-bar-chart";

const ChartCarousel = () => {
    const charts = [
        { id: 1, component: <LineChart />, label: "Area over time" },
        { id: 2, component: <BarChart />, label: "Districts by area" },
        { id: 3, component: <ReportsBarChart />, label: "Reported cases over time" },
    ];

    const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);
    const [autoPlay, setAutoPlay] = useState(true);

    useEffect(() => {
        if (!autoPlay) return;
        const interval = setInterval(() => {
            navigate(1);
        }, 10000);
        return () => clearInterval(interval);
    }, [autoPlay, currentIndex]);

    const navigate = (newDirection: number) => {
        setCurrentIndex([(currentIndex + newDirection + charts.length) % charts.length, newDirection]);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        },
        exit: (direction: number) => ({
            x: direction < 0 ? "100%" : "-100%",
            opacity: 0,
            transition: { duration: 0.3 }
        }),
    };

    return (
        <div
            className={`relative w-full overflow-hidden rounded-xl py-6 h-[550px]`}
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
        >
            <AnimatePresence custom={direction} initial={false}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full"
                >
                    {charts[currentIndex]?.component}
                </motion.div>
            </AnimatePresence>

            {
                    <>
                        {/* Navigation Dots */}
                        <div className="flex justify-center gap-2 ">
                            {charts.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex([index, index > currentIndex ? 1 : -1])}
                                    className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? "bg-main-primary" : "bg-gray-300"
                                        }`}
                                    aria-label={`Show ${charts[index].label} chart`}
                                />
                            ))}
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={() => navigate(-1)}
                            className="absolute left-0 h-full w-[100px] rounded-l-xl flex items-center justify-center top-1/2 cursor-pointer -translate-y-1/2 p-2 opacity-0 hover:opacity-100 bg-[#4f4f4f23] duration-300 "
                            aria-label="Previous chart"
                        >
                            <FiChevronLeft className="text-gray-700 text-xl" />
                        </button>
                        <button
                            onClick={() => navigate(1)}
                            className="absolute right-0 h-full w-[100px] rounded-r-xl flex items-center justify-center top-1/2 cursor-pointer -translate-y-1/2 p-2 opacity-0 hover:opacity-100 bg-[#4f4f4f23] duration-300"
                            aria-label="Next chart"
                        >
                            <FiChevronRight className="text-gray-700 text-xl" />
                        </button>
                    </>
            }
        </div>
    );
};

export default ChartCarousel;