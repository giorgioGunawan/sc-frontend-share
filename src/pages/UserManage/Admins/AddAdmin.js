import React, { useState, useEffect } from "react";
import { Grid, Input, FormControlLabel, Switch, Divider, Button } from "@material-ui/core";

// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./styles";

// components
import Widget from "../../../components/Widget/Widget";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import { bindActionCreators } from "redux";
import CustomInput from "../../../components/FormControls/CustomInput";
import CustomCombobox from "../../../components/FormControls/CustomCombobox";
import { Typography } from "../../../components/Wrappers/Wrappers";
import * as Icons from "@material-ui/icons";
import Notification from "../../../components/Notification/Notification";
import fetchCompany from "../../../services/company/CompanyService";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../../common/config';
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

function AddAdmin(props) {
    var classes = useStyles();
    let history = useHistory();
    const [errorToastId, setErrorToastId] = useState(null);
    const [dataSource, setDataSource] = useState([]);
    var [notificationsPosition, setNotificationPosition] = useState(2);
    const companyData = useSelector(state => state.company);

    //Show notification
    const notify = (message) => toast(message);

    //Email Validation
    const validateEmail = (email) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) === false) {
            return false;
        } else {
            return true
        }
    }

    useEffect(() => {
        props.fetchCompany();
        console.log(companyData)
        setDataSource(companyData.data);
    }, [])

    console.log("Add Admin get companys ====> ", companyData.company)

    const objArray2Array = (original) => {
        console.log('originall ====> ', original, companyData.data)
        let tmp = [];
        if (Boolean(original)) {
            if (original.length) {
                original.map(item => {
                    tmp.push(item?.company_entity_name);
                })
                return tmp;
            }
            return [];
        } else {
            return []
        }
    }

    const companies = objArray2Array(companyData.company)

    // input form datas
    const [state, setState] = useState({
        full_name: '',
        password: "",
        email: "",
        phone_number: '',
        companyIDList: [],
        company_entity_name: "",
        sales_target: 0,
        allow_so: 0
    })
    const [companyList, setCompanyList] = React.useState([]);

    const handleCompanyChange = (event) => {

        setCompanyList(event.target.value);
        const options = event.target.value;
        const value = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
            value.push(setCompanyIdfromCompanyName(options[i]))
        }
        console.log('handleCompanyChange==>', value)
        setState(prevState => ({
            ...prevState,
            companyIDList: value
        }))
    };

    const setCompanyIdfromCompanyName = (company_entity_name) => {
        let object = companyData.company.filter(item => item.company_entity_name == company_entity_name)
        if (object[0] != null) {
            return object[0].company_id.toString()
        }

    }
    //input fields event
    const handleChange = (e, field) => {
        if (e.target.name == 'allow_so') {
            setState({ ...state, [e.target.name]: e.target.checked });
        } else {
            const { name, value } = e.target;
            setState(prevState => ({
                ...prevState, [field]: value
            }))
        }
    }

    const onSaveandBack = () => {
        if (state.full_name == null || state.full_name == "") {
            notify("Please enter name.")
            return
        } else if (state.email.length < 3 || validateEmail(state.email) == false) {
            notify("Please enter valid email.");
            return
        } else if (state.phone_number.length == 0 || state.phone_number.length < 7) {
            notify('Please enter valid phone number')
            return
        } else if (state.companyIDList == []) {
            notify("Please enter company name.")
            return
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: state.full_name,
                    password: state.password,
                    email: state.email,
                    phone_number: state.phone_number,
                    company_id: state.companyIDList.join(', '),
                    isAdmin: true,
                    isActive: true,
                    sales_target: state.sales_target,
                    allow_so: state.allow_so
                })
            };
            fetch(`${SERVER_URL}addUser`, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log("Response Data=============>", data)
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    } else if (data.user_id != null) {
                        notify("This user is already exist.\n Please use another email.")
                        return
                    } else if (data.id != 0) {

                        handleNotificationCall("shipped");
                    }

                })
                .catch(error => {
                    notify('Something went wrong!\n' + error)
                    console.error('There was an error!', error);
                });
            history.push("/app/usermanage/admin");
        }

    }

    const onSaveandNew = () => {
        if (state.full_name == null || state.full_name == "") {
            notify("Please enter name.")
            return
        } else if (state.email.length < 3 || validateEmail(state.email) == false) {
            notify("Please enter valid email.");
            return
        } else if (state.phone_number.length == 0 || state.phone_number.length < 7) {
            notify('Please enter valid phone number')
            return
        } else if (state.companyIDList == []) {
            notify("Please enter company name.")
            return
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: state.full_name,
                    password: state.password,
                    email: state.email,
                    phone_number: state.phone_number,
                    company_id: state.companyIDList.join(', '),
                    isAdmin: true,
                    isActive: true,
                    sales_target: state.sales_target,
                    allow_so: state.allow_so
                })
            };
            fetch(`${SERVER_URL}addUser`, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log("Response Data=============>", data)
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    } else if (data.user_id != null) {
                        notify("This user is already exist.\n Please use another email.")
                        return
                    } else if (data.id != 0) {

                        handleNotificationCall("shipped");
                    }

                })
                .catch(error => {
                    notify('Something went wrong!\n' + error)
                    console.error('There was an error!', error);
                });
            setState(state => ({
                ...state,
                full_name: '',
                password: "",
                email: "",
                phone_number: '',
                companyIDList: [],
                allow_so: 0,
                sales_target: 0
            }))
        }

    }

    const onCancel = () => {
        history.push("/app/usermanage/admin");
    }

    return (
        <>
            <PageTitle title="New Admin" />
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
                                <CustomInput req={true} title="Full Name" value={state.full_name}
                                    handleChange={(e) => handleChange(e, 'full_name')} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Email" value={state.email}
                                    handleChange={(e) => handleChange(e, 'email')} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Password" value={state.password}
                                    handleChange={(e) => handleChange(e, 'password')} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Phone Number" value={state.phone_number} type="number" maxLength={10}
                                    handleChange={(e) => handleChange(e, 'phone_number')} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>

                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                {/* <CustomCombobox req={true} addbtn={false} name="Company Name" items={companies} value={state.company_entity_name}
                                    handleChange={(e) => handleChange(e, 'company_entity_name')} /> */}
                                {/* <CustomInput title="Company ID" value={state.company_id} handleChange={(e) => handleChange(e, 'company_id')} /> */}
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-mutiple-checkbox-label">Companies</InputLabel>
                                    <Select
                                        labelId="demo-mutiple-checkbox-label"
                                        id="demo-mutiple-checkbox"
                                        multiple
                                        value={companyList}
                                        onChange={handleCompanyChange}
                                        input={<Input />}
                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                    >
                                        {companies.map((name) => (
                                            <MenuItem key={name} value={name}>
                                                <Checkbox checked={companyList.indexOf(name) > -1} />
                                                <ListItemText primary={name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <CustomInput title="Sales Target" value={state.sales_target}
                                    handleChange={(e) => handleChange(e, 'sales_target')} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                <Typography>Allow Sales Order</Typography>
                                <Grid component="label" container alignItems="center" spacing={0}>
                                    <FormControlLabel
                                        control={<Switch checked={state.allow_so} onChange={handleChange} name="allow_so" />}
                                        label="Allow"
                                    />
                                </Grid>
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

const mapStateToProps = state => ({
    company: state.company
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchCompany: fetchCompany
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddAdmin);
