import {
    FETCH_SALESITEM_REQUEST,
    FETCH_SALESITEM_SUCCESS,
    FETCH_SALESITEM_ERROR
  } from '../constants'
  
  export function fetchSalesItemRequest() {
      return {
          type: FETCH_SALESITEM_REQUEST
      }
  }
  
  export function fetchSalesItemSuccess(salesitem) {
    console.log("action===>", salesitem)
      return {
          type: FETCH_SALESITEM_SUCCESS,
          salesitem: salesitem
      }
  }
  
  export function fetchSalesItemError(error) {
      return {
          type: FETCH_SALESITEM_ERROR,
          error: error
      }
  }