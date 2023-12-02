import {
    FETCH_CLIENTVIEW_REQUEST,
    FETCH_CLIENTVIEW_SUCCESS,
    FETCH_CLIENTVIEW_ERROR
  } from '../constants'
  
  export function fetchClientViewRequest() {
      return {
          type: FETCH_CLIENTVIEW_REQUEST
      }
  }
  
  export function fetchClientViewSuccess(clientview) {
      return {
          type: FETCH_CLIENTVIEW_SUCCESS,
          clientview: clientview
      }
  }
  
  export function fetchClientViewError(error) {
      return {
          type: FETCH_CLIENTVIEW_ERROR,
          error: error
      }
  }