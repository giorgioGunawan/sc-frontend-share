import React, { useState, useEffect } from "react";
import { Grid, Divider, Button } from "@material-ui/core";

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
import { SERVER_URL } from '../../../common/config';
import CustomInput from "../../../components/FormControls/CustomInput";
import CustomDatePicker from "../../../components/FormControls/CustomDatePicker";
import moment from 'moment'

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

function EditCouponPage(props) {
    var classes = useStyles();
    let history = useHistory();
    const [errorToastId, setErrorToastId] = useState(null);
    var [notificationsPosition, setNotificationPosition] = useState(2);
    const [dataSource, setDataSource] = useState([]);

    // input form datas
    const update_id = props.match.params.coupon
    const [state, setState] = useState({
        coupon_id: update_id,
        code: '',
        typeList: ['PERCENT', 'FLOAT', 'UNIT'],
        type: 'PERCENT',
        amount: '',
        start_date: '',
        end_date: ''
    })
    useEffect(() => {
        getCoupon(update_id)
    }, [])

    const getCoupon = (update_id) => {
        let body = {
            coupon_id: update_id
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        fetch(`${SERVER_URL}getCouponsbyId`, requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                console.log("_____________________", data)
                setState({
                    ...state,
                    code: data.code,
                    type: data.type,
                    amount: data.amount,
                    start_date: data.start_date,
                    end_date: data.end_date
                })
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
    //Show notification
    const notify = (message) => toast(message);

    //input fields event
    const handleChange = (e, field) => {
        if (state.type == "PERCENT") {
            if (Number(e.target.value) > 100) {
                notify("This field should smaller than 100.")
            } else {
                setState({
                    ...state,
                    [field]: e.target.value,
                })
            }
        } else {
            setState({
                ...state,
                [field]: e.target.value,
            })
        }

    }

    const handleTypeChange = (e, field) => {

        if (field == "type") {
            setState({
                ...state,
                type: e
            })
        }
    }

    const handleDateChange = (date, field) => {
        setState(prevState => ({
            ...prevState, [field]: moment(date).startOf('day').format("YYYY-MM-DD HH:mm:ss")
        }))
    };

    const onSave = () => {
        if (state.code == null || state.code == '') {
            notify("Please enter code.")
            return
        } else if (state.amount == null || state.amount == '') {
            notify("Please enter amount.")
            return
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    coupon_id: state.coupon_id,
                    code: state.code,
                    type: state.type,
                    amount: state.amount,
                    start_date: state.start_date,
                    end_date: state.end_date
                })
            };
            fetch(`${SERVER_URL}updateCoupon`, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log("Response Data=============>", data)
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    } else if (data.coupon_id == 0) {
                        notify("This promotion code is already exist.")
                        return
                    } else if (data.coupon_id != 0) {

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
        history.push("/app/salesorder/promotion");
    }

    return (
        <>
            <PageTitle title="Edit Coupon" />
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

                            <Grid item xs={12} sm={4} md={4} lg={4} className={classes.formContainer}>
                                <CustomInput req={true} title="Code" value={state.code}
                                    handleChange={(e) => handleChange(e, 'code')} />
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} lg={4} className={classes.formContainer}>
                                <CustomCombobox req={true} name="Type" items={state.typeList} value={state.type}
                                    handleChange={(e) => handleTypeChange(e, 'type')} />
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} lg={4} className={classes.formContainer}>
                                <CustomInput req={true} title={state.type == 'FLAT' ? 'Amount(price)' : (state.type == 'PERCENT' ? 'Amount(%)' : 'Amount(price)')} value={state.amount}
                                    handleChange={(e) => handleChange(e, 'amount')} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomDatePicker title="Start Date" selectedDate={state.start_date} handleChange={(e) => handleDateChange(e, 'start_date')} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomDatePicker title="Expiration Date" selectedDate={state.end_date} handleChange={(e) => handleDateChange(e, 'end_date')} />
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
                                            onClick={() => onSave()}
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
})

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditCouponPage);