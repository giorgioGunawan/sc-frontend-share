import React, { useState, useEffect } from "react";
import { Grid, Typography, IconButton, FormControlLabel, Switch, Divider, Button } from "@material-ui/core";
import { TextField, FormControl } from "@material-ui/core";
import { Input, Typography as TypographyD } from 'antd';

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

const { Text } = TypographyD;
const { TextArea } = Input;

const positions = [
    toast.POSITION.TOP_LEFT,
    toast.POSITION.TOP_CENTER,
    toast.POSITION.TOP_RIGHT,
    toast.POSITION.BOTTOM_LEFT,
    toast.POSITION.BOTTOM_CENTER,
    toast.POSITION.BOTTOM_RIGHT,
];

function EditClient(props) {
    var classes = useStyles();
    let history = useHistory();
    const [dataSource, setDataSource] = useState([]);
    const [errorToastId, setErrorToastId] = useState(null);
    var [notificationsPosition, setNotificationPosition] = useState(2);
    const companyData = useSelector(state => state.company);
    //Show notification
    const notify = (message) => toast(message);

    // input form datas
    const [state, setState] = useState({
        id: '',
        entity_name: '',
        custom_field: '',
        address: "",
        location: "",
        phone_number: '',
        company_id: localStorage.getItem('company_id').split(', ')[0],
        company_entity_name: '',
        companyIDList: localStorage.getItem('company_id').split(', '),
        approved: '0',
        created_by: ''
    })

    const update_id = props.match.params.clientview
    useEffect(() => {
        props.fetchCompany();
        setDataSource(companyData.company);
        getClientInfo(update_id)
    }, [])

    const getClientInfo = (client_id) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: client_id
            })
        };
        fetch(`${SERVER_URL}getClientProfileById`, requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                setState(() => ({
                    ...state,
                    entity_name: data.client_entity_name,
                    custom_field: data.custom_field,
                    address: data.address,
                    company_id: data.company_id.toString(),
                    company_entity_name: data.company_entity_name,
                    phone_number: data.phone_number,
                    location: data.location,
                    approved: data.approved,
                    created_by: data.created_by
                }))
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const updateClientInfo = (client_id) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: client_id,
                client_entity_name: state.entity_name,
                custom_field: state.custom_field,
                address: state.address,
                phone_number: state.phone_number,
                location: state.location,
                company_id: state.company_id.toString(),
                approved: state.approved,
                created_by: state.created_by,
                user_id: state.created_by
            })
        };
        console.log("------------------------", requestOptions.body)
        fetch(`${SERVER_URL}updateClient`, requestOptions)
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
        console.log('originall ====> ', original, companyData.company)
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
        } else if(comboFields.includes(field)) {
            setCompanyIdfromCompanyName(e)
            setState(prevState => ({
                ...prevState, [field]: e
            }))
        } else if (e.target.name == "approved") {
            console.log('approved====>', e.target.checked)
            setState({ ...state, [e.target.name]: e.target.checked });
        } else {
            const { name, value } = e.target;
            setState(prevState => ({
                ...prevState, [field]: value
            }))
        }
    }

    const onSave = () => {
        if (state.entity_name == null || state.entity_name == "") {
            notify("Please enter company entity name.")
            return
        } else if (state.custom_field == null || state.custom_field == "") {
            notify("Please enter company custom field.")
            return
        } else if (state.address == null || state.address == "") {
            notify("Please enter company address.")
            return
        } else if (state.location == null || state.location == "") {
            notify("Please enter company location.")
            return
        } else if (state.phone_number.length < 7) {
            notify('Please enter valid phone number')
            return
        } else if (state.company_id.length < 1) {
            notify("Please enter company id.")
            return
        } else {
            updateClientInfo(update_id)
        }
    }

    const onCancel = () => {
        history.push("/app/clientview");
    }

    return (
        <>
            <div className={classes.singlePage}>
                <PageTitle title="Edit Client" />
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
                                    <CustomInput req={true} title="Client Name" value={state.entity_name}
                                        handleChange={(e) => handleChange(e, 'entity_name')} />
                                        &nbsp;&nbsp;
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                    <CustomInput req={true} title="Phone Number" value={state.phone_number} handleChange={(e) => handleChange(e, 'phone_number')} />
                                    &nbsp;&nbsp;
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                
                                <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                    <CustomInput req={true} title="Address" value={state.address} handleChange={(e) => handleChange(e, 'address')} />
                                    &nbsp;&nbsp;
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                    <CustomInput req={true} title="Location(lat lng)" value={state.location} handleChange={(e) => handleChange(e, 'location')} />
                                    &nbsp;&nbsp;
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <div style={{margin:"10px", width: "100%"}}>
                                    <CustomInput req={true} title="Custom Field" textarea={true} value={state.custom_field} handleChange={(e) => handleChange(e, 'custom_field')} />
                                </div>
                            </Grid>
                            &nbsp;&nbsp;

                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                    <Grid item>
                                        <Typography variant={'subtitle1'}>Approved</Typography>
                                    </Grid>
                                    <FormControlLabel
                                        control={<Switch checked={Number(state.approved)} onChange={handleChange} name="approved" />}
                                        label="Approved"
                                    />
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
                                                startIcon={<Icons.ArrowBack />}
                                                onClick={() => onCancel()}
                                            >
                                                Go Back
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
)(EditClient);