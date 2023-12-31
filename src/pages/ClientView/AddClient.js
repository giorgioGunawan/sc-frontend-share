import React, { useState, useEffect } from "react";
import { Grid, Input, IconButton, FormControlLabel, Switch, Divider, Button } from "@material-ui/core";

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
import { toast, ToastContainer } from "react-toastify";
import Notification from "../../components/Notification/Notification";
import { SERVER_URL } from '../../common/config';
import { GOOGLE_MAP_API_KEY } from '../../common/config';
import fetchCompany from "../../services/company/CompanyService";
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
    const [dataSource, setDataSource] = useState([]);
    const companyData = useSelector(state => state.company);

    console.log('g888',companyData)

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

    // input form data
    const [state, setState] = useState({
        id: '',
        entity_name: '',
        custom_field: "",
        address: "",
        location: '',
        phone_number: '',
        company_id: localStorage.getItem('company_id').split(', ')[0],
        companyIDList: localStorage.getItem('company_id').split(', ')
    })

    useEffect(() => {
        props.fetchCompany();
        
        setDataSource(companyData.company);
    }, [])


    const objArray2Array = (original) => {
        console.log('originall ====> ', original, companyData.data)
        let tmp = [];
        if (Boolean(original)) {
            if (original.length) {
                original.map(item => {
                    if (state.companyIDList.includes(item?.company_id.toString())) {
                        tmp.push(item?.company_entity_name);
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

        console.log('gg88888',state);
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
        } else if (state.custom_field == null || state.custom_field == "") {
            notify("Please enter client Custom Field.")
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
        } else if (state.company_id.length < 1) {
            notify("Please enter company id.")
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
                    approved: 1,
                    created_by: localStorage.getItem('user_id')
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
                        setState(state => ({
                            ...state,
                            id: '',
                            entity_name: '',
                            custom_field: "",
                            address: "",
                            location: '',
                            phone_number: '',
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
        } else if (state.custom_field == null || state.custom_field == "") {
            notify("Please enter client Custom Field.")
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
        } else if (state.company_id.length < 1) {
            notify("Please enter company id.")
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
                    approved: 1,
                    created_by: localStorage.getItem('user_id')
                })
            };
            fetch(`${SERVER_URL}addClient`, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log("Response Data=============>", data)
                    if (!response.ok) {
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    } else if (data.client_id != null) {
                        notify("This client is already exist.")
                        return
                    } else if (data.id != 0) {

                        handleNotificationCall("shipped");
                        setState(state => ({
                            ...state,
                            id: '',
                            entity_name: '',
                            custom_field: "",
                            address: "",
                            location: '',
                            phone_number: '',
                        }))
                        history.push("/app/clientview");
                    }

                })
                .catch(error => {
                    notify('Something went wrong!\n' + error)
                    console.error('There was an error!', error);
                });
        }
    }

    const onCancel = () => {
        history.push("/app/clientview");
    }

    return (
        <>
            <div className={classes.singlePage}>
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
                                <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                    <CustomInput placeholder="Client Name" req={true} title="Client Name" value={state.entity_name}
                                        handleChange={(e) => handleChange(e, 'entity_name')} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                    <CustomInput placeholder="Phone Number" title="Phone Number" value={state.phone_number} handleChange={(e) => handleChange(e, 'phone_number')} />
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                    <CustomInput placeholder="Address" title="Address" value={state.address} handleChange={(e) => handleChange(e, 'address')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                    <CustomInput placeholder="Location (Lat, Long)" title="Location(lat lng)" value={state.location} disabled handleChange={(e) => handleChange(e, 'location')} />
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                            <div style={{margin:"10px", width: "100%"}}>
                                <CustomInput textarea={true} placeholder="Custom Field" title="Custom Field" value={state.custom_field} handleChange={(e) => handleChange(e, 'custom_field')} />
                            </div>
                            </Grid>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <br/>
                            <Divider/>
                            <Grid container spacing={1}>
                                <Grid item xs={4} md={4} lg={4}></Grid>
                                <Grid item xs={6} md={6} lg={8}>
                                    <Grid container spacing={4} className={classes.buttonContainer}>
                                        <Grid item xs={3}>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                className={classes.button}
                                                startIcon={<Icons.ArrowBack />}
                                                onClick={() => onCancel()}
                                            >
                                            Go Back
                                            </Button>
                                        </Grid>
                                        <Grid item xs={3}>
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
                                        <Grid item xs={3}>
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
            </div>
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