import React from 'react'
import Image from "next/image";

const ActiveAlertsCard = () => {
  return (
      <div className="relative w-[214px] h-[99px] rounded-[15px] overflow-hidden">
        <Image
          src="/assets/Mid/metric-card-3.png"
          alt="Resolved Cases Card"
          fill
          className="object-cover rounded-[15px]"
          priority
        />
      </div>
    );
}

export default ActiveAlertsCard
