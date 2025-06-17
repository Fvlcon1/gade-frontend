'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import Text, { Head1 } from '@/app/styles/components/text';
import { TypographySize, TypographyBold } from '@styles/style.types';
import { MapPin } from 'lucide-react';

// Dummy data for segmentation details
const segmentationDetails = {
  'SEG-2024-03': {
    id: 'SEG-2024-03',
    date: '2024-03-03',
    detections: [
      {
        id: 'DET-001',
        severity: 'HIGH',
        severityType: 'Oversized',
        area: '1.2 km²',
        centroid: '5.6037° N, 0.1870° W',
        location: 'Accra, Ghana'
      },
      {
        id: 'DET-002',
        severity: 'MEDIUM',
        severityType: 'Concession Violation',
        area: '0.8 km²',
        centroid: '5.6037° N, 0.1870° W',
        location: 'Kumasi, Ghana'
      },
      {
        id: 'DET-003',
        severity: 'LOW',
        severityType: 'River Violation',
        area: '0.5 km²',
        centroid: '5.6037° N, 0.1870° W',
        location: 'Tamale, Ghana'
      },
      {
        id: 'DET-004',
        severity: 'HIGH',
        severityType: 'Forest Reserve Violation',
        area: '1.5 km²',
        centroid: '5.6037° N, 0.1870° W',
        location: 'Cape Coast, Ghana'
      },
      {
        id: 'DET-005',
        severity: 'MEDIUM',
        severityType: 'Undersized',
        area: '0.3 km²',
        centroid: '5.6037° N, 0.1870° W',
        location: 'Sekondi-Takoradi, Ghana'
      }
    ]
  }
};

const severityColors = {
  HIGH: '#B91C1C',
  MEDIUM: '#92400E',
  LOW: '#166534'
};

const SegmentationDetailPage = () => {
  const params = useParams();
  const segmentation = segmentationDetails[params.id as string];

  if (!segmentation) {
    return (
      <div className="p-6">
        <Text textColor="rgb(107 114 128)" size={TypographySize.body}>
          Segmentation not found
        </Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Head1 textColor="rgb(31 41 55)" size={TypographySize.HL} bold={TypographyBold.lg}>
          Segmentation Details
        </Head1>
        <Text textColor="rgb(107 114 128)" size={TypographySize.body}>
          {new Date(segmentation.date).toLocaleDateString()}
        </Text>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="px-6 py-3 text-left">
                  <Text textColor="rgb(107 114 128)" size={TypographySize.body} bold={TypographyBold.md}>
                    Detection ID
                  </Text>
                </th>
                <th className="px-6 py-3 text-left">
                  <Text textColor="rgb(107 114 128)" size={TypographySize.body} bold={TypographyBold.md}>
                    Severity
                  </Text>
                </th>
                <th className="px-6 py-3 text-left">
                  <Text textColor="rgb(107 114 128)" size={TypographySize.body} bold={TypographyBold.md}>
                    Severity Type
                  </Text>
                </th>
                <th className="px-6 py-3 text-left">
                  <Text textColor="rgb(107 114 128)" size={TypographySize.body} bold={TypographyBold.md}>
                    Area
                  </Text>
                </th>
                <th className="px-6 py-3 text-left">
                  <Text textColor="rgb(107 114 128)" size={TypographySize.body} bold={TypographyBold.md}>
                    Centroid
                  </Text>
                </th>
                <th className="px-6 py-3 text-left">
                  <Text textColor="rgb(107 114 128)" size={TypographySize.body} bold={TypographyBold.md}>
                    Location
                  </Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {segmentation.detections.map((detection) => (
                <tr key={detection.id} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]">
                  <td className="px-6 py-4">
                    <Text textColor="rgb(31 41 55)" size={TypographySize.body}>
                      {detection.id}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text textColor={severityColors[detection.severity]} size={TypographySize.body}>
                      {detection.severity}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text textColor="rgb(31 41 55)" size={TypographySize.body}>
                      {detection.severityType}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text textColor="rgb(31 41 55)" size={TypographySize.body}>
                      {detection.area}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text textColor="rgb(31 41 55)" size={TypographySize.body}>
                      {detection.centroid}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <Text textColor="rgb(31 41 55)" size={TypographySize.body}>
                        {detection.location}
                      </Text>
                    </div>
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

export default SegmentationDetailPage; 