import React, { useState, useEffect } from "react";
import { Grid, Input, IconButton, FormControlLabel, Switch, Divider, Button } from "@material-ui/core";

// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./styles";

// components
import Widget from "../../../components/Widget/Widget";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import { bindActionCreators } from "redux";
import CustomCombobox from "../../../components/FormControls/CustomCombobox";
import * as Icons from "@material-ui/icons";
import { toast, ToastContainer } from "react-toastify";
import Notification from "../../../components/Notification/Notification";
import fetchClientView from "../../../services/clientview/ClientViewService";
// import fetchUserView from "../../../services/users/UserViewService";
import { SERVER_URL } from '../../../common/config';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import CustomInput from "../../../components/FormControls/CustomInput";

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

function EditDiscountPage(props) {
    var classes = useStyles();
    let history = useHistory();
    const [errorToastId, setErrorToastId] = useState(null);
    var [notificationsPosition, setNotificationPosition] = useState(2);
    const [dataSource, setDataSource] = useState([]);
    const update_id = props.match.params.discount
    const [state, setState] = useState({
        item_name: update_id,
        itemList: [],
        itemNameList: [],
        min_quantity: '',
        max_quantity: '',
        amount: ''
    })

    useEffect(() => {
        getItems()
        getDiscountbyId(update_id)
    }, [])

    const getItems = () => {
        let body = {
            company_id: localStorage.getItem('company_id')
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        fetch(`${SERVER_URL}getItemsbyCompanyId`, requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                console.log("groupdData--> ", data)
                let list = []
                data.map(item => {
                    list.push(item.item_name)
                })
                setState({
                    ...state,
                    itemList: data,
                    itemNameList: list,
                })
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const getDiscountbyId = (update_id) => {
        let body = {
            discount_id: update_id
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        fetch(`${SERVER_URL}getDiscountsbyId`, requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                console.log("get Data@--> ", data)
                setState({
                    ...state,
                    item_id: data.item_id,
                    item_name: data.item_name,
                    min_quantity: data.min_quantity,
                    max_quantity: data.max_quantity,
                    amount: data.amount
                })
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    //Show notification
    const notify = (message) => toast(message);

    const handleChange = (e, field) => {

        if (field == "item_name") {
            notify("You can't change the item name.")
        } else {
            const { name, value } = e.target;
            setState(prevState => ({
                ...prevState, [field]: value
            }))
        }

    }

    const onSaveandNew = () => {
        if (state.item_name == null || state.item_name == "") {
            notify("Please enter item name.")
            return
        } else if (state.amount == null || state.amount == "") {
            notify("Please enter amount.")
            return
        } else if (state.min_quantity == null || state.min_quantity == "") {
            notify("Please enter min quantity.")
            return
        } else if (state.max_quantity == null || state.max_quantity == "") {
            notify("Please enter max quantity.")
            return
        } else if (Number(state.min_quantity) > Number(state.max_quantity)) {
            notify("Please enter valid values.")
            return
        } else if (Number(state.min_quantity) < 0) {
            notify("Please enter valid min quality.")
            return
        } else if (Number(state.max_quantity) < 0) {
            notify("Please enter valid max quality.")
            return
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    discount_id: update_id,
                    item_id: state.item_id,
                    amount: state.amount,
                    min_quantity: state.min_quantity,
                    max_quantity: state.max_quantity
                })
            };
            fetch(`${SERVER_URL}updateDiscount`, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log("Response Data=============>", data)
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    } else if (data.discount_id == 0) {
                        notify("This discount is already exist.")
                        return
                    } else if (data.discount_id != 0) {

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
        history.push("/app/salesorder/discount");
    }

    return (
        <>
            <PageTitle title="Edit Item Discount" />
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
                                <CustomInput req={true} title="Item Name" value={state.item_name}
                                    handleChange={(e) => handleChange(e, 'item_name')} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput req={true} title="Amount" value={state.amount}
                                    handleChange={(e) => handleChange(e, 'amount')} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput req={true} title="Min Quantity" value={state.min_quantity}
                                    handleChange={(e) => handleChange(e, 'min_quantity')} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput req={true} title="Max Quantity" value={state.max_quantity}
                                    handleChange={(e) => handleChange(e, 'max_quantity')} />
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
                                            Save
                                        </Button>
                                    </Grid>
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
    // userview: state.userview,
    clientview: state.clientview
})

const mapDispatchToProps = dispatch => bindActionCreators({
    // fetchUserView: fetchUserView,
    fetchClientView: fetchClientView
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditDiscountPage);