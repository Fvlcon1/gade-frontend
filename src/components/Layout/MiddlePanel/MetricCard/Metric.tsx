import React from 'react'
import TotalReportsCard from './TotalReportsCard'
import ResponseTimeCard from './ResponseTimeCard'
import ResolvedCasesCard from './ResolvedCasesCard'
import ActiveAlertsCard from './ActiveAlertsCard'

const Metric = () => {
  return (
    <div className='w-[934px] h-[94px] flex justify-between items-center mt-2'>
      <TotalReportsCard />
      <ResponseTimeCard />
      <ActiveAlertsCard />
      <ResolvedCasesCard />
    </div>
  )
}

export default Metric
