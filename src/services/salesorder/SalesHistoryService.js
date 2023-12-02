import { fetchSalesHistoryRequest, fetchSalesHistorySuccess, fetchSalesHistoryError } from "../../redux/actions/OrderHistoryAction";
import { SERVER_URL } from "../../common/config";
import SalesHistoryReducer from "../../redux/reducers/SalesHistoryReducer";

function fetchSalesHistory() {
    return dispatch => {
        dispatch(fetchSalesHistoryRequest());
        // let body = {
        //     company_id: localStorage.getItem('company_id')
        // }
        setTimeout(() => {
            fetch(`${SERVER_URL}getHistory`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify(body)
            })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchSalesHistorySuccess(res));
                console.log("Get SalesHistory===>", res)
                return res;
            })
            .catch(error => {
                dispatch(fetchSalesHistoryError(error));
            })
        }, 1000);
        
    }
}

export default fetchSalesHistory;