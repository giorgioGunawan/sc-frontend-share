import { FETCH_PROMOTION_REQUEST, FETCH_PROMOTION_SUCCESS, FETCH_PROMOTION_ERROR } from "../constants"
const initialState = {
    loading: false,
    promotion: [],
    error: null
}

export default function SalesPromotionReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_PROMOTION_REQUEST: 
            console.log('fetch request ...')
            return {
                ...state,
                loading: true
            }
        case FETCH_PROMOTION_SUCCESS:
            console.log('fetch success ...', action.userview)
            return {
                ...state,
                loading: false,
                // user: [...data]
                promotion: action.promotion
            }
        case FETCH_PROMOTION_ERROR:
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