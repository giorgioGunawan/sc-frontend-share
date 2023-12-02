import React from 'react';
import MUIDataTable from "mui-datatables";

const DailyScheduleView = ({ schedules }) => {
  if (schedules.length === 0) {
    return <div>No schedules to display.</div>;
  }

  // Convert start_time and end_time to Date objects
  const scheduleDates = schedules.map(schedule => ({
    ...schedule,
    start_time: new Date(schedule.start_date).getHours().toString().padStart(2, '0'),
    end_time: new Date(schedule.end_date).getHours().toString().padStart(2, '0')
  }));

  // Sort the schedules by start time
  scheduleDates.sort((a, b) => a.start_date - b.start_date);

  // Group the schedules by overlapping time slots
  const scheduleGroups = [];
  let currentGroup = [];
  let lastEndTime = null;
  scheduleDates.forEach(schedule => {
    if (lastEndTime && schedule.start_date > lastEndTime) {
      // Schedule starts after the last one ended, so start a new group
      scheduleGroups.push(currentGroup);
      currentGroup = [];
    }
    currentGroup.push(schedule);
    lastEndTime = schedule.end_date;
  });
  scheduleGroups.push(currentGroup);

  // Define the columns for the MUIDataTable
  const columns = [
    {
      name: "client",
      label: "Client",
    },
    {
      name: "start_time",
      label: "Check-in"
    },
    {
      name: "end_time",
      label: "Check-out"
    }
  ];

  // Define the data for the MUIDataTable
  const data = scheduleDates.map(group => ({
    client: group.title,
    start_time: group.start_time,
    end_time: group.end_time
  }));

  console.log('ggdg',data);

  // Define options for the MUIDataTable
  const options = {
    filter: false,
    print: false,
    download: false,
    viewColumns: false,
    selectableRows: false,
  };

  // Render the MUIDataTable
  return (
    <MUIDataTable
      title="Daily Schedule"
      columns={columns}
      data={data}
      options={options}
    />
  );
};

export default DailyScheduleView;
