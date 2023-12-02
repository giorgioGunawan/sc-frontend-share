import React from "react";
import {
  Route,
  Switch,
  Redirect,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";
import useMediaQuery from '@material-ui/core/useMediaQuery';

// styles
import useStyles from "./styles";

// components
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar1";

// pages

// context
import { useLayoutState } from "../../context/LayoutContext";
import { Grid } from "@material-ui/core";
import Error from "../../pages/error/Error";
import UserViewPage from "../../pages/UserView/UserView";
import ClientViewPage from "../../pages/ClientView/index";
import AddClientPage from "../../pages/ClientView/AddClient";
import EditClientPage from "../../pages/ClientView/EditClient";
import SalesViewPage from "../../pages/SalesView/index";
import EditSalesPage from "../../pages/SalesView/EditSales";
import AddSalesPage from "../../pages/SalesView/AddSales";
import ScheduleReportPage from '../../pages/Report/ScheduleReport/ScheduleReport'
import ReportViewPage from '../../pages/ReportView/index';
import ScheduleViewPage from "../../pages/ScheduleView/index";
import AddSchedulePage from "../../pages/ScheduleView/AddSchedule";
// import SalesOrderReportPage from '../../pages/Report/SalesOrderReport/SalesOrderReport'
import ReviewPage from '../../pages/SalesOrder/Review'
import HistoryPage from '../../pages/SalesOrder/History'
import ItemPage from '../../pages/SalesOrder/Item/Item'
import AddItemPage from '../../pages/SalesOrder/Item/AddItem'
import EditItemPage from '../../pages/SalesOrder/Item/EditItem'
import DiscountPage from '../../pages/SalesOrder/Discount/Discount'
import AddDiscountPage from '../../pages/SalesOrder/Discount/AddDiscount'
import EditDiscountPage from '../../pages/SalesOrder/Discount/EditDiscount'
import PromotionPage from '../../pages/SalesOrder/Promotion/Promotion'
import AddPromotionPage from '../../pages/SalesOrder/Promotion/AddPromotion'
import EditPromotionPage from '../../pages/SalesOrder/Promotion/EditPromotion'
import AddCouponPage from '../../pages/SalesOrder/Promotion/AddCoupon'
import EditCouponPage from '../../pages/SalesOrder/Promotion/EditCoupon'
import TargetPage from '../../pages/Report/SalesOrderReport/Target'
import GroupPage from '../../pages/SalesOrder/Group/Group'
import AddGroupPage from '../../pages/SalesOrder/Group/AddGroup'
import EditGroupPage from '../../pages/SalesOrder/Group/EditGroup'
import ItemCategoryPage from '../../pages/SalesOrder/ItemCategory/ItemCategory'
import EditItemCategoryPage from '../../pages/SalesOrder/ItemCategory/EditItemCategory'
import CompanyUsersPage from '../../pages/SalesOrder/CompanyUsers/CompanyUsers'
import EditCompanyUserPage from '../../pages/SalesOrder/CompanyUsers/EditCompanyUser'
import SettingPage from '../../pages/SalesOrder/CompanyUsers/Setting/Setting'
// import EditItemPage from '../../pages/SalesOrder/Item/EditItem'
import Footer from "../Footer/Footer";
import LiveTrackingPage from "../../pages/LiveTracking";
import VisitPage from "../../pages/Visit";
import AddVisitingReasonPage from "../../pages/Visit/VisitingReason/Add";
import AddProductPage from "../../pages/Visit/Product/Add";
import DetailVisitingReasonPage from "../../pages/Visit/VisitingReason/Detail";
import OutcomePage from "../../pages/Outcome";
import AddOutcomePage from "../../pages/Outcome/Add";

function Layout(props) {
  var classes = useStyles();
  const matches1600 = useMediaQuery('(min-width:1600px)');
  const matches1800 = useMediaQuery('(min-width:1800px)');

  // global
  var layoutState = useLayoutState();

  return (
    <div className={classes.root}>
      <>
        {/* <Header history={props.history} /> */}
        <Sidebar />
        <div
          className={classnames(classes.content, {
            [classes.contentShift]: layoutState.isSidebarOpened,

          })}
        >
          {/* <Header history={props.history} /> */}
          <div className={classnames(classes.mainContainer, {
            [classes.padding1600]: matches1600,
            [classes.padding1800]: matches1800,
          }
          )}>
            <Grid>
              <Switch>
                
                <Route exact path="/app/clientview" component={ClientViewPage} />
                <Route
                  exact
                  path="/app"
                  render={() => <Redirect to="/app/clientview" />}
                />
                <Route exact path="/app/scheduleview" component={ScheduleViewPage} />
                <Route exact path="/app/userview" component={UserViewPage} />
                <Route exact path="/app/clientview/add" component={AddClientPage} />
                <Route exact path="/app/clientview/:clientview/edit" component={EditClientPage} />
                <Route exact path="/app/salesview" component={SalesViewPage} />
                <Route exact path="/app/salesview/:salesview/edit" component={EditSalesPage} />
                <Route exact path="/app/salesview/add" component={AddSalesPage} />
                <Route exact path="/app/reportview" component={ReportViewPage} />
                <Route exact path="/app/schedule_report" component={ScheduleReportPage} />
                <Route exact path="/app/scheduleview/add" component={AddSchedulePage} />
                <Route exact path="/app/salesorder_report" component={TargetPage} />
                <Route exact path="/app/salesorder/review" component={ReviewPage} />
                <Route exact path="/app/salesorder/history" component={HistoryPage} />
                <Route exact path="/app/salesorder/item" component={ItemPage} />
                <Route exact path="/app/salesorder/item/add" component={AddItemPage} />
                <Route exact path="/app/salesorder/item/:item/edit" component={EditItemPage} />
                <Route exact path="/app/salesorder/discount" component={DiscountPage} />
                <Route exact path="/app/salesorder/discount/add" component={AddDiscountPage} />
                <Route exact path="/app/salesorder/discount/:discount/edit" component={EditDiscountPage} />
                <Route exact path="/app/salesorder/promotion" component={PromotionPage} />
                <Route exact path="/app/salesorder/promotion/add" component={AddPromotionPage} />
                <Route exact path="/app/salesorder/promotion/:promotion/edit" component={EditPromotionPage} />
                <Route exact path="/app/salesorder/coupon/add" component={AddCouponPage} />
                <Route exact path="/app/salesorder/coupon/:coupon/edit" component={EditCouponPage} />
                {/* <Route exact path="/app/salesorder/setting" component={SettingPage} /> */}
                <Route exact path="/app/salesorder/group" component={GroupPage} />
                <Route exact path="/app/salesorder/group/add" component={AddGroupPage} />
                <Route exact path="/app/salesorder/group/:group/edit" component={EditGroupPage} />
                <Route exact path="/app/salesorder/itemcategory" component={ItemCategoryPage} />
                <Route exact path="/app/salesorder/itemcategory/:itemcategory/edit" component={EditItemCategoryPage} />
                <Route exact path="/app/salesorder/companyusers" component={CompanyUsersPage} />
                <Route exact path="/app/salesorder/companyusers/:company_id/:company_entity_name/setting" component={SettingPage} />
                <Route exact path="/app/salesorder/companyusers/:user_id/edit" component={EditCompanyUserPage} />
                <Route exact path="/app/live-tracking" component={LiveTrackingPage} />
                <Route exact path="/app/visit" component={VisitPage} />
                <Route exact path="/app/visit/visiting-reason/add" component={AddVisitingReasonPage} />
                <Route exact path="/app/visit/visiting-reason/:id" component={DetailVisitingReasonPage} />
                <Route exact path="/app/visit/product/add" component={AddProductPage} />
                <Route exact path="/app/outcome" component={OutcomePage} />
                <Route exact path="/app/outcome/add" component={AddOutcomePage} />
                <Route component={Error} />
              </Switch>
            </Grid>
            <Footer />
          </div>
        </div>
      </>
    </div>
  );
}

export default withRouter(Layout);
