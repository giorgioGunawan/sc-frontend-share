import {
    FETCH_BRANCH_REQUEST,
    FETCH_BRANCH_SUCCESS,
    FETCH_BRANCH_ERROR
  } from '../constants'
   
  export function fetchBranchRequest() {
      return {
          type: FETCH_BRANCH_REQUEST
      }
  }
  
  export function fetchBranchSuccess(company) {
      return {
          type: FETCH_BRANCH_SUCCESS,
          company: company
      }
  }
  
  export function fetchBranchError(error) {
      return {
          type: FETCH_BRANCH_ERROR,
          error: error
      }
  }