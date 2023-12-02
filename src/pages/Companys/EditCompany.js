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
import fetchCompany from "../../services/company/CompanyService";
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

function EditCompany(props) {
    var classes = useStyles();
    let history = useHistory();
    const [errorToastId, setErrorToastId] = useState(null);
    var [notificationsPosition, setNotificationPosition] = useState(2);
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowIndex, setSelectedRowIndex] = useState(0)
    const companyData = useSelector(state => state.company);

    //Show notification
    const notify = (message) => toast(message);

    // input form datas
    const [state, setState] = useState({
        id: '',
        entity_name: '',
        owner_name: '',
        address: "",
        phone_number: "",
        time_limit_per_schedule: 0,
        late_policy: 0,
        min_schedule_time: 0,
        max_schedule_time: 0,
        notes: 0,
        upload: 0,
        company_info: [],
        company_infoList: ''
    })
    const update_id = props.match.params.company
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
                    entity_name: data.company_entity_name,
                    owner_name: data.company_owner_name,
                    address: data.address,
                    phone_number: data.phone_number,
                    time_limit_per_schedule: data.time_limit_per_schedule,
                    late_policy: data.late_policy,
                    min_schedule_time: data.min_schedule_time,
                    max_schedule_time: data.max_schedule_time,
                    notes: data.notes,
                    upload: data.upload,
                    company_infoList: data.company_info
                }))
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }


    const updateCompanyInfo = (company_id) => {
        
        console.log("========",state.company_info )
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                company_id: company_id,
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
                company_info: state.company_info.length == 0 ? state.company_infoList : state.company_info.join(', ') 
            })
        };
        fetch(`${SERVER_URL}updateCompany`, requestOptions)
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
            updateCompanyInfo(update_id)
        }
    }

    const onCancel = () => {
        history.push("/app/company");
    }

    return (
        <>
            <PageTitle title="Edit Company" /* button={["Add New", "Import", "Export"]}  data={data}*/ />
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
                                <CustomInput req={true} title="Entity Name" value={state.entity_name}
                                    handleChange={(e) => handleChange(e, 'entity_name')} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Owner Name" value={state.owner_name} handleChange={(e) => handleChange(e, 'owner_name')} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Address" value={state.address} handleChange={(e) => handleChange(e, 'address')} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Phone Number" value={state.phone_number} handleChange={(e) => handleChange(e, 'phone_number')} />
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
                                <CustomInput title="Min Time" value={state.min_schedule_time} handleChange={(e) => handleChange(e, 'min_schedule_time')} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Max Time" value={state.max_schedule_time} handleChange={(e) => handleChange(e, 'max_schedule_time')} />
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
                                    <Typography variant={'subtitle1'}>Company Information ( If you want to change, please upload PDFs and save. )</Typography>
                                </Grid>
                                <UploadFiles setFileList={(fileNameList) => {
                                    console.log("edit===> ", fileNameList)
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
    company: state.company
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchCompany: fetchCompany
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditCompany);