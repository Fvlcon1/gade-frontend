import React from 'react'
import Image from "next/image";

const ActiveAlertsCard = () => {
  return (
      <div className="relative w-[214px] h-[99px] rounded-[15px] overflow-hidden">
        <Image
          src="/assets/Mid/metric%20card%20(2).png" // URL-encoded space
          alt="Resolved Cases Card"
          fill
          className="object-cover rounded-[15px]"
          priority
        />
      </div>
    );
}

export default ActiveAlertsCard
