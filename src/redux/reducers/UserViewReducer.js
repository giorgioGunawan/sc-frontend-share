// import {data} from "../fake-datas/UserViewData"
import { FETCH_USERVIEW_REQUEST, FETCH_USERVIEW_SUCCESS, FETCH_USERVIEW_ERROR } from "../constants"
const initialState = {
    loading: false,
    userview: [],
    error: null
}

export default function UserViewReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_USERVIEW_REQUEST: 
            console.log('fetch request UserViewReducer ...')
            return {
                ...state,
                loading: true
            }
        case FETCH_USERVIEW_SUCCESS:
            console.log('fetch success ...', action.userview)
            return {
                ...state,
                loading: false,
                // userview: [...data]
                userview: action.userview
            }
        case FETCH_USERVIEW_ERROR:
            console.log('fetch error ...')
            return {
                ...state,
                loading: false,
                error: 'error'
                // error: action.error
            }
        default: 
            return state;
    }
}
