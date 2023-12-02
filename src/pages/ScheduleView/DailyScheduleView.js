import React, { useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, IconButton } from '@material-ui/core';
import { Visibility } from '@material-ui/icons';

const DailyScheduleView = ({ schedules, handleClick }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const startSchedule = page * rowsPerPage;
  const endSchedule = startSchedule + rowsPerPage;
  const schedulesToShow = schedules.slice(startSchedule, endSchedule);

  if (schedules.length === 0) {
    return <div>No schedules to display.</div>;
  }

  // Convert start_time and end_time to Date objects
  const scheduleDates = schedulesToShow.map(schedule => ({
    ...schedule,
    start_time: new Date(schedule.start_date).getHours().toString().padStart(2, '0'),
    end_time: new Date(schedule.end_date).getHours().toString().padStart(2, '0')
  }));

  // Define click handler for each card
  const handleCardClick = (schedule) => {
    console.log('Clicked on schedule:', schedule);
    // Do something when a card is clicked, e.g. show a modal with details
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scheduleDates.map((schedule, index) => (
              <TableRow key={index} style={{ cursor: 'pointer' }} onClick={() => handleCardClick(schedule)}>
                <TableCell component="th" scope="row" style={{ padding: '2px', paddingLeft: '15px', fontSize: '14px' }}>
                  {schedule.title}
                </TableCell>
                <TableCell style={{ padding: '2px', fontSize: '14px' }}>{new Date(schedule.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                <TableCell style={{ padding: '2px', fontSize: '14px' }}>{new Date(schedule.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleClick(schedule)}>
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={schedules.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        style={{ marginTop: '10px' }}
      />
      </TableContainer>
      
    </div>
  );
};

export default DailyScheduleView;