import React from "react";
import Tabs from '../../components/Tabs'
import Schedule from './ScheduleView'
import CalendarView from './CalendarView'
import AddSchedule from './AddSchedule'
import ScheduleReport from "../Report/ScheduleReport/ScheduleReport";

const ITEMS = [
    {
        title: 'Schedule View',
        component: <Schedule />
    },
    {
        title: 'Add Schedule',
        component: <AddSchedule />
    },
    /*
    {
      title: 'Daily Schedule',
      component: <CalendarView />
    }*/
  ]

const ScheduleView = () => {
  return (
    <Tabs items={ITEMS} />
  )
}

export default ScheduleView