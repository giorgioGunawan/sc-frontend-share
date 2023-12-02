import { fetchScheduleViewRequest, fetchScheduleViewSuccess, fetchScheduleViewError } from "../../redux/actions/ScheduleViewAction";
import { SERVER_URL } from "../../common/config";
// import ScheduleViewReducer from "../../redux/reducers/ScheduleViewReducer";

function fetchScheduleView(params) {
    return dispatch => {
        dispatch(fetchScheduleViewRequest());
        const branch_id = localStorage.getItem('branch_id');
        let body = {}
        if (branch_id !== "null") {
            body = {
                company_id: localStorage.getItem('company_id'),
                branch_id: localStorage.getItem('branch_id'), 
                isDirector: localStorage.getItem('isDirector'),
                limit: 10,
                offset: 0,
                ...params 
            }
        } else {
            body = {
                company_id: localStorage.getItem('company_id'),
                isDirector: localStorage.getItem('isDirector'),
                limit: 10,
                offset: 0,
                ...params 
            }
        }        
        setTimeout(() => {
            fetch(`${SERVER_URL}getScheduleWithFilter`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchScheduleViewSuccess(res));
                console.log("Get Schedule===>", res)
                return res;
            })
            .catch(error => {
                dispatch(fetchScheduleViewError(error));
            })
        }, 1000);
        
    }
}

export default fetchScheduleView;