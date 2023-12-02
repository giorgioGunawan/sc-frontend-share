import {
    FETCH_MAP_TRACKER_HISTORIES_REQUEST,
    FETCH_MAP_TRACKER_HISTORIES_SUCCESS,
    FETCH_MAP_TRACKER_HISTORIES_ERROR
  } from '../constants'
   
  export function fetchMapTrackerHistoriesRequest() {
      return {
          type: FETCH_MAP_TRACKER_HISTORIES_REQUEST
      }
  }
  
  export function fetchMapTrackerHistoriesSuccess(tracker) {
      return {
          type: FETCH_MAP_TRACKER_HISTORIES_SUCCESS,
          tracker: tracker
      }
  }
  
  export function fetchMapTrackerHistoriesError(error) {
      return {
          type: FETCH_MAP_TRACKER_HISTORIES_ERROR,
          error: error
      }
  }