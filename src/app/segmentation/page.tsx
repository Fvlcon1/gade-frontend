'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Text, { Head1 } from '@/app/styles/components/text';
import { TypographySize, TypographyBold } from '@styles/style.types';
import { IconReport, IconAlertCircle, IconClock } from "@tabler/icons-react";

// Dummy data for segmentations
const segmentations = [
  {
    id: 'SEG-2024-03',
    date: '2024-03-03',
    totalDetections: 156,
    highSeverity: 23,
    mediumSeverity: 45,
    lowSeverity: 88,
    totalArea: '2,345 km²',
    status: 'completed'
  },
  {
    id: 'SEG-2024-02',
    date: '2024-02-03',
    totalDetections: 142,
    highSeverity: 18,
    mediumSeverity: 52,
    lowSeverity: 72,
    totalArea: '2,123 km²',
    status: 'completed'
  },
  {
    id: 'SEG-2024-01',
    date: '2024-01-03',
    totalDetections: 167,
    highSeverity: 31,
    mediumSeverity: 48,
    lowSeverity: 88,
    totalArea: '2,567 km²',
    status: 'completed'
  },
  {
    id: 'SEG-2023-12',
    date: '2023-12-03',
    totalDetections: 189,
    highSeverity: 42,
    mediumSeverity: 67,
    lowSeverity: 80,
    totalArea: '2,789 km²',
    status: 'completed'
  }
];

const SegmentationPage = () => {
  const router = useRouter();

  const handleSegmentationClick = (id: string) => {
    router.push(`/segmentation/${id}`);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Head1 textColor="rgb(31 41 55)" size={TypographySize.HL} bold={TypographyBold.lg}>
          Segmentation Analysis
        </Head1>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#E6E6FA] flex items-center justify-center">
              <IconReport className="text-[#800080]" size={20} />
            </div>
            <div>
              <Text textColor="rgb(107 114 128)" size={TypographySize.body}>
                Total Segmentations
              </Text>
              <Text textColor="rgb(31 41 55)" size={TypographySize.HM} bold={TypographyBold.md}>
                {segmentations.length}
              </Text>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFE5E5] flex items-center justify-center">
              <IconAlertCircle className="text-[#B91C1C]" size={20} />
            </div>
            <div>
              <Text textColor="rgb(107 114 128)" size={TypographySize.body}>
                Total Detections
              </Text>
              <Text textColor="rgb(31 41 55)" size={TypographySize.HM} bold={TypographyBold.md}>
                {segmentations.reduce((acc, seg) => acc + seg.totalDetections, 0)}
          </Text>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] flex items-center justify-center">
              <IconClock className="text-[#166534]" size={20} />
            </div>
            <div>
              <Text textColor="rgb(107 114 128)" size={TypographySize.body}>
                Last Analysis
              </Text>
              <Text textColor="rgb(31 41 55)" size={TypographySize.HM} bold={TypographyBold.md}>
                {new Date(segmentations[0].date).toLocaleDateString()}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="px-6 py-3 text-left">
                  <Text textColor="rgb(107 114 128)" size={TypographySize.body} bold={TypographyBold.md}>
                    Segmentation ID
                  </Text>
                </th>
                <th className="px-6 py-3 text-left">
                  <Text textColor="rgb(107 114 128)" size={TypographySize.body} bold={TypographyBold.md}>
                    Date
                  </Text>
                </th>
                <th className="px-6 py-3 text-left">
                  <Text textColor="rgb(107 114 128)" size={TypographySize.body} bold={TypographyBold.md}>
                    Total Detections
                  </Text>
                </th>
                <th className="px-6 py-3 text-left">
                  <Text textColor="rgb(107 114 128)" size={TypographySize.body} bold={TypographyBold.md}>
                    High Severity
                  </Text>
                </th>
                <th className="px-6 py-3 text-left">
                  <Text textColor="rgb(107 114 128)" size={TypographySize.body} bold={TypographyBold.md}>
                    Medium Severity
                  </Text>
                </th>
                <th className="px-6 py-3 text-left">
                  <Text textColor="rgb(107 114 128)" size={TypographySize.body} bold={TypographyBold.md}>
                    Low Severity
                  </Text>
                </th>
                <th className="px-6 py-3 text-left">
                  <Text textColor="rgb(107 114 128)" size={TypographySize.body} bold={TypographyBold.md}>
                    Total Area
                  </Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {segmentations.map((seg) => (
                <tr 
                  key={seg.id}
                  className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] cursor-pointer"
                  onClick={() => handleSegmentationClick(seg.id)}
                >
                  <td className="px-6 py-4">
                    <Text textColor="rgb(31 41 55)" size={TypographySize.body}>
                      {seg.id}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text textColor="rgb(31 41 55)" size={TypographySize.body}>
                      {new Date(seg.date).toLocaleDateString()}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text textColor="rgb(31 41 55)" size={TypographySize.body}>
                      {seg.totalDetections}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text textColor="#B91C1C" size={TypographySize.body}>
                      {seg.highSeverity}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text textColor="#92400E" size={TypographySize.body}>
                      {seg.mediumSeverity}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text textColor="#166534" size={TypographySize.body}>
                      {seg.lowSeverity}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text textColor="rgb(31 41 55)" size={TypographySize.body}>
                      {seg.totalArea}
          </Text>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SegmentationPage; 