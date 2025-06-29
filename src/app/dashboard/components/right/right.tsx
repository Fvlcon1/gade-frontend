import Text from "@styles/components/text"
import theme from "@styles/theme"
import { BsInfo, BsInfoCircleFill } from "react-icons/bs"
import { MdPieChart } from "react-icons/md"

const Right = () => {
    return (
        <div className="fixed right-0 top-0 py-4 flex flex-col gap-4 h-full w-[380px] border-l-[1px] border-border-primary bg-bg-primary-lighter">
            <div className="w-full px-4">
                <div className="relative overflow-hidden w-full h-[150px] flex items-center rounded-2xl bg-bg-secondary">

                    <div className="w-full flex items-center px-4 gap-2">
                        <div className="w-[50px] h-[50px] rounded-full bg-main-primary/10 flex items-center justify-center">
                            <MdPieChart 
                                color={theme.colors.main.primary}
                                size={30}
                            />
                        </div>
                        <div className="flex flex-col flex-1 gap-0">
                            <Text
                                size={theme.text.size.body2}
                                bold={theme.text.bold.md}
                                textColor={theme.colors.main.primary}
                            >
                                Local Impact
                            </Text>
                            <Text>
                                Our reports have protected <b>42km</b> of land
                                area this year
                            </Text>
                            <div className="flex items-center mt-1 gap-2 border-[1px] border-main-primary/30 rounded-full p-1">
                                <BsInfoCircleFill 
                                    color={theme.colors.main.primary}
                                />
                                <Text
                                    textColor={theme.colors.main.primary}
                                    ellipsis
                                >
                                    Pulled from <b>GADE's</b> geospatial data
                                </Text>
                            </div>
                        </div>
                    </div>

                    {/* Ellipses */}
                    <div className="absolute top-[-50px] right-[60px] shadow-xl w-[90px] h-[90px] rounded-full bg-[#FF9405]" />
                    <div className="absolute rotate-180 shadow-lg bottom-[-60px] left-[-30px] w-[100px] h-[100px] rounded-full bg-[#14B2A6]" />
                </div>
            </div>
        </div>
    )
}
export default Right