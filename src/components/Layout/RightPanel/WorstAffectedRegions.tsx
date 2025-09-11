import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { MdBarChart } from "react-icons/md";
import { affectedRegions } from "@/data/affectedRegions";
import Text from "@styles/components/text";
import theme from "@styles/theme";
import Divider from "@components/ui/divider/divider";

// Logarithmic width scaling function
function getBarWidth(value: number, max: number): string {
  const minWidth = 50; // percent
  const maxWidth = 100;
  const logValue = Math.log(value + 1);
  const logMax = Math.log(max + 1);
  const percent = minWidth + ((logValue / logMax) * (maxWidth - minWidth));
  return `${percent}%`;
}

const WorstAffectedRegions = () => {
  const maxValue = Math.max(...affectedRegions.map((r) => r.value));

  return (
    <div className="w-[354px] h-[265px] rounded-[10px] flex flex-col justify-between mt-10">
      
      <div className="flex items-center w-[164px] h-[18px] justify-between">
        <div className="w-[18px] h-[18px] bg-[var(--main-primary-20)] rounded-md flex items-center justify-center">
          <MdBarChart className="text-[var(--color-main-primary)]" size={13} />
        </div>
        <Text
          bold={theme.text.bold.md}
          className="!text-[var(--color-main-primary)]"
        >
          Worst affected regions
        </Text>
      </div>

      
      <div className="flex flex-col gap-[10px] mt-4">
        {affectedRegions.map((region) => (
          <div
            key={region.id}
            className="relative flex items-center h-[40px] text-sm"
          >
            <div
              className="bg-[var(--color-main-primary)] rounded-[100px] flex justify-between items-center px-4 py-2 w-full max-w-full"
              style={{
                width: getBarWidth(region.value, maxValue),
              }}
            >
              <div className="flex items-center gap-3 text-white font-medium">
                <span className="w-5 h-5 text-white flex items-center justify-center">
                  <Text
                    bold={theme.text.bold.lg}
                    className="!text-[#ffffff]"
                  >
                    {region.id}
                  </Text>
                </span>
                <span>{region.name}</span>
              </div>

              <div className="w-[58px] h-[24px] flex items-center justify-center">
  <span className="bg-white text-[var(--color-main-primary)] rounded-[100px] text-xs font-semibold p-[6px]">
    {region.value}km²
  </span>
</div>

            </div>
          </div>
        ))}
      </div>


      <div className="flex items-center gap-2 mt-3 bg-[var(--color-bg-tetiary)] text-[var(--color-main-primary)] rounded-full px-3 py-1 w-fit min-h-[32px]">
        <FaInfoCircle size={12} />
        <Text
          bold={theme.text.bold.sm}
          className="!text-[var(--color-main-primary)]"
        >
          Most recent update: <span className="font-semibold">A week ago</span>
        </Text>
      </div>

<Divider />

      <div className="mt-[50px] w-full h-[33px] flex justify-center items-center ">
          <Text
          bold={theme.text.bold.sm}
          className="!text-[var(--color-main-primary)]"
        >
          © 2025 GADE
        </Text>
      </div>
    </div>
  );
};

export default WorstAffectedRegions;
