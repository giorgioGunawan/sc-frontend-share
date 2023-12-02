import { fetchAllUserRequest, fetchAllUserSuccess, fetchAllUserError } from "../../redux/actions/AllUserAction";
import { SERVER_URL } from "../../common/config";

function fetchAllUser(params) {
    console.log('fetching Users AllUserService ...')
    return dispatch => {
        dispatch(fetchAllUserRequest());
        const branch_id = localStorage.getItem('branch_id');
        let body = {}
        if (branch_id !== "null") {
            body = { company_id: localStorage.getItem('company_id'), branch_id: localStorage.getItem('branch_id'), 
                isDirector: localStorage.getItem('isDirector')};
        } else {
            body = { company_id: localStorage.getItem('company_id'), isDirector: localStorage.getItem('isDirector')};
        }
        setTimeout(() => {
            fetch(`${SERVER_URL}getAllUserById`, {
                method: 'POST',
                body:JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchAllUserSuccess(res));
                console.log("Get User===>", res)
                return res;
            })
            .catch(error => {
                dispatch(fetchAllUserError(error));
            })
        }, 1000);
        
    }
}

export default fetchAllUser;