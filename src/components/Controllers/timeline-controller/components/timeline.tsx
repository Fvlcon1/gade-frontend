import BlurContainer from "@components/ui/blur-container";
import Text from "@styles/components/text";
import theme from "@styles/theme";
import dayjs from "dayjs";
import Button from "@components/ui/button/button";
import OutlineButton from "@components/ui/button/outlineButton";
import { MdOutlineRefresh } from "react-icons/md";
import { FaPlay, FaPause } from "react-icons/fa";
import { DatePicker } from "antd";
import { hexOpacity } from "@/utils/hexOpacity";

const { RangePicker } = DatePicker;

const Timeline = ({
    resetDate,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    isPlaying,
    handlePlayClick,
    handleReset,
}) => {
    return (
        <BlurContainer>
              <div className="flex flex-col w-full p-3 gap-0.5">
                <Text 
                  bold={theme.text.bold.md}
                  className="pl-1"
                >
                  Mining activity timeline
                </Text>
                <RangePicker
                  style={{
                    height: "35px",
                    borderRadius: "10px",
                    backgroundColor: theme.colors.bg.primary + hexOpacity(50),
                    fontFamily: "montserrat",
                    borderColor: theme.colors.text.tetiary + hexOpacity(50),
                  }}
                  value={startDate ? [dayjs(startDate), dayjs(endDate)] : undefined}
                  onChange={(dates) => {
                    if (dates) {
                      setStartDate(dates[0].toISOString().split('T')[0]);
                      setEndDate(dates[1].toISOString().split('T')[0]);
                    } else {
                      resetDate();
                    }
                  }}
                />
                <div className="w-full gap-2 flex items-center mt-1">
                  <Button 
                    text={isPlaying ? "Pause" : "Play"}
                    icon={isPlaying ? <FaPause size={10} /> : <FaPlay size={10} />}
                    onClick={handlePlayClick}
                    className="!h-[30px] !py-0"
                  />
                  <OutlineButton 
                    text="Reset"
                    icon={<MdOutlineRefresh size={15} />}
                    onClick={handleReset}
                    className="!h-[30px] !py-0 !px-2"
                  />
                </div>
              </div>
            </BlurContainer>
    )
}
export default Timeline