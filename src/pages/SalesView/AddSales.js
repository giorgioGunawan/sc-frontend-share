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
import CustomCombobox from "../../components/FormControls/CustomCombobox";
import * as Icons from "@material-ui/icons";
import { toast, ToastContainer } from "react-toastify";
import Notification from "../../components/Notification/Notification";
import fetchClientView from "../../services/clientview/ClientViewService";
import fetchUserView from "../../services/users/UserViewService";
import { SERVER_URL } from '../../common/config';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';

const positions = [
    toast.POSITION.TOP_LEFT,
    toast.POSITION.TOP_CENTER,
    toast.POSITION.TOP_RIGHT,
    toast.POSITION.BOTTOM_LEFT,
    toast.POSITION.BOTTOM_CENTER,
    toast.POSITION.BOTTOM_RIGHT,
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function AddSales(props) {
    var classes = useStyles();
    let history = useHistory();
    const [errorToastId, setErrorToastId] = useState(null);
    var [notificationsPosition, setNotificationPosition] = useState(2);
    const [dataSource, setDataSource] = useState([]);
    const userData = useSelector(state => state.userview);
    const clientData = useSelector(state => state.clientview);

    // input form datas
    const [state, setState] = useState({
        client_name: '',
        user_name: "",
        client_id: '',
        user_id: '',
        userIDList: []
    })

    useEffect(() => {
        props.fetchClientView()
        props.fetchUserView();
    }, [])

    const [userList, setUserList] = React.useState([]);

    //Show notification
    const notify = (message) => toast(message);
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
    const handleChange = (e, field) => {

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

    const handleNameChange = (event) => {

        setUserList(event.target.value)
        const options = event.target.value;
        const value = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
            value.push(getUserIDbyUserName(options[i]))
        }
        setState(prevState => ({
            ...prevState,
            userIDList: value
        }))
    };

    const getUserIDbyUserName = (user_name) => {
        console.log("state.user===>", users)
        let object = userData.userview.filter(item => item.full_name == user_name)
        if (object[0] != null) {
            return object[0].user_id
        }

    }

    const onSaveandNew = () => {
        if (state.client_name == null || state.client_name == "") {
            notify("Please enter client name.")
            return
        } else {
            console.log('request option', state.client_id, ',' ,state.userIDList)
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_id: state.client_id,
                    user_id: state.userIDList,
                })
            };
            fetch(`${SERVER_URL}addSalesClient`, requestOptions)
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
                        setState(()=>({
                            client_name: '',
                            user_name: "",
                            client_id: '',
                            user_id: '',
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
        if (state.client_name == null || state.client_name == "") {
            notify("Please enter client name.")
            return
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_id: state.client_id,
                    user_id: state.userIDList,
                })
            };
            fetch(`${SERVER_URL}addSalesClient`, requestOptions)
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
                        setState(()=>({
                            client_name: '',
                            user_name: "",
                            client_id: '',
                            user_id: '',
                        }))
                        history.push("/app/salesview");
                        
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

    const clientList = clients.map(item => {
        return item?.value
    })

    return (
        <>
            <div className={classes.singlePage}>
                <PageTitle title="New Sales Client" />
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
                                    
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                    <CustomCombobox req={true} name="Client Name" items={clientList} value={state.client_name}
                                        handleChange={(e) => handleChange(e, 'client_name')} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="demo-mutiple-checkbox-label">Users</InputLabel>
                                        <Select
                                            labelId="demo-mutiple-checkbox-label"
                                            id="demo-mutiple-checkbox"
                                            multiple
                                            value={userList}
                                            onChange={handleNameChange}
                                            input={<Input />}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                        >
                                            {users.map((name) => (
                                                <MenuItem key={name.value} value={name.value}>
                                                    <Checkbox checked={userList.indexOf(name.value) > -1} />
                                                    <ListItemText primary={name.value} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                            </Grid>
                            <Divider />
                            <Grid container spacing={1}>
                                <Grid item xs={4} md={4} lg={4}></Grid>
                                <Grid item xs={6} md={6} lg={8}>
                                    <Grid container spacing={4} className={classes.buttonContainer} justify="space-between">
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
)(AddSales);