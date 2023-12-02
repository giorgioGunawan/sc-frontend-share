import { fetchCouponRequest, fetchCouponSuccess, fetchCouponError } from "../../redux/actions/OrderCouponAction";
import { SERVER_URL } from "../../common/config";

function fetchCoupon() {
    return dispatch => {
        dispatch(fetchCouponRequest());
        setTimeout(() => {
            fetch(`${SERVER_URL}getCoupons`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchCouponSuccess(res));
                console.log("Get SalesItem===>", res)
                return res;
            })
            .catch(error => {
                dispatch(fetchCouponError(error));
            })
        }, 1000);
        
    }
}

export default fetchCoupon;