'use client';
import React from "react";
import Image from "next/image";

const ResolvedCasesCard = () => {
  return (
    <div className="relative w-[214px] h-[99px] rounded-[15px] overflow-hidden">
      <Image
        src="/assets/Mid/metric%20card%20(4).png" // URL-encoded space
        alt="Resolved Cases Card"
        fill
        className="object-cover rounded-[15px]"
        priority
      />
    </div>
  );
};

export default ResolvedCasesCard;
