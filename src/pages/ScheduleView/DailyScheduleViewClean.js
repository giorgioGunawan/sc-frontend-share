import React, { useState } from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import 'slick-carousel/slick/slick.css';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import 'slick-carousel/slick/slick-theme.css';

const DailyScheduleViewClean = ({ schedules }) => {
  const alwaysVisibleScroll = {
    
  } 
  const [page, setPage] = useState(1);
  const schedulesPerPage = 10;
  const totalSchedules = schedules.length;
  const totalPages = Math.ceil(totalSchedules / schedulesPerPage);
  const startSchedule = (page - 1) * schedulesPerPage;
  const endSchedule = startSchedule + schedulesPerPage;
  const schedulesToShow = schedules.slice(startSchedule, endSchedule);

  if (totalSchedules === 0) {
    return (
      <div style={{height: "500px",
        margin: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
      }}>
        <div style={{fontSize: "20px", flex: 1, transform: "translate(125%, 0)"}}>
          <HourglassEmptyIcon style={{transform: "scale(3)"}}/>
          <h3>No schedules to display yet.</h3>
        </div>
      </div>
    );
  }

  // Convert start_time and end_time to Date objects
  const scheduleDates = schedulesToShow.map((schedule) => ({
    ...schedule,
    start_time: new Date(schedule.start_date)
      .getHours()
      .toString()
      .padStart(2, '0'),
    end_time: new Date(schedule.end_date)
      .getHours()
      .toString()
      .padStart(2, '0'),
  }));

  // Define click handler for each card
  const handleCardClick = (schedule) => {
    console.log('Clicked on schedule:', schedule);
    // Do something when a card is clicked, e.g. show a modal with details
  };

  // Render a card for each schedule
  return (
    <Card style={{backgroundColor: "#EAEAEA", borderTopRightRadius: 0, borderBottomRightRadius: 0}}>
      <div style={{ fontSize:'20px', fontWeight:'500', fontFamily:'inherit', paddingTop: '10px', paddingLeft: '10px' }}>
        Visits List
      </div>
      <div style={{ height: '700px', overflowY: 'scroll', overflowY: 'overlay', scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,.5) transparent' }}>
        <style>
          {`
            ::-webkit-scrollbar {
              -webkit-appearance: none;
              width: 5px;
            }
            ::-webkit-scrollbar-thumb {
              border-radius: 5px;
              background-color: rgba(0,0,0,.5);
              -webkit-box-shadow: 0 0 1px rgba(0,0,0,.5);
            }
          `}
        </style>
        {scheduleDates.map((schedule, index) => (
          <Card key={index} style={{ margin: '10px', cursor: 'pointer' }} onClick={() => handleCardClick(schedule)}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {schedule.title}
              </Typography>
              <Typography color="textSecondary">
                {new Date(schedule.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                {new Date(schedule.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
              <Typography variant="body2" component="p">
                {schedule.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default DailyScheduleViewClean;