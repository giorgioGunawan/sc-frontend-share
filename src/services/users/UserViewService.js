import { fetchUserViewRequest, fetchUserViewSuccess, fetchUserViewError } from "../../redux/actions/UserViewAction";
import { SERVER_URL } from "../../common/config";

function fetchUserView(  callback) {
    console.log('fetching Users ...')
    return dispatch => {
        dispatch(fetchUserViewRequest());
        const branch_id = localStorage.getItem('branch_id');
        let body = {}
        // If branch id is provided, then fetch for only that branch
        if (branch_id !== "null") {
            body = { company_id: localStorage.getItem('company_id'), branch_id: localStorage.getItem('branch_id'), 
                isDirector: localStorage.getItem('isDirector')};
        } else {
            body = { company_id: localStorage.getItem('company_id'), isDirector: localStorage.getItem('isDirector')};
        }

        console.log('body', body)
        setTimeout(() => {
            fetch(`${SERVER_URL}getUserById`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            })
                .then(res => res.json())
                .then(res => {
                    if (res.error) {
                        callback && callback(null, false)
                        throw (res.error);
                    }
                    dispatch(fetchUserViewSuccess(res));
                    callback && callback(res, true)
                    return res;
                })
                .catch(error => {
                    dispatch(fetchUserViewError(error));
                    callback && callback(null, false)
                })
        }, 1000);

    }
}

export default fetchUserView;