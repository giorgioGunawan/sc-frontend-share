import {
    FETCH_SCHEDULE_REQUEST,
    FETCH_SCHEDULE_SUCCESS,
    FETCH_SCHEDULE_ERROR
  } from '../constants'
  
  export function fetchScheduleRequest() {
      return {
          type: FETCH_SCHEDULE_REQUEST
      }
  }
  
  export function fetchScheduleSuccess(schedule) {
    console.log("action===>", schedule)
      return {
          type: FETCH_SCHEDULE_SUCCESS,
          schedule: schedule
      }
  }
  
  export function fetchScheduleError(error) {
      return {
          type: FETCH_SCHEDULE_ERROR,
          error: error
      }
  }