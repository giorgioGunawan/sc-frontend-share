import { FETCH_SALESITEM_REQUEST, FETCH_SALESITEM_SUCCESS, FETCH_SALESITEM_ERROR } from "../constants"
const initialState = {
    loading: false,
    salesitem: [],
    error: null
}

export default function SalesItemReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_SALESITEM_REQUEST: 
            console.log('fetch request ...')
            return {
                ...state,
                loading: true
            }
        case FETCH_SALESITEM_SUCCESS:
            console.log('fetch success ...', action.userview)
            return {
                ...state,
                loading: false,
                // user: [...data]
                salesitem: action.salesitem
            }
        case FETCH_SALESITEM_ERROR:
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