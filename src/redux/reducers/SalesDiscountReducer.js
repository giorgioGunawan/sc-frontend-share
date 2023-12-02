import { FETCH_DISCOUNT_REQUEST, FETCH_DISCOUNT_SUCCESS, FETCH_DISCOUNT_ERROR } from "../constants"
const initialState = {
    loading: false,
    discount: [],
    error: null
}

export default function SalesDiscountReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_DISCOUNT_REQUEST: 
            console.log('fetch request ...')
            return {
                ...state,
                loading: true
            }
        case FETCH_DISCOUNT_SUCCESS:
            console.log('fetch success ...', action.userview)
            return {
                ...state,
                loading: false,
                // user: [...data]
                discount: action.discount
            }
        case FETCH_DISCOUNT_ERROR:
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