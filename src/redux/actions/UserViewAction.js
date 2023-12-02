import {
  FETCH_USERVIEW_REQUEST,
  FETCH_USERVIEW_SUCCESS,
  FETCH_USERVIEW_ERROR
} from '../constants'

export function fetchUserViewRequest() {
    return {
        type: FETCH_USERVIEW_REQUEST
    }
}

export function fetchUserViewSuccess(userview) {
    return {
        type: FETCH_USERVIEW_SUCCESS,
        userview: userview
    }
}

export function fetchUserViewError(error) {
    return {
        type: FETCH_USERVIEW_ERROR,
        error: error
    }
}