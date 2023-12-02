import { fetchSalesClientRequest, fetchSalesClientSuccess, fetchSalesClientError } from "../../redux/actions/SalesClientAction";
import { SERVER_URL } from "../../common/config";
import SalesReducer from "../../redux/reducers/SalesReducer";

function fetchSalesClient() {
    return dispatch => {
        dispatch(fetchSalesClientRequest());
        setTimeout(() => {
            fetch(`${SERVER_URL}getSalesClient`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchSalesClientSuccess(res));
                console.log("Get SalesClient===>", res)
                return res;
            })
            .catch(error => {
                dispatch(fetchSalesClientError(error));
            })
        }, 1000);
        
    }
}

export default fetchSalesClient;