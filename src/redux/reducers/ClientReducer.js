import { FETCH_CLIENT_REQUEST, FETCH_CLIENT_SUCCESS, FETCH_CLIENT_ERROR } from "../constants"
const initialState = {
    loading: false,
    client: [],
    error: null
}

export default function ClientReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_CLIENT_REQUEST: 
            console.log('fetch request Clientreducer...')
            return {
                ...state,
                loading: true
            }
        case FETCH_CLIENT_SUCCESS:
            console.log('fetch success ...', action.userview)
            return {
                ...state,
                loading: false,
                // user: [...data]
                client: action.client
            }
        case FETCH_CLIENT_ERROR:
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