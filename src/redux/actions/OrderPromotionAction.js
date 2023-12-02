import {
    FETCH_PROMOTION_REQUEST,
    FETCH_PROMOTION_SUCCESS,
    FETCH_PROMOTION_ERROR
  } from '../constants'
  
  export function fetchPromotionRequest() {
      return {
          type: FETCH_PROMOTION_REQUEST
      }
  }
  
  export function fetchPromotionSuccess(promotion) {
    console.log("action===>", promotion)
      return {
          type: FETCH_PROMOTION_SUCCESS,
          promotion: promotion
      }
  }
  
  export function fetchPromotionError(error) {
      return {
          type: FETCH_PROMOTION_ERROR,
          error: error
      }
  }