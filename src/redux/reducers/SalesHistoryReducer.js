import { FETCH_SALESHISTORY_REQUEST, FETCH_SALESHISTORY_SUCCESS, FETCH_SALESHISTORY_ERROR } from "../constants"
const initialState = {
    loading: false,
    saleshistory: [],
    error: null
}

export default function SalesHistoryReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_SALESHISTORY_REQUEST: 
            console.log('fetch request ...')
            return {
                ...state,
                loading: true
            }
        case FETCH_SALESHISTORY_SUCCESS:
            console.log('fetch success ...', action.userview)
            return {
                ...state,
                loading: false,
                // user: [...data]
                saleshistory: action.saleshistory
            }
        case FETCH_SALESHISTORY_ERROR:
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