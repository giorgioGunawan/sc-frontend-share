import React, { useState } from 'react'
import { Box, Button, FormControl, Grid } from '@material-ui/core';
import useStyles from '../styles'
import CustomDatePicker from '../../../components/FormControls/CustomDatePicker';
import ListOutcome from './List.js';
import { DatePicker } from '@material-ui/pickers';
import { Cached, Clear, KeyboardBackspace, RotateLeft } from '@material-ui/icons';
import DetailOutcome from './Detail';

const OutcomeTab = () => {
    const classes = useStyles();
    const [selectedScreen, setSelectedScreen] = useState(1)
    const [selectedId, setSelectedId] = useState(null)
    const [filter, setFilter] = useState({
        start_date: null,
        end_date: null
    })
    const handleStartDateChange = (value) => {
      setFilter({
        start_date: value,
        end_date: null
      })
    }
    const handleEndDateChange = (value) => {
      setFilter({
        ...filter,
        end_date: value
      })
    }
    const handleDateReset = () => {
      setFilter({
        start_date: null,
        end_date: null
      })
    }
    const handleClickDetail = (id) => {
      setSelectedScreen(2)
      setSelectedId(id)
    }
    const handleBack = () => {
      setSelectedScreen(1)
      setSelectedId(null)
    }
  return (
    <div>
        <Grid container justifyContent='space-between' spacing={1} className={classes.tableWrapper}>
          <div style={{display: 'flex'}}>
            <div>
              <Box sx={{
                  px: 1
              }}>
                  <FormControl fullWidth>
                      <DatePicker
                          format="MMMM do yyyy"
                          disableFuture
                          label="Start Date"
                          variant="inline"
                          value={filter.start_date}
                          clearable={true}
                          onChange={handleStartDateChange}
                      />
                  </FormControl>
              </Box>
            </div>
            <div>
                <Box sx={{
                    px: 1
                }}>
                    <FormControl fullWidth>
                        <DatePicker
                            format="MMMM do yyyy"
                            minDate={filter.start_date}
                            disabled={filter.start_date ? false : true}
                            disableFuture
                            label="End Date"
                            variant="inline"
                            value={filter.end_date}
                            clearable={true}
                            onChange={handleEndDateChange}
                        />
                    </FormControl>
                </Box>
            </div>
            <Cached onClick={handleDateReset} style={{ alignSelf: 'end', cursor: 'pointer', marginLeft: '8px'}} />
          </div>
          {
            selectedScreen === 2 && (
              <Button
                onClick={handleBack}
                variant="contained"
                color="info"
                className={classes.button}
                startIcon={<KeyboardBackspace />}
              >
                Back
              </Button>
            )
          }
        </Grid>
        {
          selectedScreen === 1 ? (
            <ListOutcome filter={filter} onClickDetail={handleClickDetail} />
          ) 
          : selectedScreen === 2 ? (
            <DetailOutcome filter={filter} outcomeId={selectedId} />
          )
          : null
        }
    </div>
  )
}

export default OutcomeTab