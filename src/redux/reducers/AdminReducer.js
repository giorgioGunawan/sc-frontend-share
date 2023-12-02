// import {data} from "../fake-datas/AdminData"
import { FETCH_ADMIN_REQUEST, FETCH_ADMIN_SUCCESS, FETCH_ADMIN_ERROR } from "../constants"
const initialState = {
    loading: false,
    admin: [],
    error: null
}

export default function AdminReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_ADMIN_REQUEST: 
            console.log('fetch request AdminReducer...')
            return {
                ...state,
                loading: true
            }
        case FETCH_ADMIN_SUCCESS:
            console.log('fetch success ...', action.userview)
            return {
                ...state,
                loading: false,
                // admin: [...data]
                admin: action.admin
            }
        case FETCH_ADMIN_ERROR:
            console.log('fetch error ...')
            return {
                ...state,
                loading: false,
                error: action.error
            }
        default: 
            return state;
    }
}
