import { fetchClientViewRequest, fetchClientViewSuccess, fetchClientViewError } from "../../redux/actions/ClientViewAction";
import { SERVER_URL } from "../../common/config";
import ClientViewReducer from "../../redux/reducers/ClientViewReducer";

function fetchClientView(params = {}) {
    return dispatch => {
        dispatch(fetchClientViewRequest());
        const branch_id = localStorage.getItem('branch_id');
        let body = {}
        if (branch_id !== "null") {
            body = {
                company_id: localStorage.getItem('company_id'),
                branch_id: localStorage.getItem('branch_id'), 
                isDirector: localStorage.getItem('isDirector'),
                ...params
            }
        } else {
            body = {
                company_id: localStorage.getItem('company_id'),
                isDirector: localStorage.getItem('isDirector'),
                ...params
            }
        }
        
        setTimeout(() => {
            fetch(`${SERVER_URL}getClientWithFilter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchClientViewSuccess(res));
                console.log("Get Client===>", res)
                return res;
            })
            .catch(error => {
                dispatch(fetchClientViewError(error));
            })
        }, 1000);
        
    }
}

export default fetchClientView;