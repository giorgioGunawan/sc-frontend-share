import { fetchBranchRequest, fetchBranchSuccess, fetchBranchError } from "../../redux/actions/BranchAction";
import { SERVER_URL } from "../../common/config";

function fetchBranch() {
    console.log('fetching Branch ...')
    return dispatch => {
        dispatch(fetchBranchRequest());
        
        setTimeout(() => {
            fetch(`${SERVER_URL}getBranch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchBranchSuccess(res));
                console.log("Get Branch===>", res)
                return res;
            })
            .catch(error => {
                dispatch(fetchBranchError(error));
            })
        }, 1000);
        
    }
}

export default fetchBranch;