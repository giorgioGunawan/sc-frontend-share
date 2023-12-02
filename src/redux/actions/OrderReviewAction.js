import {
    FETCH_SALESREVIEW_REQUEST,
    FETCH_SALESREVIEW_SUCCESS,
    FETCH_SALESREVIEW_ERROR
  } from '../constants'
  
  export function fetchSalesReviewRequest() {
      return {
          type: FETCH_SALESREVIEW_REQUEST
      }
  }
  
  export function fetchSalesReviewSuccess(salesreview) {
    console.log("action===>", salesreview)
      return {
          type: FETCH_SALESREVIEW_SUCCESS,
          salesreview: salesreview
      }
  }
  
  export function fetchSalesReviewError(error) {
      return {
          type: FETCH_SALESREVIEW_ERROR,
          error: error
      }
  }