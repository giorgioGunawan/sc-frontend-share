import { fetchScheduleDetailRequest, fetchScheduleDetailSuccess, fetchScheduleDetailError } from "../../redux/actions/ScheduleDetailAction";
import { SERVER_URL } from "../../common/config";
// import ScheduleReducer from "../../redux/reducers/ScheduleReducer";

function fetchScheduleDetail(params, callback) {
    return dispatch => {
        dispatch(fetchScheduleDetailRequest());
        setTimeout(() => {
            fetch(`${SERVER_URL}getScheduleByUserId_v2`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    callback && callback(null, false)
                    throw(res.error);
                }
                dispatch(fetchScheduleDetailSuccess(res));
                console.log("Get Schedule===>", res)
                callback && callback(res, true)
                return res;
            })
            .catch(error => {
                dispatch(fetchScheduleDetailError(error));
                callback && callback(null, false)
            })
        }, 1000);
        
    }
}

export default fetchScheduleDetail