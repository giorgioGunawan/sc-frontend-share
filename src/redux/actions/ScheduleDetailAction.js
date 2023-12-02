import {
    FETCH_SCHEDULE_DETAIL_REQUEST,
    FETCH_SCHEDULE_DETAIL_SUCCESS,
    FETCH_SCHEDULE_DETAIL_ERROR
  } from '../constants'
  
  export function fetchScheduleDetailRequest() {
      return {
          type: FETCH_SCHEDULE_DETAIL_REQUEST
      }
  }
  
  export function fetchScheduleDetailSuccess(schedule) {
    console.log("action===>", schedule)
      return {
          type: FETCH_SCHEDULE_DETAIL_SUCCESS,
          schedule: schedule
      }
  }
  
  export function fetchScheduleDetailError(error) {
      return {
          type: FETCH_SCHEDULE_DETAIL_ERROR,
          error: error
      }
  }