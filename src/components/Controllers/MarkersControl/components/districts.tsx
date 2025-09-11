import Text from "@styles/components/text";
import theme from "@styles/theme";
import { motion } from "framer-motion";
import { TbReload } from "react-icons/tb";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { IoMdCheckmark } from "react-icons/io";
import { IoClose, IoSearch } from "react-icons/io5";
import ClickableTab from "@components/ui/clickable/clickabletab";
import Input from "@components/ui/input/input";
import { useCallback, useEffect } from "react";
import { DistrictSearchResponse } from "@/hooks/spatial-data";
import Dropdown from "@components/ui/dropdown/dropdown";
import { useState } from "react";
import { DropdownItem } from "@/utils/@types";
import OutlineButton from "@components/ui/button/outlineButton";
import Button from "@components/ui/button/button";
import { GiMagicBroom } from "react-icons/gi";

interface DistrictsProps {
    isCollapsed: boolean;
    toggleCollapse: () => void;
    isRefreshing: boolean;
    handleReset: () => void;
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
    districtsToShow: string[];
    pendingDistricts: string[];
    toggleDistrict: (district: string) => void;
    handleApplyDistricts: () => void;
    isSearching: boolean;
    searchResultsRef: React.RefObject<HTMLDivElement>;
    selectedDistrictsRef: React.RefObject<HTMLDivElement>;
    searchResults: DistrictSearchResponse;
}

const Districts = ({
    isCollapsed,
    toggleCollapse,
    isRefreshing,
    handleReset,
    searchTerm,
    setSearchTerm,
    districtsToShow,
    pendingDistricts,
    toggleDistrict,
    handleApplyDistricts,
    isSearching,
    searchResultsRef,
    selectedDistrictsRef,
    searchResults
}: DistrictsProps) => {
    const { result } = searchResults || {}
    const [options, setOptions] = useState<DropdownItem[]>([{ label: "No data", disabled: true, key: "disabled" }]);

    const convertResultToDropdownOptions = useCallback((): DropdownItem[] => {
        const options: DropdownItem[] = [];
        if (result)
            result.map((district: string) => {
                options.push({
                    label: district,
                    key: district,
                    isSelected: pendingDistricts.includes(district),
                    onClick: () => {
                        toggleDistrict(district);
                    },
                })
            })
        return options;
    }, [result, pendingDistricts]);

    useEffect(() => {
        if (pendingDistricts.length) handleApplyDistricts();
    }, [pendingDistricts]);

    useEffect(() => {
        if (result) {
            setOptions(convertResultToDropdownOptions());
        }
    }, [result, convertResultToDropdownOptions, pendingDistricts]);

    return (
        <div
            className="w-full px-3 flex flex-col gap-1 rounded-[10px] relative"
        >
            <div
                className="w-full flex items-center justify-between"
            >
                <Text
                    bold={theme.text.bold.md}
                    className="pl-1"
                >
                    District
                </Text>
            </div>

            <div className="flex flex-col gap-2">
                <Dropdown
                    menuItems={options}
                >
                    <Input
                        placeholder="Search district..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        PreIcon={<IoSearch size={16} color={theme.colors.text.tetiary} />}
                        PostIcon={
                            isSearching ? (
                                <Loader2 size={16} color={theme.colors.text.tetiary} className="rotate" />
                            ) :
                                searchTerm ? (
                                    <IoClose size={16} color={theme.colors.text.tetiary} onClick={() => setSearchTerm("")} />
                                ) : null
                        }
                        className="!h-[35px] !px-2"
                    />
                </Dropdown>

                <div className="flex gap-2 flex-wrap">
                    {
                        pendingDistricts.map((district) => (
                            <div
                                key={district}
                                className="flex rounded-full items-center max-w-[240px] gap-1 px-3 py-1 border-[1px] border-main-primary/50 cursor-pointer hover:bg-bg-tetiary"
                                onClick={() => toggleDistrict(district)}
                            >
                                <Text 
                                    ellipsis
                                    textColor={theme.colors.main.primary}
                                >
                                    {district}
                                </Text>
                                <IoClose
                                    size={16}
                                    color={theme.colors.main.primary}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
export default Districts