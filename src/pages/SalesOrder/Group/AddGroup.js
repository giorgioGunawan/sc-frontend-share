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
import fetchCompany from "../../../services/company/CompanyService";
import * as Icons from "@material-ui/icons";
import { toast, ToastContainer } from "react-toastify";
import Notification from "../../../components/Notification/Notification";
import { SERVER_URL } from '../../../common/config';
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

function AddGroupPage(props) {
    var classes = useStyles();
    let history = useHistory();
    const [errorToastId, setErrorToastId] = useState(null);
    var [notificationsPosition, setNotificationPosition] = useState(2);
    const [dataSource, setDataSource] = useState([]);
    const companyData = useSelector(state => state.company);
    // input form datas
    const [state, setState] = useState({
        category_name: '',
    })

    useEffect(() => {
        props.fetchCompany();
        console.log(companyData)
        setDataSource(companyData.data);
    }, [])

    //Show notification
    const notify = (message) => toast(message);

    const handleChange = (e, field) => {

        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState, [field]: value
        }))
    }


    const onSaveandNew = () => {
        if (state.category_name == null || state.category_name == "") {
            notify("Please enter category name.")
            return
        } if (state.company_id == null || state.company_id == "") {
            notify("Please select company.")
            return
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category_name: state.category_name,
                    // sales_target: state.sales_target,
                    // company_id: state.company_id
                })
            };
            fetch(`${SERVER_URL}createCategory`, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log("Response Data=============>", data)
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    } else if (data.group_id == 0) {
                        notify("This category is already exist.")
                        return
                    } else if (data.group_id != 0) {
                        handleNotificationCall("shipped");
                        setState(() => ({
                            category_name: '',
                            // sales_target: 0,
                            // company_id: ''
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
        if (state.category_name == null || state.category_name == "") {
            notify("Please enter category name.")
            return
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category_name: state.category_name,
                    // sales_target: state.sales_target,
                    // company_id: state.company_id
                })
            };
            fetch(`${SERVER_URL}createCategory`, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log("Response Data=============>", data)
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    } else if (data.group_id == 0) {
                        notify("This category is already exist.")
                        return
                    } else if (data.group_id != 0) {
                        handleNotificationCall("shipped");
                        setState(() => ({
                            category_name: ''
                        }))
                        history.push("/app/salesorder/group");
                    }
                })
                .catch(error => {
                    notify('Something went wrong!\n' + error)
                    console.error('There was an error!', error);
                });
        }

    }

    const onCancel = () => {
        history.push("/app/salesorder/group");
    }

    return (
        <>
            <PageTitle title="New Category" />
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

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4} md={4} lg={4} className={classes.formContainer}>
                                <CustomInput req={true} title="Categroy Name" value={state.category_name}
                                    handleChange={(e) => handleChange(e, 'category_name')} />
                            </Grid>
                            <Grid item xs={12} sm={2} md={2} lg={2} className={classes.formContainer}>
                            </Grid>
                            <Grid item xs={12} sm={2} md={2} lg={2} className={classes.formContainer}>
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
                            </Grid>
                            <Grid item xs={12} sm={2} md={2} lg={2} className={classes.formContainer}>
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
                            <Grid item xs={12} sm={2} md={2} lg={2} className={classes.formContainer}>
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
)(AddGroupPage);