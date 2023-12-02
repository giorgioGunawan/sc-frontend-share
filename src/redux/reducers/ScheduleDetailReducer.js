import { FETCH_SCHEDULE_DETAIL_REQUEST, FETCH_SCHEDULE_DETAIL_SUCCESS, FETCH_SCHEDULE_DETAIL_ERROR } from "../constants"
const initialState = {
    loading: false,
    schedule: [],
    error: null
}

const ScheduleDetailReducer = (state = initialState, action) => {
    switch(action.type) {
        case FETCH_SCHEDULE_DETAIL_REQUEST: 
            console.log('fetch request ScheduleDetailReducer...')
            return {
                ...state,
                loading: true
            }
        case FETCH_SCHEDULE_DETAIL_SUCCESS:
            console.log('fetch success ...', action.userview)
            return {
                ...state,
                loading: false,
                // user: [...data]
                schedule: action.schedule
            }
        case FETCH_SCHEDULE_DETAIL_ERROR:
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

export default ScheduleDetailReducer;
