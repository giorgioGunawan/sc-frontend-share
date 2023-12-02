import { fetchClientRequest, fetchClientSuccess, fetchClientError } from "../../redux/actions/ClientAction";
import { SERVER_URL } from "../../common/config";
// import ClientReducer from "../../redux/reducers/ClientReducer";

function fetchClient() {
    return dispatch => {
        dispatch(fetchClientRequest());
        setTimeout(() => {
            fetch(`${SERVER_URL}getClient`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchClientSuccess(res));
                console.log("Get Client===>", res)
                return res;
            })
            .catch(error => {
                dispatch(fetchClientError(error));
            })
        }, 1000);
        
    }
}

export default fetchClient;