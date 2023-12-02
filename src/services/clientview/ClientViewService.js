import { fetchClientViewRequest, fetchClientViewSuccess, fetchClientViewError } from "../../redux/actions/ClientViewAction";
import { SERVER_URL } from "../../common/config";
import ClientViewReducer from "../../redux/reducers/ClientViewReducer";

function fetchClientView() {
    return dispatch => {
        dispatch(fetchClientViewRequest());
        let body = {
            company_id: localStorage.getItem('company_id'),
        }
        setTimeout(() => {
            fetch(`${SERVER_URL}getClientByCompanyId`, {
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