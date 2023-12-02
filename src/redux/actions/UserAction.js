import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_ERROR
} from '../constants'

export function fetchUserRequest() {
    return {
        type: FETCH_USER_REQUEST
    }
}

export function fetchUserSuccess(user) {
  console.log("User Action +++>", user)
    return {
        type: FETCH_USER_SUCCESS,
        user: user
    }
}

export function fetchUserError(error) {
    return {
        type: FETCH_USER_ERROR,
        error: error
    }
}