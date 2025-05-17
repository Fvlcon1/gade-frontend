import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { MdPieChart } from "react-icons/md";
import Text from "@styles/components/text";
import theme from "@styles/theme";

const FactCard = () => {
  return (
    <div
      className="w-[356px] h-[138px] rounded-[15px] p-4 relative overflow-hidden flex flex-col justify-between"
      style={{ backgroundColor: "rgba(236, 236, 247, 1)" }}
    >
      {/* Decorative Circles */}
      <div className="absolute top-[-50px] right-[35px] w-[85px] h-[85px] bg-[#FF9500] rounded-full z-0" />
      <div className="absolute bottom-[-40px] left-[-20px] w-[85px] h-[85px] bg-[#18B2A5] rounded-full z-0" />

      {/* Main Content and Info Pill */}
      <div className="flex flex-col gap-2 items-start z-10">
        <div className="flex items-center gap-3">
          <div className="w-[58px] h-[46px] bg-[#E4DBF6] rounded-full flex items-center justify-center">
            <MdPieChart className="text-[#4C1D95] text-lg" size={25} />
          </div>
          <div className="flex flex-col text-sm justify-center">
            <p>
              <Text
                size={theme.text.size.SM}
                bold={theme.text.bold.lg}
                className="!text-[var(--color-main-primary)]"
              >
                Local Impact
              </Text>
            </p>
            <Text>
              Our reports have protected{" "}
              <span>
                <Text
                  size={theme.text.size.SM}
                  bold={theme.text.bold.lg}
                  className="!text-[var(--color-main-primary)]"
                >
                  42km
                </Text>
              </span>{" "}
              of land area this year
            </Text>
          </div>
        </div>

        {/* Info Pill */}
        <div className="h-[30px] absolute bottom-8 left-[63px] px-[6px] py-1 bg-[var(--color-bg-tetiary)] rounded-full flex items-center gap-1 w-[254px]">
          <FaInfoCircle className="text-[#4C1D95] text-sm" size={15} />
          <Text
            size={theme.text.size.SM}
            bold={theme.text.bold.sm}
            className="!text-[var(--color-main-primary)]"
          >
            Pulled from
          </Text>
          <span>
            <Text
              size={theme.text.size.SM}
              bold={theme.text.bold.md}
              className="!text-[var(--color-main-primary)]"
            >
              GADE's
            </Text>
          </span>{" "}
          <Text
            size={theme.text.size.SM}
            bold={theme.text.bold.sm}
            className="!text-[var(--color-main-primary)]"
          >
            geospatial data
          </Text>
        </div>
      </div>
    </div>
  );
};

export default FactCard;
