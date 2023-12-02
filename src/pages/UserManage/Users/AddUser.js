import React, { useState, useEffect } from "react";
import { Grid, Input, IconButton, Divider, Button } from "@material-ui/core";

// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./styles";

// components
import Widget from "../../../components/Widget/Widget";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import { bindActionCreators } from "redux";
import CustomInput from "../../../components/FormControls/CustomInput";
import CustomCombobox from "../../../components/FormControls/CustomCombobox";
import * as Icons from "@material-ui/icons";
import Notification from "../../../components/Notification/Notification";
import fetchCompany from "../../../services/company/CompanyService";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../../common/config';

const positions = [
    toast.POSITION.TOP_LEFT,
    toast.POSITION.TOP_CENTER,
    toast.POSITION.TOP_RIGHT,
    toast.POSITION.BOTTOM_LEFT,
    toast.POSITION.BOTTOM_CENTER,
    toast.POSITION.BOTTOM_RIGHT,
];

function AddUser(props) {
    var classes = useStyles();
    let history = useHistory();
    const [errorToastId, setErrorToastId] = useState(null);
    const [dataSource, setDataSource] = useState([]);
    var [notificationsPosition, setNotificationPosition] = useState(2);
    const companyData = useSelector(state => state.company);

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

    useEffect(() => {
        props.fetchCompany();
        console.log(companyData)
        setDataSource(companyData.data);
    }, [])

    console.log("Add Admin get companys ====> ", companyData.company)

    const objArray2Array = (original) => {
        console.log('originall ====> ', original, companyData.data)
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

    const companies = objArray2Array(companyData.company)

    // input form datas
    const [state, setState] = useState({
        full_name: '',
        password: "",
        email: "",
        phone_number: '',
        company_id: "",
        company_entity_name: "",
        sales_target: 0,
        allow_so: 0
    })


    const setCompanyIdfromCompanyName = (company_entity_name) => {
        let object = companyData.company.filter(item => item.company_entity_name == company_entity_name)
        if (object[0] != null) {
            setState({
                ...state,
                company_id: object[0].company_id.toString()
            })
        }

    }

    //input fields event
    const handleChange = (e, field) => {
        let comboFields = ['company_entity_name'];
        if (comboFields.includes(field)) {
            setCompanyIdfromCompanyName(e)
            setState(prevState => ({
                ...prevState, [field]: e
            }))
        } else {
            const { name, value } = e.target;
            setState(prevState => ({
                ...prevState, [field]: value
            }))
        }
    }

    const onSaveandNew = () => {
        if (state.full_name == null || state.full_name == "") {
            notify("Please enter name.")
            return
        } else if (state.email.length < 3 || validateEmail(state.email) == false) {
            notify("Please enter valid email.");
            return
        } else if (state.phone_number.length == 0 || state.phone_number.length < 7) {
            notify('Please enter valid phone number')
            return
        } else if (state.company_entity_name == null || state.company_entity_name == "") {
            notify("Please enter company name.")
            return
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: state.full_name,
                    password: state.password,
                    email: state.email,
                    phone_number: state.phone_number,
                    company_id: state.company_id,
                    sales_target: 0,
                    allow_so: 0,
                    isAdmin: false,
                    isActive: false
                })
            };
            fetch(`${SERVER_URL}addUser`, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log("Response Data=============>", data)
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    } else if (data.user_id != null) {
                        notify("This user is already exist.\n Please use another email.")
                        return
                    } else if (data.id != 0) {
                        handleNotificationCall("shipped");
                        setState(() => ({
                            full_name: '',
                            password: "",
                            email: "",
                            phone_number: '',
                            company_id: "",
                            company_entity_name: ""
                        }))
                    }

                })
                .catch(error => {
                    notify('Something went wrong!\n' + error)
                    console.error('There was an error!', error);
                });

        }

    }
    const onSaveandBack = () => {
        if (state.full_name == null || state.full_name == "") {
            notify("Please enter name.")
            return
        } else if (state.email.length < 3 || validateEmail(state.email) == false) {
            notify("Please enter valid email.");
            return
        } else if (state.phone_number.length == 0 || state.phone_number.length < 7) {
            notify('Please enter valid phone number')
            return
        } else if (state.company_entity_name == null || state.company_entity_name == "") {
            notify("Please enter company name.")
            return
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: state.full_name,
                    password: state.password,
                    email: state.email,
                    phone_number: state.phone_number,
                    company_id: state.company_id,
                    sales_target: 0,
                    allow_so: 0,
                    isAdmin: false,
                    isActive: false
                })
            };
            fetch(`${SERVER_URL}addUser`, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log("Response Data=============>", data)
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    } else if (data.user_id != null) {
                        notify("This user is already exist.\n Please use another email.")
                        return
                    } else if (data.id != 0) {
                        handleNotificationCall("shipped");
                        setState(() => ({
                            full_name: '',
                            password: "",
                            email: "",
                            phone_number: '',
                            company_id: "",
                            company_entity_name: ""
                        }))
                        history.push("/app/usermanage/user");
                    }

                })
                .catch(error => {
                    notify('Something went wrong!\n' + error)
                    console.error('There was an error!', error);
                });

        }

    }

    const onCancel = () => {
        history.push("/app/usermanage/user");
    }

    return (
        <>
            <PageTitle title="New User" />
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
                            <Grid item xs={8} md={8} lg={8}></Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <Grid container spacing={2} className={classes.buttonContainer}>
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
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput req={true} title="Full Name" value={state.full_name}
                                    handleChange={(e) => handleChange(e, 'full_name')} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Email" value={state.email}
                                    handleChange={(e) => handleChange(e, 'email')} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Password" value={state.password}
                                    handleChange={(e) => handleChange(e, 'password')} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Phone Number" value={state.phone_number} type="number"
                                    handleChange={(e) => handleChange(e, 'phone_number')} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>

                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomCombobox req={true} addbtn={false} name="Company Name" items={companies} value={state.company_entity_name}
                                    handleChange={(e) => handleChange(e, 'company_entity_name')} />
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
                                            color="primary"
                                            className={classes.button}
                                            startIcon={<Icons.Save />}
                                            onClick={() => onSaveandNew()}
                                        >
                                            Save & New
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            startIcon={<Icons.Save />}
                                            onClick={() => onSaveandBack()}
                                        >
                                            Save & Back
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
                    message: "Message was not sent!",
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
    fetchCompany: fetchCompany
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddUser);
