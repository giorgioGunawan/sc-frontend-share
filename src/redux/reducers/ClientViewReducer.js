import { FETCH_CLIENTVIEW_REQUEST, FETCH_CLIENTVIEW_SUCCESS, FETCH_CLIENTVIEW_ERROR } from "../constants"
const initialState = {
    loading: false,
    clientview: [],
    error: null
}

export default function ClientViewReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_CLIENTVIEW_REQUEST:
            console.log('fetch request ClientViewReducer...')
            return {
                ...state,
                loading: true
            }
        case FETCH_CLIENTVIEW_SUCCESS:
            console.log('fetch success ...', action.userview)
            return {
                ...state,
                loading: false,
                // user: [...data]
                clientview: action.clientview
            }
        case FETCH_CLIENTVIEW_ERROR:
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