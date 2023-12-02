import { FETCH_SCHEDULE_REQUEST, FETCH_SCHEDULE_SUCCESS, FETCH_SCHEDULE_ERROR } from "../constants"
const initialState = {
    loading: false,
    schedule: [],
    error: null
}

const ScheduleReducer = (state = initialState, action) => {
    switch(action.type) {
        case FETCH_SCHEDULE_REQUEST: 
            console.log('fetch request ScheduleReducer...')
            return {
                ...state,
                loading: true
            }
        case FETCH_SCHEDULE_SUCCESS:
            console.log('fetch success ...', action.userview)
            return {
                ...state,
                loading: false,
                // user: [...data]
                schedule: action.schedule
            }
        case FETCH_SCHEDULE_ERROR:
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

export default ScheduleReducer;
