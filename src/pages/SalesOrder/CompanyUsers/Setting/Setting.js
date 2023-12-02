import React, { useState, useEffect } from "react";
import { Grid, Input, IconButton, FormControlLabel, Switch, Divider, Button } from "@material-ui/core";

// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./styles";

// components
import Widget from "../../../../components/Widget/Widget";
import PageTitle from "../../../../components/PageTitle/PageTitle";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import { bindActionCreators } from "redux";
import CustomInput from "../../../../components/FormControls/CustomInput";
import CustomCombobox from "../../../../components/FormControls/CustomCombobox";
import * as Icons from "@material-ui/icons";
import { toast, ToastContainer } from "react-toastify";
import Notification from "../../../../components/Notification/Notification";
import fetchCompany from "../../../../services/company/CompanyService";
import { SERVER_URL } from '../../../../common/config';

const positions = [
    toast.POSITION.TOP_LEFT,
    toast.POSITION.TOP_CENTER,
    toast.POSITION.TOP_RIGHT,
    toast.POSITION.BOTTOM_LEFT,
    toast.POSITION.BOTTOM_CENTER,
    toast.POSITION.BOTTOM_RIGHT,
];

function SettingPage(props) {
    var classes = useStyles();
    let history = useHistory();
    const [errorToastId, setErrorToastId] = useState(null);
    var [notificationsPosition, setNotificationPosition] = useState(2);
    const companyData = useSelector(state => state.company);

    //Show notification
    const notify = (message) => toast(message);

    // input form datas
    const update_id = props.match.params.company_id
    const company_entity_name = props.match.params.company_entity_name
    const [state, setState] = useState({
        company_id: update_id,
        company_entity_name: company_entity_name,
        sales_target: 0
    })

    useEffect(() => {
        getCompanyInfo(update_id)
    }, [])

    const getCompanyInfo = (company_id) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                company_id: company_id
            })
        };
        fetch(`${SERVER_URL}getCompanyById`, requestOptions)
            .then(async response => {
                const data = await response.json();
                console.log("Response Data=============>", data)
                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                setState(() => ({
                    ...state,
                    sales_target: data.sales_target
                }))
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }


    const handleChange = (e, field) => {

        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState, [field]: value
        }))
    }

    const onSave = () => {
        if (state.sales_target == null || state.sales_target == "") {
            notify("Please enter sales target.")
            return
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company_id: state.company_id,
                    sales_target: state.sales_target
                })
            };
            fetch(`${SERVER_URL}settingSalesTarget`, requestOptions)
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
                    notify('Something went wrong!\n' + error)
                    console.error('There was an error!', error);
                });
        }
    }

    const onCancel = () => {
        history.push("/app/salesorder/companyusers");
    }

    return (
        <>
            <PageTitle title="Set Company Sales Target" />
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
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={6} lg={3} className={classes.formContainer}>
                                <CustomInput req={true} disabled={true} title="Company" value={state.company_entity_name}
                                    handleChange={(e) => handleChange(e, 'company_entity_name')} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={3} className={classes.formContainer}>
                                <CustomInput title="Sales Target" value={state.sales_target} handleChange={(e) => handleChange(e, 'sales_target')} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                                <Grid container spacing={2} className={classes.buttonContainer}>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            startIcon={<Icons.Save />}
                                            onClick={() => onSave()}
                                        >
                                            Apply for all users
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
)(SettingPage);