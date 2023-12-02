import { FETCH_COMPANY_REQUEST, FETCH_COMPANY_SUCCESS, FETCH_COMPANY_ERROR } from "../constants"
const initialState = {
    loading: false,
    company: [],
    error: null
}

export default function CompanyReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_COMPANY_REQUEST: 
            console.log('fetch request CompanyReducer...')
            return {
                ...state,
                loading: true
            }
        case FETCH_COMPANY_SUCCESS:
            console.log('fetch success ...', action.userview)
            return {
                ...state,
                loading: false,
                // user: [...data]
                company: action.company
            }
        case FETCH_COMPANY_ERROR:
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