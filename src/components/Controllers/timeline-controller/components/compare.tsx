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

const Compare = ({
    resetDate,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    onCompare,
}) => {
    return (
        <BlurContainer>
              <div className="flex flex-col w-full p-3 gap-0.5">
                <Text 
                  bold={theme.text.bold.md}
                  className="pl-1"
                >
                  Dual date comparison
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
                  <Button 
                    text="Compare"
                    onClick={() => {
                      if (onCompare && startDate && endDate) onCompare(startDate, endDate);
                    }}
                    className="!h-[30px] !py-0 mt-1"
                  />
              </div>
            </BlurContainer>
    )
}
export default Compare