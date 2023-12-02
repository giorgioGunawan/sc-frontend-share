import { fetchScheduleRequest, fetchScheduleSuccess, fetchScheduleError } from "../../redux/actions/ScheduleAction";
import { SERVER_URL } from "../../common/config";
// import ScheduleReducer from "../../redux/reducers/ScheduleReducer";

function fetchSchedule(params) {
    return dispatch => {
        dispatch(fetchScheduleRequest());
        setTimeout(() => {
            const body = {
                limit: 10,
                offset: 0,
                ...params
            }
            fetch(`${SERVER_URL}getSchedule`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchScheduleSuccess(res));
                console.log("Get Schedule===>", res)
                return res;
            })
            .catch(error => {
                dispatch(fetchScheduleError(error));
            })
        }, 1000);
        
    }
}

export default fetchSchedule;