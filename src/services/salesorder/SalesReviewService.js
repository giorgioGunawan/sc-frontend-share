import { fetchSalesReviewRequest, fetchSalesReviewSuccess, fetchSalesReviewError } from "../../redux/actions/OrderReviewAction";
import { SERVER_URL } from "../../common/config";
import SalesReviewReducer from "../../redux/reducers/SalesReviewReducer";

function fetchSalesReview() {
    return dispatch => {
        dispatch(fetchSalesReviewRequest());
        // let body = {
        //     company_id: localStorage.getItem('company_id')
        // }
        setTimeout(() => {
            fetch(`${SERVER_URL}getReview`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify(body)
            })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchSalesReviewSuccess(res));
                console.log("Get SalesReview===>", res)
                return res;
            })
            .catch(error => {
                dispatch(fetchSalesReviewError(error));
            })
        }, 1000);
        
    }
}

export default fetchSalesReview;