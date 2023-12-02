import {
    FETCH_SALESCLIENT_REQUEST,
    FETCH_SALESCLIENT_SUCCESS,
    FETCH_SALESCLIENT_ERROR
  } from '../constants'
  
  export function fetchSalesClientRequest() {
      return {
          type: FETCH_SALESCLIENT_REQUEST
      }
  }
  
  export function fetchSalesClientSuccess(sales) {
    console.log("action===>", sales)
      return {
          type: FETCH_SALESCLIENT_SUCCESS,
          sales: sales
      }
  }
  
  export function fetchSalesClientError(error) {
      return {
          type: FETCH_SALESCLIENT_ERROR,
          error: error
      }
  }