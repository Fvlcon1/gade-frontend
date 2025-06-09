import React from 'react';
import { Users } from 'lucide-react';
import { IconUser, IconUserOff, IconUserPlus } from "@tabler/icons-react";

// --- MetricDisplayCard component ---
const MetricDisplayCard = ({ title, value, icon: IconComponent, iconBgColor, textColor }) => (
  <div className="flex flex-col p-6 bg-white rounded-xl shadow-sm relative overflow-hidden">
    {/* Background shape - adjusting size and position for a more subtle curve */}
    <div className={`absolute -top-8 -right-8 w-28 h-28 ${iconBgColor} rounded-full`}></div>
    {/* Icon container - positioned closer to the corner, directly on the background */}
    <div className={`absolute top-4 right-4 z-10 flex items-center justify-center`}>
      <IconComponent className={`w-6 h-6 ${textColor}`} />
    </div>
    <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </div>
);

interface MetricCardsProps {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  pendingInvites: number;
}

const MetricCards: React.FC<MetricCardsProps> = ({
  totalUsers,
  activeUsers,
  inactiveUsers,
  pendingInvites,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <MetricDisplayCard 
        title="Total Users" 
        value={totalUsers.toString()} 
        icon={Users} 
        iconBgColor="bg-purple-100" 
        textColor="text-purple-600" 
      />
      <MetricDisplayCard 
        title="Active Users" 
        value={activeUsers.toString()} 
        icon={IconUser} 
        iconBgColor="bg-green-100" 
        textColor="text-green-600" 
      />
      <MetricDisplayCard 
        title="Inactive Users" 
        value={inactiveUsers.toString()} 
        icon={IconUserOff} 
        iconBgColor="bg-red-100" 
        textColor="text-red-600" 
      />
      <MetricDisplayCard 
        title="Pending Invites" 
        value={pendingInvites.toString()} 
        icon={IconUserPlus} 
        iconBgColor="bg-yellow-100" 
        textColor="text-yellow-600" 
      />
    </div>
  );
};

export default MetricCards; 