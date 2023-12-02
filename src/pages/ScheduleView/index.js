import React from "react";
import { Tabs } from 'antd';
import { useSelector } from "react-redux";

import Schedule from './ScheduleView';
import Absent from './AbsentView';
import CalendarView from './CalendarView'
import AddSchedule from './AddSchedule'
import ScheduleReport from "../Report/ScheduleReport/ScheduleReport";

const ScheduleView = () => {

  const isLoading = useSelector(state => state.scheduleview.loading);

  const onChange = (key) => {
    console.log(key);
  };

  const items = [
    {
        key: '1',
        label: 'Schedule View',
        children: <Schedule />
    },
  ];

  if (isLoading === false) {
    items.push({
      key: '2',
      label: 'Add Schedule',
      children: <AddSchedule />
    });
    items.push({
      key: '3',
      label: 'Absent',
      children: <Absent />
    });
  }

  /*
  const items = [
    {
      key: '1',
      label: `Tab 1`,
      children: `Content of Tab Pane 1`,
    },
    {
      key: '2',
      label: `Tab 2`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: '3',
      label: `Tab 3`,
      children: `Content of Tab Pane 3`,
    },
  ];
*/
  return (
    <Tabs style={{margin:"10px"}} defaultActiveKey="1" items={items} onChange={onChange} />
  )
}

export default ScheduleView