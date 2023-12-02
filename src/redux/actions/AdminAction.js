import {
  FETCH_ADMIN_REQUEST,
  FETCH_ADMIN_SUCCESS,
  FETCH_ADMIN_ERROR
} from '../constants'

export function fetchAdminRequest() {
    return {
        type: FETCH_ADMIN_REQUEST
    }
}

export function fetchAdminSuccess(admin) {
  console.log("action===>", admin)
    return {
        type: FETCH_ADMIN_SUCCESS,
        admin: admin
    }
}

export function fetchAdminError(error) {
    return {
        type: FETCH_ADMIN_ERROR,
        error: error
    }
}