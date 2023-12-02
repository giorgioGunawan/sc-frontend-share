import {
    FETCH_COMPANY_REQUEST,
    FETCH_COMPANY_SUCCESS,
    FETCH_COMPANY_ERROR
  } from '../constants'
   
  export function fetchCompanyRequest() {
      return {
          type: FETCH_COMPANY_REQUEST
      }
  }
  
  export function fetchCompanySuccess(company) {
      return {
          type: FETCH_COMPANY_SUCCESS,
          company: company
      }
  }
  
  export function fetchCompanyError(error) {
      return {
          type: FETCH_COMPANY_ERROR,
          error: error
      }
  }