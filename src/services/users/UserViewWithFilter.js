import { fetchUserViewRequest, fetchUserViewSuccess, fetchUserViewError } from "../../redux/actions/UserViewAction";
import { SERVER_URL } from "../../common/config";

function fetchUserViewWithFilter(params = {}) {
    return dispatch => {
        dispatch(fetchUserViewRequest());
        
        setTimeout(() => {
            fetch(`${SERVER_URL}getEmployeeWithFilter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchUserViewSuccess(res));
                console.log("Get Client===>", res)
                return res;
            })
            .catch(error => {
                dispatch(fetchUserViewError(error));
            })
        }, 1000);
        
    }
}

export default fetchUserViewWithFilter;