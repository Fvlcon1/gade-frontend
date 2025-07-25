import { useSpatialStore } from "@/lib/store/spatial-store"
import { formatWithUnit } from "@/utils/unit-utils"
import Text from "@styles/components/text"
import { AnimatePresence, motion } from "framer-motion"
import { useTheme } from "@styles/theme-context"
import ClickableTab from "@components/ui/clickable/clickabletab"
import { IoIosCloseCircle } from "react-icons/io"
import getDate from "@/utils/getDate"

const ConcessionAttribute = () => {
    const { displayableAttribute, setDisplayableAttribute } = useSpatialStore()
    const { theme, themeColor } = useTheme()
    const { name, district, region, area, expiry_date, start_date, status, owner, type } = displayableAttribute?.feature?.properties || {}
    const areaValue = formatWithUnit({ value: area, type: "area" })

    const data = [
        { title: "Name", value: name },
        { title: "Owner", value: owner },
        { title: "Type", value: type },
        // { title: "Area", value: areaValue },
        { title: "Start Date", value: (start_date ? getDate(new Date(start_date), {shortmonth: true}) : "N/A") },
        { title: "Expiry Date", value: (expiry_date ? getDate(new Date(expiry_date), {shortmonth: true}) : "N/A") },
        { title: "Status", value: status },
    ]

    return (
        <AnimatePresence>
            {
                displayableAttribute?.type === 'concession' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        // exit={{ opacity: 0, y: -10 }}
                        className={`flex w-[350px] shadow-xl bg-bg-secondary/90 h-fit border border-border-secondary p-4 backdrop-blur-sm flex-col relative cursor-pointer hover:shadow-xl duration-300 rounded-xl`}
                    >
                        <div className="w-full flex flex-col gap-3">
                            <div className="flex justify-between gap-2 items-center">
                                <Text
                                    size={theme.text.size.HM}
                                    bold={theme.text.bold.md}
                                >
                                    Mining Concession
                                </Text>
                                <ClickableTab
                                    onClick={() => setDisplayableAttribute(null)}
                                    className="!rounded-full"
                                >
                                    <IoIosCloseCircle />
                                </ClickableTab>
                            </div>

                            <div className="flex flex-col gap-1">
                                {
                                    data.map((item, index) => {
                                        const TextValue = () => (
                                            <div className="flex w-full gap-2 p-2 py-1.5 items-center">
                                                <div className="flex w-[100px]">
                                                    <Text textColor={themeColor === 'dark' ? theme.colors.text.tetiary : theme.colors.text.secondary}>
                                                        {item.title}
                                                    </Text>
                                                </div>
                                                <div className="flex flex-1">
                                                    <Text
                                                        textColor={theme.colors.text.secondary}
                                                        lineHeight={1.3}
                                                    >
                                                        {item.value || "N/A"}
                                                    </Text>
                                                </div>
                                            </div>
                                        )
                                        return (
                                            index % 2 === 0 ? (
                                                <div key={index} className="flex w-full rounded-md bg-bg-quantinary/40 dark:bg-bg-tetiary/60">
                                                    <TextValue />
                                                </div>
                                            ) : (
                                                <TextValue key={index} />
                                            )
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </motion.div>
                ) : null
            }
        </AnimatePresence>
    )
}
export default ConcessionAttribute