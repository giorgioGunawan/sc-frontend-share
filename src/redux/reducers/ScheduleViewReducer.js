import { FETCH_SCHEDULEVIEW_REQUEST, FETCH_SCHEDULEVIEW_SUCCESS, FETCH_SCHEDULEVIEW_ERROR } from "../constants"
const initialState = {
    loading: false,
    scheduleview: [],
    error: null
}

const ScheduleViewReducer = (state = initialState, action) => {
    switch(action.type) {
        case FETCH_SCHEDULEVIEW_REQUEST: 
            console.log('fetch request ScheduleViewReducer...')
            return {
                ...state,
                loading: true
            }
        case FETCH_SCHEDULEVIEW_SUCCESS:
            console.log('fetch success ...', action.userview)
            return {
                ...state,
                loading: false,
                // user: [...data]
                scheduleview: action.scheduleview
            }
        case FETCH_SCHEDULEVIEW_ERROR:
            console.log('fetch error ...')
            return {
                ...state,
                loading: false,
                error: action.error
            }
        default: 
            return state;
    }
};

export default ScheduleViewReducer;
