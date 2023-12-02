import {
    FETCH_SALESHISTORY_REQUEST,
    FETCH_SALESHISTORY_SUCCESS,
    FETCH_SALESHISTORY_ERROR
  } from '../constants'
  
  export function fetchSalesHistoryRequest() {
      return {
          type: FETCH_SALESHISTORY_REQUEST
      }
  }
  
  export function fetchSalesHistorySuccess(saleshistory) {
    console.log("action===>", saleshistory)
      return {
          type: FETCH_SALESHISTORY_SUCCESS,
          saleshistory: saleshistory
      }
  }
  
  export function fetchSalesHistoryError(error) {
      return {
          type: FETCH_SALESHISTORY_ERROR,
          error: error
      }
  }