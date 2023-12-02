// import {data} from "../fake-datas/UserData"
import { FETCH_ALL_USER_REQUEST, FETCH_ALL_USER_SUCCESS, FETCH_ALL_USER_ERROR } from "../constants"
const initialState = {
    loading: false,
    user: [],
    error: null
}

export default function AllUserReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_ALL_USER_REQUEST: 
            console.log('fetch request AllUserReducer...')
            return {
                ...state,
                loading: true
            }
        case FETCH_ALL_USER_SUCCESS:
            console.log('fetch success ...', action.userview)
            return {
                ...state,
                loading: false,
                // user: [...data]
                user: action.user
            }
        case FETCH_ALL_USER_ERROR:
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
