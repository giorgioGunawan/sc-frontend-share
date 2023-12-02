import { FETCH_SALESCLIENTVIEW_REQUEST, FETCH_SALESCLIENTVIEW_SUCCESS, FETCH_SALESCLIENTVIEW_ERROR } from "../constants"
const initialState = {
    loading: false,
    salesview: [],
    error: null
}

export default function SalesClientViewReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_SALESCLIENTVIEW_REQUEST: 
            console.log('fetch request SalesClientViewReducer...', state)
            return {
                ...state,
                loading: true
            }
        case FETCH_SALESCLIENTVIEW_SUCCESS:
            console.log('fetch success ...', action.userview)
            return {
                ...state,
                loading: false,
                // user: [...data]
                salesview: action.salesview
            }
        case FETCH_SALESCLIENTVIEW_ERROR:
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