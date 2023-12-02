// import {data} from "../fake-datas/UserData"
import { FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_ERROR } from "../constants"
const initialState = {
    loading: false,
    user: [],
    error: null
}

export default function UserReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_USER_REQUEST: 
            console.log('fetch request UserReducre...')
            return {
                ...state,
                loading: true
            }
        case FETCH_USER_SUCCESS:
            console.log('fetch success ...', action.userview)
            return {
                ...state,
                loading: false,
                // user: [...data]
                user: action.user
            }
        case FETCH_USER_ERROR:
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
