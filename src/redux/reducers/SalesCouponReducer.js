import { FETCH_COUPON_REQUEST, FETCH_COUPON_SUCCESS, FETCH_COUPON_ERROR } from "../constants"
const initialState = {
    loading: false,
    coupon: [],
    error: null
}

export default function SalesCouponReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_COUPON_REQUEST: 
            console.log('fetch request SalesCouponReducer...')
            return {
                ...state,
                loading: true
            }
        case FETCH_COUPON_SUCCESS:
            console.log('fetch success ...', action.userview)
            return {
                ...state,
                loading: false,
                // user: [...data]
                coupon: action.coupon
            }
        case FETCH_COUPON_ERROR:
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