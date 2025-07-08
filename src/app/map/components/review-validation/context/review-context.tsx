'use client'

import { Order } from "../utils/types";
import React, { useContext, useState } from "react";

const ReviewContext = React.createContext<{
    order: Order;
    setOrder: (order: Order) => void;
    selectedSeverity: string;
    severities: string[];
    setSelectedSeverity: (severity: string) => void;
}>({
    order: "Newest",
    setOrder: () => { },
    selectedSeverity: "All",
    severities: ["All", "High", "Medium", "Low"],
    setSelectedSeverity: () => { }
});

export const ReviewContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [order, setOrder] = React.useState<Order>("Newest");
    const severities = ["All", "High", "Medium", "Low"]
    const [selectedSeverity, setSelectedSeverity] = useState("All")

    return (
        <ReviewContext.Provider
            value={{
                order,
                setOrder,
                selectedSeverity,
                severities,
                setSelectedSeverity
            }}
        >
            {children}
        </ReviewContext.Provider>
    );
};

export const useReviewContext = () => {
    const context = useContext(ReviewContext);
    if (!context) {
        throw new Error('useReviewContext must be used within a ReviewContextProvider');
    }
    return context;
};
