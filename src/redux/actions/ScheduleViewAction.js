import {
    FETCH_SCHEDULEVIEW_REQUEST,
    FETCH_SCHEDULEVIEW_SUCCESS,
    FETCH_SCHEDULEVIEW_ERROR
  } from '../constants'
  
  export function fetchScheduleViewRequest() {
      return {
          type: FETCH_SCHEDULEVIEW_REQUEST
      }
  }
  
  export function fetchScheduleViewSuccess(scheduleview) {
    console.log("action===>", scheduleview)
      return {
          type: FETCH_SCHEDULEVIEW_SUCCESS,
          scheduleview: scheduleview
      }
  }
  
  export function fetchScheduleViewError(error) {
      return {
          type: FETCH_SCHEDULEVIEW_ERROR,
          error: error
      }
  }