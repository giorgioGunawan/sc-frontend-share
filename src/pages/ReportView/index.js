import React from 'react'
import Tabs from '../../components/Tabs'
import VisitingReason from './VisitingReason/index.js'
import Outcome from './Outcome/index.js'
import ScheduleReport from '../Report/ScheduleReport/ScheduleReport'

const ITEMS = [
    {
      title: 'Schedule Report',
      component: <ScheduleReport />
    },
    {
      title: 'Outcome Report',
      component: <Outcome />
    },
    {
        title: 'Visiting Reason',
        component: <VisitingReason />
    },   
]

const ReportView = () => {
  return (
    <Tabs items={ITEMS} />
  )
}

export default ReportView