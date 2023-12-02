import { fetchUserRequest, fetchUserSuccess, fetchUserError } from "../../redux/actions/UserAction";
import { SERVER_URL } from "../../common/config";

function fetchUsers() {
    console.log('fetching Users UserService ...')
    return dispatch => {
        dispatch(fetchUserRequest());
        const body = { isAdmin: 0 };
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
                dispatch(fetchUserSuccess(res));
                console.log("Get User===>", res)
                return res;
            })
            .catch(error => {
                dispatch(fetchUserError(error));
            })
        }, 1000);
        
    }
}

export default fetchUsers;