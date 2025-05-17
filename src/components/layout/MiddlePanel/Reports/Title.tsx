import React from 'react';
import { MdMap } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import Text from "@styles/components/text";
import theme from "@styles/theme";
import ClickableTab from "@components/ui/clickable/clickabletab";

const Title = () => {
return ( <div className="w-full max-w-[775px] h-[30px] flex items-center space-x-3 mt-5 ">
<div className=" text-[var(--text-primary)] h-[30px] rounded-full flex items-center px-2 flex-shrink-0"> <ClickableTab> <div className="w-[25px] h-[25px] bg-[var(--main-primary-20)] rounded-[5px] flex items-center justify-center mr-2"> <MdMap size={14} className="text-[var(--main-primary)]" /> </div> </ClickableTab> <Text 
       size={theme.text.size.SM} 
       bold={theme.text.bold.md} 
       className="!text-[var(--color-main-primary)]"
     >
Recent Reports </Text> </div>

{/* Alert Message */}
  <div className="flex items-center h-full flex-grow bg-[var(--bg-secondary)] rounded-full px-[6px]">
    <div className="w-[25px] h-[25px] bg-[var(--main-primary-20)] rounded-full flex items-center justify-center mr-2 flex-shrink-0">
      <ClickableTab>
        <FaInfoCircle size={14} className="text-[var(--main-primary)]" />
      </ClickableTab>
    </div>
    <Text 
      size={theme.text.size.SM} 
      bold={theme.text.bold.sm} 
      className="!text-[var(--color-main-primary)]"
    >
      200% increase in illegal mining activity detected this month compared to the previous data.
    </Text>
  </div>
</div>


);
};

export default Title;