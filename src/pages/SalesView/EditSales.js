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
import { useSelector, connect } from "react-redux";
import { bindActionCreators } from "redux";
import CustomDatePicker from "../../components/FormControls/CustomDatePicker";
import CustomInput from "../../components/FormControls/CustomInput";
import CustomCombobox from "../../components/FormControls/CustomCombobox";
import * as Icons from "@material-ui/icons";
import { toast, ToastContainer } from "react-toastify";
import Notification from "../../components/Notification/Notification";
import fetchClientView from "../../services/clientview/ClientViewService";
import fetchUserView from "../../services/users/UserViewService";
import { SERVER_URL } from '../../common/config';

const positions = [
    toast.POSITION.TOP_LEFT,
    toast.POSITION.TOP_CENTER,
    toast.POSITION.TOP_RIGHT,
    toast.POSITION.BOTTOM_LEFT,
    toast.POSITION.BOTTOM_CENTER,
    toast.POSITION.BOTTOM_RIGHT,
];

function EditSales(props) {
    var classes = useStyles();
    let history = useHistory();
    const [errorToastId, setErrorToastId] = useState(null);
    var [notificationsPosition, setNotificationPosition] = useState(2);
    const userData = useSelector(state => state.userview);
    const clientData = useSelector(state => state.clientview);

    //Show notification
    const notify = (message) => toast(message);

    // input form datas
    const update_id = props.match.params.salesview
    const [state, setState] = useState({
        sales_client_id: '',
        client_name: '',
        user_name: '',
        client_id: '',
        user_id: ''
    })

    useEffect(() => {
        props.fetchClientView()
        props.fetchUserView();
        getSalesClientInfo(update_id)
    }, [])

    const getSalesClientInfo = (sales_client_id) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sales_client_id: sales_client_id
            })
        };
        fetch(`${SERVER_URL}getSalesClientById`, requestOptions)
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
                    client_name: data.client_entity_name,
                    user_name: data.full_name,
                    client_id: data.client_id.toString(),
                    user_id: data.user_id.toString()
                }))
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const getClientNameList = (original) => {
        console.log('originall ====> ', original, clientData.clientview)
        let tmp = [];
        if (Boolean(original)) {
            if (original.length) {
                original.map(item => {
                    let optionData = {
                        key: item?.client_id,
                        value: item?.client_entity_name
                    }
                    tmp.push(optionData);
                })
                return tmp;
            }
            return [];
        } else {
            return []
        }
    }

    const clients = getClientNameList(clientData.clientview)

    console.log("Client Data =====> ", clients.map(item => {
        return item?.value
    }))

    const getUserNameList = (original) => {
        console.log('originall ====> ', original, userData.userview)
        let tmp = [];
        if (Boolean(original)) {
            if (original.length) {
                original.map(item => {
                    let optionData = {
                        key: item?.user_id,
                        value: item?.full_name
                    }
                    tmp.push(optionData);
                })
                return tmp;
            }
            return [];
        } else {
            return []
        }
    }

    const users = getUserNameList(userData.userview)

    //input fields event
    const handleUserChange = (e, field) => {

        if (field == "user_name") {
            if (users.filter(item => item.value == e)[0] != null) {
                setState({
                    ...state,
                    user_name: e,
                    user_id: users.filter(item => item.value == e)[0].key
                })
            }

        }
    }

    const handleClientChange = (e, field) => {

        if (field == "client_name") {
            if (clients.filter(item => item.value == e)[0] != null) {
                setState({
                    ...state,
                    client_name: e,
                    client_id: clients.filter(item => item.value == e)[0].key
                })
            }

        }
    }


    const onSave = () => {
        if (state.user_name == null || state.user_name == "") {
            notify("Please enter company user name.")
            return
        } else if (state.client_name == null || state.client_name == "") {
            notify("Please enter client name.")
            return
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sales_client_id: update_id,
                    client_id: state.client_id,
                    user_id: state.user_id,
                })
            };
            console.log("===============> ", requestOptions.body)
            fetch(`${SERVER_URL}updateSalesClient`, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log("Response Data=============>", data)
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    } else if (data.sales_client_id != null) {
                        notify("This client is already exist.")
                        return
                    } else if (data.id != 0) {

                        handleNotificationCall("shipped");
                    }

                })
                .catch(error => {
                    notify('Something went wrong!\n' + error)
                    console.error('There was an error!', error);
                });
        }
    }

    const onCancel = () => {
        history.push("/app/salesview");
    }


    const userList = users.map(item => {
        return item?.value
    })

    const clientList = clients.map(item => {
        return item?.value
    })

    return (
        <>
            <div className={classes.singlePage}>
                <PageTitle title="Edit Employee-Client Relationship" />
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
                                    <CustomCombobox req={true} name="Employee Name" items={userList} value={state.user_name}
                                        handleChange={(e) => handleUserChange(e, 'user_name')} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                    <CustomCombobox req={true} name="Client Name" items={clientList} value={state.client_name}
                                        handleChange={(e) => handleClientChange(e, 'client_name')} />
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
    userview: state.userview,
    clientview: state.clientview
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchUserView: fetchUserView,
    fetchClientView: fetchClientView
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditSales);