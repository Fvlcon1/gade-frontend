'use client'

import { Order } from "../utils/types";
import React, { useContext, useState } from "react";

const ReviewContext = React.createContext<{
    order: Order;
    setOrder: (order: Order) => void;
    selectedSeverity: string;
    severities: string[];
    setSelectedSeverity: (severity: string) => void;
    selectedStatus: string;
    statuses: string[];
    setSelectedStatus: (status: string) => void;
}>({
    order: "Newest",
    setOrder: () => { },
    selectedSeverity: "All",
    severities: ["All", "High", "Medium", "Low"],
    setSelectedSeverity: () => { },
    selectedStatus: "All",
    statuses: ["All Status", "Open", "In Review", "False Positive", "Closed"],
    setSelectedStatus: () => { }
});

export const ReviewContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [order, setOrder] = React.useState<Order>("Newest");
    const severities = ["All", "High", "Medium", "Low"]
    const [selectedSeverity, setSelectedSeverity] = useState("All")
    const [selectedStatus, setSelectedStatus] = useState("All Status")
    const statuses = ["All Status", "Open", "In Review", "False Positive", "Closed"]

    return (
        <ReviewContext.Provider
            value={{
                order,
                setOrder,
                selectedSeverity,
                severities,
                setSelectedSeverity,
                selectedStatus,
                statuses,
                setSelectedStatus
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
