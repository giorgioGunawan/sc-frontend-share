import { FETCH_BRANCH_REQUEST, FETCH_BRANCH_SUCCESS, FETCH_BRANCH_ERROR } from "../constants"
const initialState = {
    loading: false,
    company: [],
    error: null
}

export default function BranchReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_BRANCH_REQUEST: 
            console.log('fetch request BranchReducer...')
            return {
                ...state,
                loading: true
            }
        case FETCH_BRANCH_SUCCESS:
            console.log('fetch success ...', action.userview)
            return {
                ...state,
                loading: false,
                // user: [...data]
                company: action.company
            }
        case FETCH_BRANCH_ERROR:
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