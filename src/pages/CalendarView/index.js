import React from 'react'
import Tabs from '../../components/Tabs'
import VisitingReason from './VisitingReason/index.js'
import Outcome from './Outcome/index.js'
import ScheduleReport from '../Report/ScheduleReport/ScheduleReport'
import CalendarView from '../ScheduleView/CalendarView'

const ITEMS = [
    {
      title: 'Daily Report',
      component: <CalendarView />
    }
]

const CalendarViewPage = () => {
  return (
    <Tabs items={ITEMS} />
  )
}

export default CalendarViewPage