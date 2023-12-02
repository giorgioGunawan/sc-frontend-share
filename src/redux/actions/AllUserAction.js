import {
    FETCH_ALL_USER_REQUEST,
    FETCH_ALL_USER_SUCCESS,
    FETCH_ALL_USER_ERROR
  } from '../constants'
  
  export function fetchAllUserRequest() {
      return {
          type: FETCH_ALL_USER_REQUEST
      }
  }
  
  export function fetchAllUserSuccess(user) {
    console.log("User Action +>", user)
      return {
          type: FETCH_ALL_USER_SUCCESS,
          user: user
      }
  }
  
  export function fetchAllUserError(error) {
      return {
          type: FETCH_ALL_USER_ERROR,
          error: error
      }
  }