import React from 'react';
import Text from "@styles/components/text";
import theme from "@styles/theme";
import { PiPulseBold } from "react-icons/pi";
import { recentActivities } from "@/data/recentActivities";

const RecentActivities = () => {
  return (
    <div className="mt-5">
     
      <div className="flex items-center gap-2 mb-4">
        <div className="w-[22px] h-[22px] bg-[var(--main-primary-20)] rounded-md flex items-center justify-center">
          <PiPulseBold className="text-[var(--color-main-primary)]" size={13} />
        </div>
        <Text
          bold={theme.text.bold.md}
          className="!text-[var(--color-main-primary)]"
        >
          Recent Activity
        </Text>
      </div>

      
      <div className="flex flex-col gap-4">
        {recentActivities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center gap-3 relative w-[373px] h-[60px]"
          >
            
            <div className="w-9 h-9 rounded-full bg-[var(--color-main-primary)] flex items-center justify-center shrink-0">
              {activity.icon}
            </div>

            
            <div className="flex flex-col justify-center h-full overflow-hidden">
              {activity.title}
              <div className="mt-[2px]">{activity.time}</div>
            </div>

            
            {index !== recentActivities.length - 1 && (
              <div className="absolute bottom-[-12px] left-[42px] w-[calc(100%-42px)] border-t border-[var(--color-border-primary)]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;
