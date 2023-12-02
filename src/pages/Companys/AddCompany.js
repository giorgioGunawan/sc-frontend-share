import React, { useState, useEffect } from "react";
import { Grid, Input, IconButton, FormControlLabel, Switch, Divider, Button } from "@material-ui/core";
// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./styles";
// components
import Widget from "../../components/Widget/Widget";
import { Typography } from "../../components/Wrappers/Wrappers";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useHistory, useParams } from "react-router-dom";
import CustomInput from "../../components/FormControls/CustomInput";
import * as Icons from "@material-ui/icons";
import { toast, ToastContainer } from "react-toastify";
import Notification from "../../components/Notification/Notification";
import UploadFiles from "../../components/Upload/upload-files.component";
import { SERVER_URL } from '../../common/config';
// import LocationPicker from 'react-location-picker';

const positions = [
    toast.POSITION.TOP_LEFT,
    toast.POSITION.TOP_CENTER,
    toast.POSITION.TOP_RIGHT,
    toast.POSITION.BOTTOM_LEFT,
    toast.POSITION.BOTTOM_CENTER,
    toast.POSITION.BOTTOM_RIGHT,
];


export default function AddCompany(props) {
    var classes = useStyles();
    let history = useHistory();
    const [errorToastId, setErrorToastId] = useState(null);
    var [notificationsPosition, setNotificationPosition] = useState(2);

    // const [location, setLocation] = useState('');
    // const [defaultPosition, setDefaultPosition] = useState({
    //     lat: 0,
    //     lng: 0
    // })

    //Show notification
    const notify = (message) => toast(message);

    // input form datas

    const [state, setState] = useState({
        id: '',
        entity_name: '',
        owner_name: '',
        address: '',
        phone_number: "",
        time_limit_per_schedule: 30,
        late_policy: 60,
        min_schedule_time: 60,
        max_schedule_time: 360,
        notes: 1,
        upload: 0,
        company_info: []
    })

    useEffect(() => {
        // navigator.geolocation.getCurrentPosition(function (position) {
        //     console.log("Latitude is :", position.coords.latitude);
        //     console.log("Longitude is :", position.coords.longitude);
        //     setDefaultPosition({
        //         lat: position.coords.latitude,
        //         lng: position.coords.longitude
        //     })
        // });
    }, [])

    //input fields event
    const handleChange = (e, field) => {
        if (e.target.name == "notes" || e.target.name == "upload") {
            setState({ ...state, [e.target.name]: e.target.checked });
        } else {
            const { name, value } = e.target;
            setState(prevState => ({
                ...prevState, [field]: value
            }))
        }
    }

    const addItem = (field) => {
        console.log(field)
    }

    //date picker event
    const handleDateChange = (date, field) => {
        setState(prevState => ({
            ...prevState, [field]: date
        }))
    };


    // const handleLocationChange = ({ position, address, places }) => {

    //     // Set new location
    //     console.log("Address ====> ", address)
    //     setLocation({
    //         address: address
    //     });
    // }

    const onSaveandNew = () => {
        if (state.entity_name == null || state.entity_name == "") {
            notify("Please enter company entity name.")
            return
        } else if (state.owner_name == null || state.owner_name == "") {
            notify("Please enter company owner name.")
            return
        } else if (state.phone_number.length == 0 || state.phone_number.length < 7) {
            notify('Please enter valid phone number')
            return
        } else if (state.address == null || state.address == "") {
            notify("Please enter company address.")
            return
        } else if (state.min_schedule_time < 0) {
            notify("Please enter valid minimum schedule time.")
            return
        } else if (state.max_schedule_time < 0) {
            notify("Please enter valid maximum schedule time.")
            return
        } else if (state.min_schedule_time > state.max_schedule_time) {
            notify("Minimum schedule time can't bigger than Maximum schedule time.")
            return
        } else if (state.time_limit_per_schedule < 0) {
            notify("Please enter valid time limit.")
            return
        } else if (state.late_policy < 0) {
            notify("Please enter valid late policy.")
            return
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company_entity_name: state.entity_name,
                    company_owner_name: state.owner_name,
                    address: state.address,
                    phone_number: state.phone_number,
                    notes: state.notes,
                    upload: state.upload,
                    time_limit_per_schedule: state.time_limit_per_schedule,
                    late_policy: state.late_policy,
                    min_schedule_time: state.min_schedule_time,
                    max_schedule_time: state.max_schedule_time,
                    company_info: state.company_info.join(', ')
                })
            };
            fetch(`${SERVER_URL}addCompany`, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log("Response Data=============>", data)
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    } else if (data.company_id != null) {
                        notify("This company is already exist.")
                        return
                    } else if (data.id != 0) {
                        handleNotificationCall("shipped");
                        setState({
                            id: '',
                            entity_name: '',
                            owner_name: '',
                            address: '',
                            phone_number: "",
                            time_limit_per_schedule: 30,
                            late_policy: 60,
                            min_schedule_time: 60,
                            max_schedule_time: 360,
                            notes: 1,
                            upload: 0,
                            company_info: []
                        })
                        window.location.reload()
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
            notify("Please enter company entity name.")
            return
        } else if (state.owner_name == null || state.owner_name == "") {
            notify("Please enter company owner name.")
            return
        } else if (state.phone_number.length == 0 || state.phone_number.length < 7) {
            notify('Please enter valid phone number')
            return
        } else if (state.address == null || state.address == "") {
            notify("Please enter company address.")
            return
        } else if (state.min_schedule_time < 0) {
            notify("Please enter valid minimum schedule time.")
            return
        } else if (state.max_schedule_time < 0) {
            notify("Please enter valid maximum schedule time.")
            return
        } else if (state.min_schedule_time > state.max_schedule_time) {
            notify("Minimum schedule time can't bigger than Maximum schedule time.")
            return
        } else if (state.time_limit_per_schedule < 0) {
            notify("Please enter valid time limit.")
            return
        } else if (state.late_policy < 0) {
            notify("Please enter valid late policy.")
            return
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company_entity_name: state.entity_name,
                    company_owner_name: state.owner_name,
                    address: state.address,
                    phone_number: state.phone_number,
                    notes: state.notes,
                    upload: state.upload,
                    time_limit_per_schedule: state.time_limit_per_schedule,
                    late_policy: state.late_policy,
                    min_schedule_time: state.min_schedule_time,
                    max_schedule_time: state.max_schedule_time,
                    company_info: state.company_info.join(', ')
                })
            };
            fetch(`${SERVER_URL}addCompany`, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log("Response Data=============>", data)
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    } else if (data.company_id != null) {
                        notify("This company is already exist.")
                        return
                    } else if (data.id != 0) {
                        handleNotificationCall("shipped");
                        setState({
                            id: '',
                            entity_name: '',
                            owner_name: '',
                            address: '',
                            phone_number: "",
                            time_limit_per_schedule: 30,
                            late_policy: 60,
                            min_schedule_time: 60,
                            max_schedule_time: 360,
                            notes: 1,
                            upload: 0,
                            company_info: []
                        })
                        history.push("/app/company");
                    }

                })
                .catch(error => {
                    notify('Something went wrong!\n' + error)
                    console.error('There was an error!', error);
                });

        }
    }

    const onCancel = () => {
        history.push("/app/company");
    }

    return (
        <>
            <PageTitle title="New Company" /* button={["Add New", "Import", "Export"]}  data={data}*/ />
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
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Owner Name" value={state.owner_name} handleChange={(e) => handleChange(e, 'owner_name')} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>

                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Phone Number" value={state.phone_number} handleChange={(e) => handleChange(e, 'phone_number')} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Address" value={state.address} handleChange={(e) => handleChange(e, 'address')} />
                            </Grid>

                        </Grid>
                        <Grid container spacing={1}>

                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Min Time" value={state.min_schedule_time} handleChange={(e) => handleChange(e, 'min_schedule_time')} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Max Time" value={state.max_schedule_time} handleChange={(e) => handleChange(e, 'max_schedule_time')} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Time Limit" value={state.time_limit_per_schedule} handleChange={(e) => handleChange(e, 'time_limit_per_schedule')} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Late Policy" value={state.late_policy} handleChange={(e) => handleChange(e, 'late_policy')} />
                            </Grid>
                        </Grid>

                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <Grid item>
                                    <Typography variant={'subtitle1'}>Notes</Typography>
                                </Grid>
                                <FormControlLabel
                                    control={<Switch checked={state.notes} onChange={handleChange} name="notes" />}
                                    label="Notes"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <Grid item>
                                    <Typography variant={'subtitle1'}>Upload</Typography>
                                </Grid>
                                <FormControlLabel
                                    control={<Switch checked={state.upload} onChange={handleChange} name="upload" />}
                                    label="Upload"
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={1}>

                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <Grid item>
                                    <Typography variant={'subtitle1'}>Company Information</Typography>
                                </Grid>
                                <UploadFiles setFileList={(fileNameList) => {
                                    setState((state) => ({
                                        ...state,
                                        company_info: fileNameList
                                    }))

                                }} />
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
