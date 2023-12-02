import { fetchCompanyRequest, fetchCompanySuccess, fetchCompanyError } from "../../redux/actions/CompanyAction";
import { SERVER_URL } from "../../common/config";

function fetchCompany() {
    console.log('fetching Company ...')
    return dispatch => {
        dispatch(fetchCompanyRequest());
        
        setTimeout(() => {
            fetch(`${SERVER_URL}getCompany`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchCompanySuccess(res));
                console.log("Get Company===>", res)
                return res;
            })
            .catch(error => {
                dispatch(fetchCompanyError(error));
            })
        }, 1000);
        
    }
}

export default fetchCompany;