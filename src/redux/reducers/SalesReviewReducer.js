import { FETCH_SALESREVIEW_REQUEST, FETCH_SALESREVIEW_SUCCESS, FETCH_SALESREVIEW_ERROR } from "../constants"
const initialState = {
    loading: false,
    salesreview: [],
    error: null
}

export default function SalesReviewReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_SALESREVIEW_REQUEST: 
            console.log('fetch request ...')
            return {
                ...state,
                loading: true
            }
        case FETCH_SALESREVIEW_SUCCESS:
            console.log('fetch success ...', action.userview)
            return {
                ...state,
                loading: false,
                // user: [...data]
                salesreview: action.salesreview
            }
        case FETCH_SALESREVIEW_ERROR:
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