import {
    FETCH_GROUP_REQUEST,
    FETCH_GROUP_SUCCESS,
    FETCH_GROUP_ERROR
  } from '../constants'
  
  export function fetchGroupRequest() {
      return {
          type: FETCH_GROUP_REQUEST
      }
  }
  
  export function fetchGroupSuccess(group) {
    console.log("action===>", group)
      return {
          type: FETCH_GROUP_SUCCESS,
          group: group
      }
  }
  
  export function fetchGroupError(error) {
      return {
          type: FETCH_GROUP_ERROR,
          error: error
      }
  }