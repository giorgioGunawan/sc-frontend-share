import { SERVER_URL } from "../../common/config";
import { fetchMapTrackerHistoriesRequest, fetchMapTrackerHistoriesSuccess, fetchMapTrackerHistoriesError } from "../../redux/actions/mapTracker";

function fetchLiveTrackerHistories(params, callback) {
    return dispatch => {
        dispatch(fetchMapTrackerHistoriesRequest());
        setTimeout(() => {
            fetch(`${SERVER_URL}getMapTrackerByUserId`, {
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
                dispatch(fetchMapTrackerHistoriesSuccess(res?.payload));
                console.log("Get MapTracker===>", res)
                callback && callback(res.payload, true)
                return res.payload;
            })
            .catch(error => {
                dispatch(fetchMapTrackerHistoriesError(error));
                callback && callback(null, false)
            })
        }, 1000);
        
    }
}

export default fetchLiveTrackerHistories;