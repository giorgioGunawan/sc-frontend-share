import React, { useState, useEffect } from "react";
import { Grid, Input, IconButton, Typography, FormControlLabel, Switch, Divider, Button } from "@material-ui/core";

// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./styles";

// components
import Widget from "../../components/Widget/Widget";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import { bindActionCreators } from "redux";
import CustomInput from "../../components/FormControls/CustomInput";
import CustomCombobox from "../../components/FormControls/CustomCombobox";
import * as Icons from "@material-ui/icons";
import fetchCompany from "../../services/company/CompanyService";
import { toast, ToastContainer } from "react-toastify";
import Notification from "../../components/Notification/Notification";
import { SERVER_URL } from '../../common/config';
import { GOOGLE_MAP_API_KEY } from '../../common/config';
import Geocode from "react-geocode";
Geocode.setApiKey(GOOGLE_MAP_API_KEY);

const positions = [
    toast.POSITION.TOP_LEFT,
    toast.POSITION.TOP_CENTER,
    toast.POSITION.TOP_RIGHT,
    toast.POSITION.BOTTOM_LEFT,
    toast.POSITION.BOTTOM_CENTER,
    toast.POSITION.BOTTOM_RIGHT,
];

function AddClient(props) {
    var classes = useStyles();
    let history = useHistory();
    const [errorToastId, setErrorToastId] = useState(null);
    var [notificationsPosition, setNotificationPosition] = useState(2);
    const companyData = useSelector(state => state.company);
    const [dataSource, setDataSource] = useState([]);

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
        id: '',
        entity_name: '',
        custom_field: "",
        address: "",
        location: '',
        phone_number: '',
        company_id: '',
        company_entity_name: '',
        approved: '1',
        created_by: localStorage.getItem('user_id'),
    })


    useEffect(() => {
        props.fetchCompany();
        console.log(companyData)
        setDataSource(companyData.data);
    }, [])


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
        if (field == "address") {
            const { name, value } = e.target;
            console.log("$$$$$$$$$", value)
            setState(prevState => ({
                ...prevState,
                address: value
            }))
            Geocode.fromAddress(value).then(
                response => {
                    const { lat, lng } = response.results[0].geometry.location;
                    console.log(lat, lng);
                    setState(prevState => ({
                        ...prevState,
                        location: lat + ' ' + lng
                    }))
                },
                error => {
                    console.error(error);
                    setState(prevState => ({
                        ...prevState,
                        location: ''
                    }))
                }
            );
        } else if (comboFields.includes(field)) {
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
        if (state.entity_name == null || state.entity_name == "") {
            notify("Please enter client entity name.")
            return
        } else if (state.address == null || state.address == "") {
            notify("Please enter client address.")
            return
        } else if (state.location == null || state.location == "") {
            notify("Please enter client location.")
            return
        } else if (state.phone_number.length == 0 || state.phone_number.length < 7) {
            notify('Please enter valid phone number')
            return
        } else if (state.custom_field == null || state.custom_field == "") {
            notify("Please enter custom field.")
            return
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_entity_name: state.entity_name,
                    custom_field: state.custom_field,
                    address: state.address,
                    phone_number: state.phone_number,
                    location: state.location,
                    company_id: state.company_id,
                    approved: state.approved,
                    created_by: state.created_by
                })
            };
            fetch(`${SERVER_URL}addClient`, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log("Response Data=============>", data)
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    } else if (data.client_id != null) {
                        notify("This client is already exist.")
                        return
                    } else if (data.id != 0) {

                        handleNotificationCall("shipped");
                        setState(() => ({
                            ...state,
                            id: '',
                            entity_name: '',
                            custom_field: "",
                            address: "",
                            location: '',
                            phone_number: '',
                            company_id: '',
                            company_entity_name: '',
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
        if (state.entity_name == null || state.entity_name == "") {
            notify("Please enter client entity name.")
            return
        } else if (state.address == null || state.address == "") {
            notify("Please enter client address.")
            return
        } else if (state.location == null || state.location == "") {
            notify("Please enter client location.")
            return
        } else if (state.phone_number.length == 0 || state.phone_number.length < 7) {
            notify('Please enter valid phone number')
            return
        } else if (state.custom_field == null || state.custom_field == "") {
            notify("Please enter custom field.")
            return
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_entity_name: state.entity_name,
                    custom_field: state.custom_field,
                    address: state.address,
                    phone_number: state.phone_number,
                    location: state.location,
                    company_id: state.company_id,
                    approved: state.approved,
                    created_by: state.created_by
                })
            };
            fetch(`${SERVER_URL}addClient`, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log("Response Data=============>", data)
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    } else if (data.client_id != null) {
                        notify("This client is already exist.")
                        return
                    } else if (data.id != 0) {

                        handleNotificationCall("shipped");
                        setState(() => ({
                            ...state,
                            id: '',
                            entity_name: '',
                            custom_field: "",
                            address: "",
                            location: '',
                            phone_number: '',
                            company_id: '',
                            company_entity_name: '',
                        }))
                        history.push("/app/client");
                    }

                })
                .catch(error => {
                    notify('Something went wrong!\n' + error)
                    console.error('There was an error!', error);
                });
        }
    }

    const onCancel = () => {
        history.push("/app/client");
    }

    return (
        <>
            <PageTitle title="New Client" />
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
                                <CustomInput req={true} title="Entity Name" value={state.entity_name}
                                    handleChange={(e) => handleChange(e, 'entity_name')} />
                                &nbsp;&nbsp;
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Custom Field" value={state.custom_field} handleChange={(e) => handleChange(e, 'custom_field')} />
                                &nbsp;&nbsp;
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Phone Number" value={state.phone_number} type="number" maxLength={10}
                                    handleChange={(e) => handleChange(e, 'phone_number')} />
                                &nbsp;&nbsp;
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomCombobox req={true} name="Company Name" items={companies} value={state.company_entity_name}
                                    handleChange={(e) => handleChange(e, 'company_entity_name')} />
                                &nbsp;&nbsp;
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Address" value={state.address} handleChange={(e) => handleChange(e, 'address')} />
                                &nbsp;&nbsp;
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Location(For example: -123.1231 -23.3452)" value={state.location} handleChange={(e) => handleChange(e, 'location')} />
                                &nbsp;&nbsp;
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
)(AddClient);