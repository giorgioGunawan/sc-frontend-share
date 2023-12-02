import {
    FETCH_COUPON_REQUEST,
    FETCH_COUPON_SUCCESS,
    FETCH_COUPON_ERROR
  } from '../constants'
  
  export function fetchCouponRequest() {
      return {
          type: FETCH_COUPON_REQUEST
      }
  }
  
  export function fetchCouponSuccess(coupon) {
    console.log("action===>", coupon)
      return {
          type: FETCH_COUPON_SUCCESS,
          coupon: coupon
      }
  }
  
  export function fetchCouponError(error) {
      return {
          type: FETCH_COUPON_ERROR,
          error: error
      }
  }