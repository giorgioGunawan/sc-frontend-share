import React, { useState } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Fade,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Paper from '@mui/material/Paper';

import sclogo from './../../assets/images/feature-image.jpeg';
// styles
import useStyles from "./styles";

// context
import { useUserDispatch, loginUser, signUp } from "../../context/UserContext";

function Login(props) {
  var classes = useStyles();

  // global
  var userDispatch = useUserDispatch();

  // local
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  var [activeTabId, setActiveTabId] = useState(0);
  var [nameValue, setNameValue] = useState("");
  var [loginValue, setLoginValue] = useState("");
  var [passwordValue, setPasswordValue] = useState("");
  var [confirmValue, setConfirmValue] = useState("");
  var [phoneNumberValue, setPhoneNumberValue] = useState("");
  var [companyIDValue, setCompanyIDValue] = useState("");

  //Show notification
  const notify = (message) => toast(message);
  
  //Email Validation
  const validateEmail = (email) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
      return false;
    } else {
      return true
    }
  }

  //Login
  const onLogin = () => {
    if (loginValue.length < 3 || validateEmail(loginValue) == false) {
      notify("Please enter valid email.");
      return
    } 
    else {
      loginUser(
        userDispatch,
        loginValue,
        passwordValue,
        props.history,
        setIsLoading,
        setError,
      )
    }
  }

  //Sign up
  const onSignup = () => {
    if (nameValue < 0) {
      notify("Please enter name");
      return
    } else if (loginValue.length < 3 || validateEmail(loginValue) == false) {
      notify("Please enter valid email.");
      return
    } else if (phoneNumberValue.length != 10 ) {
      notify("Please enter valid phone number.")
      return
    } else if (companyIDValue.length < 1 ) {
      notify("Please enter company id.")
      return
    } else if ( passwordValue.length < 6) {
      notify('Password length should be at least 6 characters.')
      return
    } else if ( confirmValue.length < 6) {
      notify('Please confirm password')
      return
    } else if ( passwordValue != confirmValue) {
      notify('Password is not match.')
      return
    } else {
      signUp(
        userDispatch,
        nameValue,
        passwordValue,
        loginValue,
        phoneNumberValue,
        companyIDValue,
        true,
        false,
        props.history,
        setIsLoading,
        setError,
      )
    }
  }

  return (
    
    <Grid container className={classes.container}>
      <Paper elevation={3} className={classes.customPaper}>
      <ToastContainer />
      
      <div className={classes.formContainer}>
        <div className={classes.form}>
          <Tabs
            value={activeTabId}
            onChange={(e, id) => setActiveTabId(id)}
            indicatorColor="secondary"
            textColor="secondary"
            centered
          >
            {/**<Tab label="Login" classes={{ root: classes.tab }} />
            <Tab label="New User" classes={{ root: classes.tab }} />**/}
          </Tabs>
          {activeTabId === 0 && (
            <React.Fragment>
              <div style={{display: "flex", width: "full", justifyContent:"center"}}>
                <img src={sclogo} style={{width:"200px"}} alt="Scout Hippo" className={classes.logo} />
              </div>
            <Fade in={error}>
              <Typography color="secondary" className={classes.errorMessage}>
                Something is wrong with your login or password :(
              </Typography>
            </Fade>
            <TextField
              id="email"
              InputProps={{
                classes: {
                  underline: classes.textFieldUnderline,
                  input: classes.textField,
                },
              }}
              value={loginValue}
              onChange={e => setLoginValue(e.target.value)}
              margin="normal"
              placeholder="Email Adress"
              type="email"
              fullWidth
            />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <div className={classes.formButtons} style={{justifyContent: "right"}}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                    <Button
                      disabled={
                        loginValue.length === 0 || passwordValue.length === 0
                      }
                      onClick={onLogin}
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      Login
                    </Button>
                  )}
              </div>
            </React.Fragment>
          )}
          {activeTabId === 1 && (
            <React.Fragment>
              <Typography variant="h3" className={classes.greeting}>
                Welcome!
              </Typography>
              <Typography variant="h4" className={classes.subGreeting}>
                Create your account
              </Typography>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  
                </Typography>
              </Fade>
              <TextField
                id="name"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={nameValue}
                onChange={e => setNameValue(e.target.value)}
                margin="normal"
                placeholder="Full Name"
                type="text"
                fullWidth
              />
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginValue}
                onChange={e => setLoginValue(e.target.value)}
                margin="normal"
                placeholder="Email Adress"
                type="email"
                fullWidth
              />
              <TextField
                id="phone_number"
                margin="normal"
                placeholder="Phone Number"
                type="number"
                onChange={e => setPhoneNumberValue(e.target.value)}
                fullWidth
              />
              <TextField
                id="company_id"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={companyIDValue}
                onChange={e => setCompanyIDValue(e.target.value)}
                margin="normal"
                placeholder="Company ID"
                type="text"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <TextField
                id="confirm"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={confirmValue}
                onChange={e => setConfirmValue(e.target.value)}
                margin="normal"
                placeholder="Confirm Password"
                type="password"
                fullWidth
              />
              <div className={classes.creatingButtonContainer}>
                {isLoading ? (
                  <CircularProgress size={26} />
                ) : (
                    <Button
                      onClick={onSignup}
                      disabled={
                        loginValue.length === 0 ||
                        passwordValue.length === 0 ||
                        nameValue.length === 0
                      }
                      size="large"
                      variant="contained"
                      color="primary"
                      fullWidth
                      className={classes.createAccountButton}
                    >
                      Create your account
                    </Button>
                  )}
              </div>

            </React.Fragment>
          )}
        </div>
        <Typography color="primary" className={classes.copyright}>
          © 2023 ScoutHippo. All rights reserved.
        </Typography>
      </div>
      </Paper>
    </Grid>
    
  );
}

export default withRouter(Login);
