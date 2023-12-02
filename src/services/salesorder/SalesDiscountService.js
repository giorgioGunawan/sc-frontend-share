import { fetchDiscountRequest, fetchDiscountSuccess, fetchDiscountError } from "../../redux/actions/OrderDiscountAction";
import { SERVER_URL } from "../../common/config";
import SalesDiscountReducer from "../../redux/reducers/SalesDiscountReducer";

function fetchDiscount() {
    return dispatch => {
        dispatch(fetchDiscountRequest());
        let body = {
            company_id: localStorage.getItem('company_id')
        }
        setTimeout(() => {
            fetch(`${SERVER_URL}getDiscountsbyCompanyId`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchDiscountSuccess(res));
                console.log("Get SalesItem===>", res)
                return res;
            })
            .catch(error => {
                dispatch(fetchDiscountError(error));
            })
        }, 1000);
        
    }
}

export default fetchDiscount;