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
import fetchBranch from "../../services/branch/BranchServices";
import { SERVER_URL } from '../../common/config';
import UploadFiles from "../../components/Upload/upload-files.component";

const positions = [
    toast.POSITION.TOP_LEFT,
    toast.POSITION.TOP_CENTER,
    toast.POSITION.TOP_RIGHT,
    toast.POSITION.BOTTOM_LEFT,
    toast.POSITION.BOTTOM_CENTER,
    toast.POSITION.BOTTOM_RIGHT,
];

function EditBranch(props) {
    var classes = useStyles();
    let history = useHistory();
    const [errorToastId, setErrorToastId] = useState(null);
    var [notificationsPosition, setNotificationPosition] = useState(2);
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowIndex, setSelectedRowIndex] = useState(0)
    const branchData = useSelector(state => state.branch);

    //Show notification
    const notify = (message) => toast(message);

    // input form datas
    const [state, setState] = useState({
        id: '',
        branch_name: '',
        company_id: '',
    })

    const update_id = props.match.params.branch
    useEffect(() => {
        getBranchInfo(update_id)
    }, [])


    const getBranchInfo = (branch_id) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                branch_id: branch_id
            })
        };
        fetch(`${SERVER_URL}getBranchById`, requestOptions)
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
                    branch_name: data.branch_name,
                    company_id: data.company_id,
                }))
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const updateBranchInfo = (branch_id) => {
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                branch_id : branch_id,
                branch_name: state.branch_name,
                company_id: state.company_id,
            })
        };
        fetch(`${SERVER_URL}updateBranch`, requestOptions)
            .then(async response => {
                const data = await response.json();
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

    //file picker event
    const handleCapture = ({ target }) => {
        const fileReader = new FileReader();
        // const name = target.accept.includes('image') ? 'images' : 'videos';
        setState((prevState) => ({
            ...prevState, file: target.files[0]
        }));

        /* fileReader.readAsDataURL(target.files[0]);
        fileReader.onload = (e) => {
          setState((prevState) => ({
            ...prevState, file: e.target.result
          }));
        }; */
    };

    const onSave = () => {
        if (state.branch_name == null || state.branch_name == "") {
            notify("Please enter branch name.")
            return
        } else {
            updateBranchInfo(update_id)
        }
    }

    const onCancel = () => {
        history.push("/app/branch");
    }

    return (
        <>
            <PageTitle title="Edit Branch" /* button={["Add New", "Import", "Export"]}  data={data}*/ />
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
                                <CustomInput req={true} title="Branch Name" value={state.branch_name}
                                    handleChange={(e) => handleChange(e, 'branch_name')} />
                            </Grid>
                            {/* we dont allow editing of company id!
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Company ID" value={state.company_id} handleChange={(e) => handleChange(e, 'company_id')} />
                            </Grid>*/}
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
                                            startIcon={<Icons.Cancel />}
                                            onClick={() => onCancel()}
                                        >
                                            Cancel
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
    branch: state.branch
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchBranch: fetchBranch
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditBranch);