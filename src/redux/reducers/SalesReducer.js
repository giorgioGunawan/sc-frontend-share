import { FETCH_SALESCLIENT_REQUEST, FETCH_SALESCLIENT_SUCCESS, FETCH_SALESCLIENT_ERROR } from "../constants"
const initialState = {
    loading: false,
    sales: [],
    error: null
}

export default function SalesClientReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_SALESCLIENT_REQUEST: 
            console.log('fetch request SalesClientReducer...')
            return {
                ...state,
                loading: true
            }
        case FETCH_SALESCLIENT_SUCCESS:
            console.log('fetch success ...', action.userview)
            return {
                ...state,
                loading: false,
                // user: [...data]
                sales: action.sales
            }
        case FETCH_SALESCLIENT_ERROR:
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