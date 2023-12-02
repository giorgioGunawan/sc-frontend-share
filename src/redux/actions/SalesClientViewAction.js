import {
    FETCH_SALESCLIENTVIEW_REQUEST,
    FETCH_SALESCLIENTVIEW_SUCCESS,
    FETCH_SALESCLIENTVIEW_ERROR
  } from '../constants'
  
  export function fetchSalesClientViewRequest() {
      return {
          type: FETCH_SALESCLIENTVIEW_REQUEST
      }
  }
  
  export function fetchSalesClientViewSuccess(salesview) {
    console.log("action===>", salesview)
      return {
          type: FETCH_SALESCLIENTVIEW_SUCCESS,
          salesview: salesview
      }
  }
  
  export function fetchSalesClientViewError(error) {
      return {
          type: FETCH_SALESCLIENTVIEW_ERROR,
          error: error
      }
  }