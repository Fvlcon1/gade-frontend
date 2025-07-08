"use client"
import Text from "@styles/components/text"
import theme from "@styles/theme"
import Dropdown from "@components/ui/dropdown/dropdown"
import Input from "@components/ui/input/input"
import { DropdownItem } from "@/utils/@types"
import { FaSortAmountDownAlt, FaChevronDown } from "react-icons/fa"
import { useReviewContext } from "../context/review-context"
import { useSpatialStore } from "@/lib/store/spatial-store"
import { formatNumber } from "@/utils/number-utils"

const TopSection = () => {
    const { order, setOrder } = useReviewContext();
    const {filteredMiningSites} = useSpatialStore()

    const orderOptions: DropdownItem[] = [
        { key: "newest", label: "Newest", value: "Newest", isSelected: order === "Newest" },
        { key: "oldest", label: "Oldest", value: "Oldest", isSelected: order === "Oldest" }
    ]

    return (
        <div className="sticky top-0 py-4 bg-main-primary/10 backdrop-blur-lg px-4 z-10 w-full flex items-center justify-between">
            <div className="flex flex-col gap-1">
                <Text
                    // textColor={theme.colors.main.primary}
                    size={theme.text.size.body2}
                    bold={theme.text.bold.md2}
                    lineHeight={1}
                >
                    Mining Sites
                </Text>
                <Text>
                {formatNumber(filteredMiningSites?.features?.length, 0)} Sites
                </Text>
            </div>

            <Dropdown
                menuItems={orderOptions}
                onChange={setOrder}
                position="bottom-right"
            >
                <Input
                    placeholder="Sort"
                    PreIcon={<FaSortAmountDownAlt size={12} color={theme.colors.text.secondary} />}
                    PostIcon={<FaChevronDown size={12} color={theme.colors.text.secondary} /> }
                    value={order}
                    onChange={() => { }}
                    className="!w-[120px] !h-[32px] !px-3 !bg-bg-primary/30"
                />
            </Dropdown>
        </div>
    )
}
export default TopSection