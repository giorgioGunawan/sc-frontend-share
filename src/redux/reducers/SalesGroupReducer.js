import { FETCH_GROUP_REQUEST, FETCH_GROUP_SUCCESS, FETCH_GROUP_ERROR } from "../constants"
const initialState = {
    loading: false,
    group: [],
    error: null
}

export default function SalesGroupReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_GROUP_REQUEST: 
            console.log('fetch request ...')
            return {
                ...state,
                loading: true
            }
        case FETCH_GROUP_SUCCESS:
            console.log('fetch success ...', action.userview)
            return {
                ...state,
                loading: false,
                // user: [...data]
                group: action.group
            }
        case FETCH_GROUP_ERROR:
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