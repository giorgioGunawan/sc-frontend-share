import { fetchAdminRequest, fetchAdminSuccess, fetchAdminError } from "../../redux/actions/AdminAction";
import { SERVER_URL } from "../../common/config";
// import AdminReducer from "../../redux/reducers/AdminReducer";

function fetchAdmins() {
    return dispatch => {
        dispatch(fetchAdminRequest());
        const body = { isAdmin: 1 };
        setTimeout(() => {
            fetch(`${SERVER_URL}getUser`, {
                method: 'POST',
                body:JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchAdminSuccess(res));
                console.log("Get Admin===>", res)
                return res;
            })
            .catch(error => {
                dispatch(fetchAdminError(error));
            })
        }, 1000);
        
    }
}

export default fetchAdmins;