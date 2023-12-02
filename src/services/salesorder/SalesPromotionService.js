import { fetchPromotionRequest, fetchPromotionSuccess, fetchPromotionError } from "../../redux/actions/OrderPromotionAction";
import { SERVER_URL } from "../../common/config";
import SalesPromotionReducer from "../../redux/reducers/SalesPromotionReducer";

function fetchPromotion() {
    return dispatch => {
        dispatch(fetchPromotionRequest());
        let body = {
            company_id: localStorage.getItem('company_id')
        }
        setTimeout(() => {
            fetch(`${SERVER_URL}getPromotionsbyCompanyId`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchPromotionSuccess(res));
                console.log("Get SalesItem===>", res)
                return res;
            })
            .catch(error => {
                dispatch(fetchPromotionError(error));
            })
        }, 1000);
        
    }
}

export default fetchPromotion;