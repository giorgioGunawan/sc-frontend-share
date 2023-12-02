import { fetchSalesClientViewRequest, fetchSalesClientViewSuccess, fetchSalesClientViewError } from "../../redux/actions/SalesClientViewAction";
import { SERVER_URL } from "../../common/config";
import SalesReducer from "../../redux/reducers/SalesReducer";

function fetchSalesClientView(params) {
    return dispatch => {
        dispatch(fetchSalesClientViewRequest());
        const branch_id = localStorage.getItem('branch_id');
        let body = {}
        if (branch_id !== "null") {
            body = {
                company_id: localStorage.getItem('company_id'),
                branch_id: localStorage.getItem('branch_id'), 
                isDirector: localStorage.getItem('isDirector'),
                limit: 10,
                offset: 0,
                ...params,
            }
        } else {
            body = {
                company_id: localStorage.getItem('company_id'),
                isDirector: localStorage.getItem('isDirector'),
                limit: 10,
                offset: 0,
                ...params,
            }
        }
        setTimeout(() => {
            fetch(`${SERVER_URL}getSalesClientWithFilter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchSalesClientViewSuccess(res));
                console.log("Get SalesClientView===>", res)
                return res;
            })
            .catch(error => {
                dispatch(fetchSalesClientViewError(error));
            })
        }, 1000);
        
    }
}

export default fetchSalesClientView;