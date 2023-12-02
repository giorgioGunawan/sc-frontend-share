import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
// components
import Layout from "./Layout/Layout";
import Layout1 from "./Layout/Layout1";

// pages
import Error from "../pages/error";
import Success from "../pages/success/success"
import Login from "../pages/login";

// context
import { useUserState } from "../context/UserContext";

export default function App() {
  // global
  var { isAuthenticated, adminID } = useUserState();
  console.log('auth ================> ', isAuthenticated)
  console.log('auth ================> ', adminID)
  return (
    <HashRouter>
      <Switch>
        {/* {
          isAuthenticated == 0 && <Redirect to="/login" />
        } */}

        <Route exact path="/" render={() => <Redirect to="/app" />} />
        <PrivateRoute path="/app" component={(adminID == 1) ? Layout : Layout1} />
        {/* <PrivateRoute path="/app1" component={Layout1} /> */}
        <PublicRoute path="/login" component={Login} />
        <PublicRoute path="/success" component={Success} />
        <Route component={Error} />
      </Switch>
    </HashRouter>
  );

  // #######################################################################

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
              <Redirect
                to={{
                  pathname: "/login",
                  state: {
                    from: props.location,
                  },
                }}
              />
            )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          ) : (
              React.createElement(component, props)
            )
        }
      />
    );
  }
}
