import {
    FETCH_CLIENT_REQUEST,
    FETCH_CLIENT_SUCCESS,
    FETCH_CLIENT_ERROR
  } from '../constants'
  
  export function fetchClientRequest() {
      return {
          type: FETCH_CLIENT_REQUEST
      }
  }
  
  export function fetchClientSuccess(client) {
    console.log("action===>", client)
      return {
          type: FETCH_CLIENT_SUCCESS,
          client: client
      }
  }
  
  export function fetchClientError(error) {
      return {
          type: FETCH_CLIENT_ERROR,
          error: error
      }
  }