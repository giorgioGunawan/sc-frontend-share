import React from "react";
import { loginApi, signUpApi } from "../services/auth/Auth";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();
var adminID = 0;

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return { ...state, loading: true, isAuthenticated: true };
    case "LOGIN_SUCCESS":
      return { ...state, loading: false, isAuthenticated: true, adminID: adminID };
    case "SIGN_OUT_SUCCESS":
      return { ...state, loading: false, isAuthenticated: 0 };
    case "LOGIN_FAILURE":
      return { ...state, loading: false, isAuthenticated: 0 };
    case "SIGNUP_REQUEST":
      return { ...state, loading: true, isSignup: true };
    case "SIGNUP_SUCCESS":
      return { ...state, loading: false, isSignup: state.isSignup };
    case "SIGNUP_FAILURE":
      return { ...state, loading: false, isSignup: 0 };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
    adminID: localStorage.getItem("id_token")
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signUp, signOut };

// ###########################################################

function loginUser(dispatch, login, password, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);

  dispatch({ type: 'LOGIN_REQUEST', history: history });

  // auth api
  loginApi({ email: login, password: password }).then(res => {
    console.log("Login=====> ", res)
    if (res.data.user_id == 0 || res.data.user_id == undefined) {
      dispatch({ type: "LOGIN_FAILURE" });
      history.push('/login');
    } else {
      let check_id = res.data.isSuperAdmin;
      if (check_id == 1) {
        localStorage.setItem('id_token', 1)
        localStorage.setItem('user_id', res.data.user_id)
        localStorage.setItem('full_name', res.data.full_name)
        adminID = 1
        setError(true)
        setIsLoading(false)
        dispatch({ type: 'LOGIN_SUCCESS', token: res.data.rememberToken })

        history.push('/app')
      } else if (check_id == 0) {
        localStorage.setItem('id_token', 2)
        localStorage.setItem('company_id', res.data.company_id)
        localStorage.setItem('branch_id', res.data.branch_id)
        localStorage.setItem('user_id', res.data.user_id)
        localStorage.setItem('full_name', res.data.full_name)
        localStorage.setItem('allow_so', res.data.allow_so)
        localStorage.setItem('isDirector', res.data.isDirector)
        console.log('res.data', res.data)
        adminID = 2
        setError(null)
        setIsLoading(false)
        dispatch({ type: 'LOGIN_SUCCESS' })

        history.push('/app')
      } else {
        history.push('/login');
      }
    }
  }).catch(err => {
      dispatch({ type: "LOGIN_FAILURE" });
      history.push('/login')
      setError(err);
      setIsLoading(false);
  })

}

function signUp(dispatch, full_name, password, email, phone_number, company_id, isAdmin, isActive, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);

  dispatch({ type: 'SIGNUP_REQUEST', history: history });

  // auth api
  signUpApi({ full_name: full_name, password: password, email: email, phone_number: phone_number, company_id: company_id, isAdmin: isAdmin, isActive: isActive }).then(res => {
    if (res.data.user_id != null) {
      setError("This user is already exist!\n Please use another email.")
      history.push('/login');
    } else if (res.data == null) {
      setError("The company id is not exist.")
      history.push('/login');
    } else {
      setTimeout(() => {
        setError(true)
        setIsLoading(false)
        dispatch({ type: 'SIGNUP_SUCCESS' })
        history.push('/success')
      }, 2000);
    }
  }).catch(err => {
    dispatch({ type: "SIGNUP_FAILURE" });
    history.push('/login')
    setError(err);
    setIsLoading(false);
  })

}

function signOut(dispatch, history) {
  localStorage.removeItem("id_token");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
