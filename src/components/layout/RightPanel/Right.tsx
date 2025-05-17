import React from 'react'
import FactCard from './FactCard'
import Divider from '@components/ui/divider/divider'
import RecentActivities from './RecentActivities'
import WorstAffectedRegions from './WorstAffectedRegions'

const Right = () => {
  return (
    <div className='right-0 bg-[var(--color-bg-primary-lighter)] w-[390px] h-screen pl-4 py-3 flex flex-col'>
      
      {/* Fixed Section */}
      <FactCard />

      {/* Scrollable Section below */}
      <div className='mt-[25px] flex-1 overflow-y-auto hide-scrollbar'>
        <Divider className='w-[373px] border-[#EBEBEB] border' />
        <RecentActivities />
        <div className='mt-[17px]'>
          <Divider className='w-[373px] border-[#EBEBEB] border' />
        </div>
        <WorstAffectedRegions />
      </div>
    </div>
  )
}

export default Right
