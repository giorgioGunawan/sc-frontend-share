import React from 'react'
import { Tabs } from 'antd';
import VisitingReason from './VisitingReason/index.js'
import Outcome from './Outcome/index.js'
import ScheduleReport from '../Report/ScheduleReport/ScheduleReport'
import CalendarView from '../ScheduleView/CalendarView'

const ITEMS = [
    {
      key: '1',
      label: 'Schedule Report',
      children: <ScheduleReport />
    },
    {
      key: '2',
      label: 'Outcome Report',
      children: <Outcome />
    },
    {
        key: '3',
        label: 'Visiting Reason',
        children: <VisitingReason />
    },
]

const ReportView = () => {
  return (
    <Tabs style={{margin:"10px"}} defaultActiveKey="1" items={ITEMS} />
  )
}

export default ReportView