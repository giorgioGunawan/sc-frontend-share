import { 
    FETCH_MAP_TRACKER_HISTORIES_REQUEST,
    FETCH_MAP_TRACKER_HISTORIES_SUCCESS,
    FETCH_MAP_TRACKER_HISTORIES_ERROR 
} from "../constants"
const initialState = {
    loading: false,
    salesview: [],
    error: null
}

export default function mapTrackerReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_MAP_TRACKER_HISTORIES_REQUEST: 
            console.log('fetch request ...')
            return {
                ...state,
                loading: true
            }
        case FETCH_MAP_TRACKER_HISTORIES_SUCCESS:
            console.log('fetch success ...')
            return {
                ...state,
                loading: false,
                // user: [...data]
                tracker: action.tracker
            }
        case FETCH_MAP_TRACKER_HISTORIES_ERROR:
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