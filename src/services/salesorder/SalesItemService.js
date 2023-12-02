import { fetchSalesItemRequest, fetchSalesItemSuccess, fetchSalesItemError } from "../../redux/actions/OrderItemAction";
import { SERVER_URL } from "../../common/config";
import SalesItemReducer from "../../redux/reducers/SalesItemReducer";

function fetchSalesItem(company_id) {
    return dispatch => {
        dispatch(fetchSalesItemRequest());
        let body = {
            company_id: company_id
        }
        setTimeout(() => {
            fetch(`${SERVER_URL}getItemsbyCompanyId`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchSalesItemSuccess(res));
                console.log("Get SalesItem===>", res)
                return res;
            })
            .catch(error => {
                dispatch(fetchSalesItemError(error));
            })
        }, 1000);
        
    }
}

export default fetchSalesItem;