export const getStatusBgClass = (status: string) => {
    switch (status) {
        case "OPEN":
            return "bg-orange-100";
        case "IN_REVIEW":
            return "bg-blue-100";
        case "RESOLVED":
            return "bg-green-100";
        case "CLOSED":
            return "bg-gray-200";
        default:
            return "bg-gray-100";
    }
};

export const getStatusTextColor = (status: string) => {
    switch (status) {
        case "OPEN":
            return "#D97706"; // amber-600
        case "IN_REVIEW":
            return "#2563EB"; // blue-600
        case "RESOLVED":
            return "#059669"; // green-600
        case "CLOSED":
            return "#4B5563"; // gray-600
        default:
            return "#6B7280"; // gray-500
    }
};

export const getSeverityBgClass = (severity: string) => {
    switch (severity) {
        case "LOW":
            return "bg-green-100";
        case "MEDIUM":
            return "bg-orange-100";
        case "HIGH":
            return "bg-red-100";
        default:
            return "bg-gray-100";
    }
};

export const getSeverityTextColor = (severity: string) => {
    switch (severity) {
        case "LOW":
            return "#059669"; // green-600
        case "MEDIUM":
            return "#eb8334"; // orange
        case "HIGH":
            return "#EF4444"; // red-500 (recommended for high severity)
        default:
            return "#6B7280"; // gray-500
    }
};