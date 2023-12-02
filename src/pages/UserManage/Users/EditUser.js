import React, { useState, useEffect } from "react";
import { Grid, Input, IconButton, Switch, FormControlLabel, Divider, Button } from "@material-ui/core";

// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./styles";

// components
import Widget from "../../../components/Widget/Widget";
import { Typography } from "../../../components/Wrappers/Wrappers";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import { bindActionCreators } from "redux";
import CustomDatePicker from "../../../components/FormControls/CustomDatePicker";
import CustomInput from "../../../components/FormControls/CustomInput";
import CustomCombobox from "../../../components/FormControls/CustomCombobox";
import * as Icons from "@material-ui/icons";
import { toast, ToastContainer } from "react-toastify";
import Notification from "../../../components/Notification/Notification";
import fetchCompany from "../../../services/company/CompanyService";
import fetchBranch from "../../../services/branch/BranchServices";
import { SERVER_URL } from '../../../common/config';

const positions = [
  toast.POSITION.TOP_LEFT,
  toast.POSITION.TOP_CENTER,
  toast.POSITION.TOP_RIGHT,
  toast.POSITION.BOTTOM_LEFT,
  toast.POSITION.BOTTOM_CENTER,
  toast.POSITION.BOTTOM_RIGHT,
];

function EditUser(props) {
  var classes = useStyles();
  let history = useHistory();
  const userData = useSelector(state => state.user);
  const [errorToastId, setErrorToastId] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  var [notificationsPosition, setNotificationPosition] = useState(2);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0)
  const companyData = useSelector(state => state.company);
  const branchData = useSelector(state => state.branch);

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

  // input form datas
  const [state, setState] = useState({
    full_name: '',
    password: "",
    email: "",
    phone_number: '',
    company_id: '',
    company_entity_name: '',
    branch_id: '',
    branch_name: '',
    isActive: false
  })

  const update_id = props.match.params.user
  useEffect(() => {
    props.fetchBranch();
    setDataSource(branchData.data);
    props.fetchCompany();
    setDataSource(companyData.data);
    getUserInfo(update_id)
  }, [])

  const getUserInfo = (user_id) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user_id
      })
    };
    fetch(`${SERVER_URL}getUserInfoById`, requestOptions)
      .then(async response => {
        const data = await response.json();
        console.log("Response Data=============>", data)
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        setState(() => ({
          ...state,
          full_name: data[0].full_name,
          password: data[0].password,
          email: data[0].email,
          phone_number: data[0].phone_number,
          company_id: data[0].company_id.toString(),
          company_entity_name: data[0].company_entity_name,
          branch_id: data[0].branch_id ? data[0].branch_id.toString() : "0",
          branch_name: data[0].branch_name,
          isActive: data[0].isActive
        }))
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

  const updateUserInfo = (user_id) => {
    console.log('state in updateUserInfo', state);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user_id,
        full_name: state.full_name,
        email: state.email,
        phone_number: state.phone_number,
        company_id: state.company_id,
        isAdmin: false,
        isActive: state.isActive,
        sales_target: 0,
        branch_id: state.branch_id,
        allow_so: 0
      })
    };
    fetch(`${SERVER_URL}updateUser`, requestOptions)
      .then(async response => {
        const data = await response.json();
        console.log("Response Data=============>", data)
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        handleNotificationCall("shipped");
      })
      .catch(error => {
        handleNotificationCall("error");
        console.error('There was an error!', error);
      });
  }

  const objArray2Array = (original) => {
    console.log('company data original ====> ', original, companyData.data)
    let tmp = [];
    if (Boolean(original)) {
      if (original.length) {
        original.map(item => {
          tmp.push(item?.company_entity_name);
        })
        return tmp;
      }
      return [];
    } else {
      return []
    }
  }

  const branchObjArrayConverter = (original) => {
    let tmp = [];
    if (Boolean(original)) {
      if (original.length) {
        original.map(item => {
          if (item.company_id == state.company_id) {
            tmp.push(item?.branch_name);
          }
        })
        return tmp;
      }
      return [];
    } else {
      return []
    }
  }
  const companies = objArray2Array(companyData.company)

  const branches = branchObjArrayConverter(branchData.company)

  const setCompanyIdfromCompanyName = (company_entity_name) => {
    let object = companyData.company.filter(item => item.company_entity_name === company_entity_name)
    if (object[0] != null) {
      setState({
        ...state,
        company_id: object[0].company_id.toString()
      })
    }
  }

  const setBranchIdfromBranchName = (branch_name) => {

    let object = branchData.company.filter(item => item.branch_name === branch_name)
    console.log('in setbranch object', object)
    if (object[0] != null) {
      setState({
        ...state,
        branch_id: object[0].branch_id.toString()
      })
    }
  }
  //input fields event
  const handleChange = (e, field) => {
    let comboFields = ['company_entity_name'];
    let branchFields = ['branch_name'];
    if (comboFields.includes(field)) {
      setCompanyIdfromCompanyName(e)
      setState(prevState => ({
        ...prevState, [field]: e
      }))
    } else if (branchFields.includes(field)) {
      setBranchIdfromBranchName(e)
      setState(prevState => ({
        ...prevState, [field]: e
      }))
    } else if (e.target.name == 'isActive') {
      setState({ ...state, [e.target.name]: e.target.checked });
    } else {
      const { name, value } = e.target;
      setState(prevState => ({
        ...prevState, [field]: value
      }))
    }
  }


  const onSave = () => {
    if (state.full_name == null || state.full_name == "") {
      notify("Please enter name.")
      return
    } else if (state.email.length < 3 || validateEmail(state.email) == false) {
      notify("Please enter valid email.");
      return
    } else if (state.phone_number.length == 0 || state.phone_number.length < 7) {
      notify('Please enter valid phone number')
      return
    } else if (state.company_entity_name.length == null || state.company_entity_name == "") {
      notify("Please enter company name.")
      return
    } else {
      updateUserInfo(update_id)
    }
  }

  const onCancel = () => {
    history.push("/app/usermanage/user");
  }

  return (
    <>
      <PageTitle title="Edit User" />
      <Grid container spacing={4}>
        <ToastContainer
          className={classes.toastsContainer}
          closeButton={
            <CloseButton className={classes.notificationCloseButton} />
          }
          closeOnClick={false}
          progressClassName={classes.notificationProgress}
        />
        <Grid item xs={12} md={12}>
          <Widget title="" disableWidgetMenu>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                <CustomInput req={true} title="Full Name" value={state.full_name}
                  handleChange={(e) => handleChange(e, 'full_name')} />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                <CustomInput title="Email" value={state.email} handleChange={(e) => handleChange(e, 'email')} />
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                <CustomInput title="Phone Number" value={state.phone_number} handleChange={(e) => handleChange(e, 'phone_number')} />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                <CustomCombobox req={true} addbtn={false} name="Company Name" items={companies} value={state.company_entity_name}
                  handleChange={(e) => handleChange(e, 'company_entity_name')} />
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                <CustomCombobox req={true} addbtn={false} name="Branch Name" items={branches} value={state.branch_name}
                  handleChange={(e) => handleChange(e, 'branch_name')} />
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                <Typography>Activate</Typography>
                <Grid component="label" container alignItems="center" spacing={0}>
                  <FormControlLabel
                    control={<Switch checked={state.isActive} onChange={handleChange} name="isActive" />}
                    label="Active"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Divider />
            <Grid container spacing={1}>
              <Grid item xs={8} md={8} lg={8}></Grid>
              <Grid item xs={4} md={4} lg={4}>
                <Grid container spacing={2} className={classes.buttonContainer}>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                      startIcon={<Icons.Cancel />}
                      onClick={() => onCancel()}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      startIcon={<Icons.Save />}
                      onClick={() => onSave()}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Widget>
        </Grid>
      </Grid>
    </>
  );

  /**
   * Notification Bar Functions
   * @param {*} componentProps 
   * @param {*} options 
   */
  // #############################################################
  function sendNotification(componentProps, options) {
    return toast(
      <Notification
        {...componentProps}
        className={classes.notificationComponent}
      />,
      options,
    );
  }

  function retryErrorNotification() {
    var componentProps = {
      type: "message",
      message: "Message was sent successfully!",
      variant: "contained",
      color: "success",
    };
    toast.update(errorToastId, {
      render: <Notification {...componentProps} />,
      type: "success",
    });
    setErrorToastId(null);
  }

  function handleNotificationCall(notificationType) {
    var componentProps;

    if (errorToastId && notificationType === "error") return;

    switch (notificationType) {
      case "info":
        componentProps = {
          type: "feedback",
          message: "New user feedback received",
          variant: "contained",
          color: "primary",
        };
        break;
      case "error":
        componentProps = {
          type: "message",
          message: "Something went wrong!",
          variant: "contained",
          color: "secondary",
          extraButton: "Resend",
          extraButtonClick: retryErrorNotification,
        };
        break;
      default:
        componentProps = {
          type: "shipped",
          message: "The item was successfully saved!",
          variant: "contained",
          color: "success",
        };
    }

    var toastId = sendNotification(componentProps, {
      type: notificationType,
      position: positions[notificationsPosition],
      progressClassName: classes.progress,
      onClose: notificationType === "error" && (() => setErrorToastId(null)),
      className: classes.notification,
    });

    if (notificationType === "error") setErrorToastId(toastId);
  }

  function changeNotificationPosition(positionId) {
    setNotificationPosition(positionId);
  }
  // #############################################################
  function CloseButton({ closeToast, className }) {
    return <Icons.Close className={className} onClick={closeToast} />;
  }

}

const mapStateToProps = state => ({
  company: state.company
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCompany: fetchCompany,
  fetchBranch: fetchBranch,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditUser);