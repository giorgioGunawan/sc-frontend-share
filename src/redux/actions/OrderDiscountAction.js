import {
    FETCH_DISCOUNT_REQUEST,
    FETCH_DISCOUNT_SUCCESS,
    FETCH_DISCOUNT_ERROR
  } from '../constants'
  
  export function fetchDiscountRequest() {
      return {
          type: FETCH_DISCOUNT_REQUEST
      }
  }
  
  export function fetchDiscountSuccess(discount) {
    console.log("action===>", discount)
      return {
          type: FETCH_DISCOUNT_SUCCESS,
          discount: discount
      }
  }
  
  export function fetchDiscountError(error) {
      return {
          type: FETCH_DISCOUNT_ERROR,
          error: error
      }
  }