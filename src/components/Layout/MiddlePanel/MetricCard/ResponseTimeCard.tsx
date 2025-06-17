'use client';
import React from "react";
import Image from "next/image";

const ResponseTimeCard = () => {
  return (
    <div className="relative w-[214px] h-[99px] rounded-[15px] overflow-hidden">
      <Image
        src="/assets/Mid/metric-card-1.png"
        alt="Response Time Card"
        fill
        className="object-cover rounded-[15px]"
        priority
      />
    </div>
  );
};

export default ResponseTimeCard;
