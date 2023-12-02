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
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages

// context
import { useLayoutState } from "../../context/LayoutContext";
import { Grid } from "@material-ui/core";
import Error from "../../pages/error/Error";
import AdminPage from "../../pages/UserManage/Admins/Admins";
import EditAdminPage from "../../pages/UserManage/Admins/EditAdmin";
import AddAdminPage from "../../pages/UserManage/Admins/AddAdmin";
import UserPage from "../../pages/UserManage/Users/Users";
import EditUserPage from "../../pages/UserManage/Users/EditUser";
import AddUserPage from "../../pages/UserManage/Users/AddUser";
import BranchesPage from "../../pages/Branches/Branches";
import AddBranchPage from '../../pages/Branches/AddBranch';
import EditBranchPage from "../../pages/Branches/EditBranch";
import CompanyPage from "../../pages/Companys/Companys";
import AddCompanyPage from "../../pages/Companys/AddCompany";
import EditCompanyPage from "../../pages/Companys/EditCompany";
import ClientsPage from "../../pages/Client/index.js";
import AddClientPage from "../../pages/Client/AddClient";
import EditClientPage from "../../pages/Client/EditClient";
import SalesPage from "../../pages/Sales/index.js";
import EditSalesPage from "../../pages/Sales/EditSales";
import AddSalesPage from "../../pages/Sales/AddSales";
import SchedulePage from "../../pages/Schedule/Schedule";
import Footer from "../Footer/Footer";
import LiveTrackingPage from "../../pages/LiveTracking";
import SettingsLiveTrackingPage from "../../pages/Settings/LiveTracking/index.js";
import DetailSettingsLiveTrackingPage from "../../pages/Settings/LiveTracking/Detail.js";
import VisitPage from "../../pages/Settings/Visit";
import AddVisitingReasonPage from "../../pages/Settings/Visit/Detail/VisitingReason/Add";
import AddProductPage from "../../pages/Settings/Visit/Detail/Product/Add";
import VisitDetailPage from "../../pages/Settings/Visit/Detail";
import EditProductPage from "../../pages/Settings/Visit/Detail/Product/Edit";
import EditVisitingReasonPage from "../../pages/Settings/Visit/Detail/VisitingReason/Edit";
import OutcomePage from "../../pages/Settings/Outcome";
import AddOutcomePage from "../../pages/Settings/Outcome/Detail/Add";
import EditOutcomePage from "../../pages/Settings/Outcome/Detail/Edit";
import OutcomeListDetailPage from "../../pages/Settings/Outcome/Detail";

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
          <div className={classnames(classes.mainContainer,{
            [classes.padding1600]: matches1600,
            [classes.padding1800]: matches1800,
            }
          )}>
            <Grid>
              <Switch>
                <Route exact path="/app/usermanage" component={AdminPage} />
                <Route
                  exact
                  path="/app"
                  render={() => <Redirect to="/app/usermanage/admin" />}
                />
                <Route exact path="/app/usermanage/admin" component={AdminPage} /> 
                <Route exact path="/app/usermanage/admin/:admin/edit" component={EditAdminPage} /> 
                <Route exact path="/app/usermanage/admin/add" component={AddAdminPage} />
                <Route exact path="/app/usermanage/user" component={UserPage} /> 
                <Route exact path="/app/usermanage/user/:user/edit" component={EditUserPage} /> 
                <Route exact path="/app/usermanage/user/add" component={AddUserPage} />
                <Route exact path="/app/branch" component={BranchesPage} />
                <Route exact path="/app/branch/add" component={AddBranchPage} />
                <Route exact path="/app/branch/:branch/edit" component={EditBranchPage} />
                <Route exact path="/app/company" component={CompanyPage} />
                <Route exact path="/app/company/add" component={AddCompanyPage} />
                <Route exact path="/app/company/:company/edit" component={EditCompanyPage} />
                <Route exact path="/app/client" component={ClientsPage} />
                <Route exact path="/app/client/add" component={AddClientPage} />
                <Route exact path="/app/client/:client/edit" component={EditClientPage} />
                <Route exact path="/app/sales" component={SalesPage} />
                <Route exact path="/app/sales/:sales/edit" component={EditSalesPage} />
                <Route exact path="/app/sales/add" component={AddSalesPage} />
                <Route exact path="/app/schedule" component={SchedulePage} />
                <Route exact path="/app/live-tracking" component={LiveTrackingPage} />
                <Route exact path="/app/settings/live-tracking" component={SettingsLiveTrackingPage} />
                <Route exact path="/app/settings/live-tracking/:company_id" component={DetailSettingsLiveTrackingPage} />
                <Route exact path="/app/settings/visit" component={VisitPage} />
                <Route exact path="/app/settings/visit/detail/:company_id/visiting-reason/add" component={AddVisitingReasonPage} />
                <Route exact path="/app/settings/visit/detail/:company_id/visiting-reason/:id" component={EditVisitingReasonPage} />
                <Route exact path="/app/settings/visit/detail/:company_id/product/add" component={AddProductPage} />
                <Route exact path="/app/settings/visit/detail/:company_id/product/:id" component={EditProductPage} />
                <Route exact path="/app/settings/visit/detail/:company_id" component={VisitDetailPage} />
                <Route exact path="/app/settings/outcome" component={OutcomePage} />
                <Route exact path="/app/settings/outcome/:company_id" component={OutcomeListDetailPage} />
                <Route exact path="/app/settings/outcome/:company_id/add" component={AddOutcomePage} />
                <Route exact path="/app/settings/outcome/:company_id/:id" component={EditOutcomePage} />
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
