import Text from "@styles/components/text";
import { AiOutlineReload } from "react-icons/ai";
import { FaChevronDown, FaChevronRight, FaCalendar } from "react-icons/fa";
import { useState, useCallback, useMemo } from "react";
import { getLastSixMonths } from "@/utils/getDate";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useTheme } from "@styles/theme-context";
const { RangePicker } = DatePicker;

interface DateRangeProps {
    isOpen: boolean;
    onClose: () => void;
    sidebarExpanded: boolean;
    setIsRefreshing: (refreshing: boolean) => void;
    handleMonthRangeChange: (index: number, value: number) => void;
    handlePresetRange: (range: string) => void;
    DateRanges: string[];
    activeRange: string;
    fromDate: string;
    toDate: string;
    setFromDate: (date: string) => void;
    setToDate: (date: string) => void;
    setActiveRange: (range: string) => void;
    setDateRange: (range: { from: string | null; to: string | null }) => void;
}

const DateRange = ({
    isOpen,
    onClose,
    sidebarExpanded = false,
    setIsRefreshing,
    handleMonthRangeChange,
    handlePresetRange,
    DateRanges,
    activeRange,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    setActiveRange,
    setDateRange,
}: DateRangeProps) => {
    const [isDateCollapsed, setIsDateCollapsed] = useState(false);
    const [monthRange, setMonthRange] = useState([0, getLastSixMonths().length - 1]);
    const months = useMemo(() => getLastSixMonths(), []);
    const {theme} = useTheme();
    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 800);
    }, []);

    const resetDate = () => {
        setDateRange({ from: null, to: null });
        setFromDate("");
        setToDate("");
        setActiveRange("");
    }
    return (
        <div
            className="w-full overflow-hidden px-3 gap-1 flex flex-col rounded-[10px] relative"
        >
            <div
                className="w-full flex items-center justify-between cursor-pointer"
                onClick={() => setIsDateCollapsed(!isDateCollapsed)}
            >
                <Text
                    bold={theme.text.bold.md}
                    className="pl-1"
                >
                    Detection date
                </Text>
            </div>

            <div className="flex flex-col gap-2">
                <RangePicker
                    style={{
                        height: "35px",
                        borderRadius: "10px"
                    }}
                    value={fromDate ? [dayjs(fromDate), dayjs(toDate)] : undefined}
                    onChange={(dates) => {
                        if (dates) {
                            setFromDate(dates[0].toISOString().split('T')[0]);
                            setToDate(dates[1].toISOString().split('T')[0]);
                        } else {
                            resetDate();
                        }
                    }}
                />
                {DateRanges.map((label) => (
                    <div
                        key={label}
                        onClick={() => handlePresetRange(label)}
                        className={`w-full h-[35px] flex items-center justify-center rounded-lg cursor-pointer ${activeRange === label
                            ? "bg-main-primary text-white hover:bg-main-primary/90"
                            : "bg-bg-tetiary hover:bg-bg-secondary border-[1px] border-border-primary"
                            }`}
                    >
                        <Text
                            textColor={activeRange === label ? "white" : theme.colors.text.secondary}
                        >
                            {label}
                        </Text>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default DateRange