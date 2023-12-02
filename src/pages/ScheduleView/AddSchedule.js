import React, { useState, useEffect } from "react";
import { Box, Grid, Input, IconButton, FormControlLabel, Switch, Divider, Button, List, ListItem, ListItemText } from "@material-ui/core";

// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./styles";
import { Input as AntdInput, Typography, Divider as AntdDivider, Text, Card} from "antd";

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
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { DatePicker, DateTimePicker } from '@material-ui/pickers';
import { names } from "tinycolor2";

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

function AddSchedule(props) {
    var classes = useStyles();
    let history = useHistory();
    const { Text, Link } = Typography;
    const { TextArea } = AntdInput;
    const [errorToastId, setErrorToastId] = useState(null);
    var [notificationsPosition, setNotificationPosition] = useState(2);
    const [dataSource, setDataSource] = useState([]);
    const userData = useSelector(state => state.userview);
    const clientData = useSelector(state => state.clientview);
    const company_id = localStorage.getItem('company_id');
    const [isLoading, setIsLoading] = useState(false)
    const [visitingReasonData, setVisitingReasonData ] = useState([]);
    const [products, setProducts] = useState([]);
    const userviewData = useSelector(state => state.userview.userview);
    const [isMultiple, setIsMultiple] = React.useState(false);

    // input form datas
    const [state, setState] = useState({
        client_name: '',
        user_name: "",
        client_id: '',
        user_id: '',
        date: Date.now(),
        userIDList: [],
        visiting_reason: 0,
        include_product: 0,
        product: [],
        notes: "",
    })

    const [form, setForm] = useState({
        user_id: [],
        start_date: null,
        end_date: null,
        tracking_type: null
    })

    useEffect(() => {
        props.fetchClientView()
        props.fetchUserView();
        getAllVisitingReason();
        getAllProduct();
        setDataSource(userviewData.data);
    }, [])

    const [userList, setUserList] = React.useState([]);

    //Show notification
    const notify = (message) => toast(message);
    const getClientNameList = (original) => {
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

    const getAllVisitingReason = () => {
        setIsLoading(true)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                company_id
            })
        }
        fetch(`${SERVER_URL}getAllVisitingReason`, requestOptions)
            .then(async response => {
                const res = await response.json();
                const names = res.data.map(item => {
                    return {
                        "name": item.name,
                        "include_product": item.include_product,
                        "id": item.id
                    }
                });
                setVisitingReasonData(names)
            }).finally(() => {
                setIsLoading(false)
            })
    }

    const getAllProduct = () => {
        let productBody = {
            company_id
        }
        fetch(`${SERVER_URL}getAllProduct`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productBody)
        })
            .then(res => {
                return res.json()
            })
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                const data = res.data?.filter(item => item.name).map(item => {
                    return {
                        value: item.name,
                        id: item.id
                    }
                });
                setProducts(data);
            })
            .catch(error => {
                return (error)
            })
    }

    const clients = getClientNameList(clientData.clientview)

    const getUserNameList = (original) => {
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

    function getProductsForVisitingReason(visiting_reason) {
            const visitReason = visitingReasonData.find(p => p.name === visiting_reason);
            if (!visitReason) return null;
            return visitReason.include_product;
    }

    //input fields event
    const handleChange = (e, field) => {

        if (field == "multiple_employee_names") {
            setForm({
                ...form,
                user_id: e.target.value,
            })
        }

        if (field == "notes") {
            setState({
                ...state,
                notes: e,
            })  
        }

        if (field == "client_name") {
            if (clients.filter(item => item.value == e)[0] != null) {
                setState({
                    ...state,
                    client_name: e,
                    client_id: clients.filter(item => item.value == e)[0].key
                })
            }

        }

        if (field === 'date') {
            setState({
                ...state,
                date: e,
            })
        }

        if (field === 'visiting_reason') {
            const include_product = getProductsForVisitingReason(e);

            setState({
                ...state,
                visiting_reason: e,
                include_product: include_product,
            })
        }

        

        if (field === 'products') {
            const options = e.target.value;
            const value = [];
            for (let i = 0, l = options.length; i < l; i += 1) {
                value.push(options[i])
            }
            setState(prevState => ({
                ...prevState,
                product: value
            }))
        }

        if (field === 'employee_name') {
            setState({
                ...state,
                user_name: e,
                user_id: users.filter(item => item.value == e)[0].key
            })
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
        let object = userData.userview.filter(item => item.full_name == user_name)
        if (object[0] != null) {
            return object[0].user_id
        }

    }

    const getUserNamebyUserId = (user_id) => {
        let object = userData.userview.filter(item => item.user_id == user_id)
        if (object[0] != null) {
            return object[0].full_name
        }

    }

    const getReasonIdFromReason = (reason) => {
        const visiting_reason = visitingReasonData.find(item => item.name === reason);
        const id = visiting_reason ? visiting_reason.id : null;
        return id;
    }

    const getProductIdFromProduct = (product_name) => {
        const product_with_name = products.find(item => item.value === product_name);
        const id = product_with_name ? product_with_name.id : null;
        return id;
    }

    const onSaveandNew = async () => {
        if (state.client_name == null || state.client_name == "") {
            notify("Please enter client name.")
            return
        } else {
            if (state.notes !== null || state.notes !== '') {
                const requestOptionsClientNotes = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        client_id: state.client_id,
                        custom_field: state.notes
                    })
                };

                await fetch(`${SERVER_URL}updateClientNotes`, requestOptionsClientNotes)
                .then(async response => {
                    if (!response.ok) {
                        console.log('fail update client notes g88');
                    }
                });
            }

            if(!isMultiple) {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        client_id: state.client_id,
                        user_id: [state.user_id],
                    })
                };
                var sales_client_id = 0;
                await fetch(`${SERVER_URL}addSalesClient`, requestOptions)
                    .then(async response => {
                        const data = await response.json();
                        // check for error response
                        if (!response.ok) {
                            // get error message from body or default to response status
                            const error = (data && data.message) || response.status;
                        } else if (data.sales_client_id != null) {
                            sales_client_id = data.sales_client_id;
                        } else if (data.id != 0) {
                            sales_client_id = data.sales_client_id;
                        }

                        var newDate = new Date(state.date);
                        const year = newDate.getFullYear();
                        const month = String(newDate.getMonth() + 1).padStart(2, "0");
                        const day = String(newDate.getDate()).padStart(2, "0");
                        const hours = String(newDate.getHours()).padStart(2, "0");
                        const minutes = String(newDate.getMinutes()).padStart(2, "0");
                        const seconds = String(newDate.getSeconds()).padStart(2, "0");
                        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                        let schedule_data = {
                            user_id: state.user_id,
                            client_id: state.client_id,
                            schedule_datetime: formattedDate,
                            predicted_time_spent: 1,
                            reason: getReasonIdFromReason(state.visiting_reason),
                            products: state.product.map(item => getProductIdFromProduct(item))
                        };

                        const reqOption = {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(schedule_data),
                            };
            
                        await fetch(`${SERVER_URL}createNewSchedule`, reqOption)
                                .then(async response => {
                                const data = await response.json();
                                // check for error response
                                if (!response.ok) {
                                    const error = (data && data.message) || response.status;
                                    return Promise.reject(error);
                                } else if (response.schedule_id == "0") {
                                    notify("This timeframe is already exist.");
                                    return;
                                } else {
                                    notify("Successfully appended");
                                }
                                })
                                .catch(error => {
                                notify("Something went wrong!\n" + error);
                                });

                    })
                    .catch(error => {
                        notify('Something went wrong!\n' + error)
                    });

                    setState(
                        {
                            client_name: '',
                            user_name: "",
                            client_id: '',
                            user_id: '',
                            date: Date.now(),
                            userIDList: [],
                            visiting_reason: 0,
                            include_product: 0,
                            product: [],
                        }
                    )
            } else {
                form.user_id.forEach(async (user_id) => {
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            client_id: state.client_id,
                            user_id: [user_id],
                        })
                    };
                    var sales_client_id = 0;

                    await fetch(`${SERVER_URL}addSalesClient`, requestOptions)
                    .then(async response => {
                        const data = await response.json();
                        // check for error response
                        if (!response.ok) {
                            // get error message from body or default to response status
                            const error = (data && data.message) || response.status;
                        } else if (data.sales_client_id != null) {
                            sales_client_id = data.sales_client_id;
                        } else if (data.id != 0) {
                            sales_client_id = data.sales_client_id;
                        }

                        var newDate = new Date(state.date);
                        const year = newDate.getFullYear();
                        const month = String(newDate.getMonth() + 1).padStart(2, "0");
                        const day = String(newDate.getDate()).padStart(2, "0");
                        const hours = String(newDate.getHours()).padStart(2, "0");
                        const minutes = String(newDate.getMinutes()).padStart(2, "0");
                        const seconds = String(newDate.getSeconds()).padStart(2, "0");
                        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                        let schedule_data = {
                            user_id: user_id,
                            client_id: state.client_id,
                            schedule_datetime: formattedDate,
                            predicted_time_spent: 1,
                            reason: getReasonIdFromReason(state.visiting_reason),
                            products: state.product.map(item => getProductIdFromProduct(item))
                        };

                        const reqOption = {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(schedule_data),
                            };
            
                        await fetch(`${SERVER_URL}createNewSchedule`, reqOption)
                                .then(async response => {
                                const data = await response.json();
                                // check for error response
                                if (!response.ok) {
                                    const error = (data && data.message) || response.status;
                                    return Promise.reject(error);
                                } else if (response.schedule_id == "0") {
                                    notify("This timeframe is already exist.");
                                    return;
                                } else {
                                    notify("Successfully appended");
                                }
                                })
                                .catch(error => {
                                notify("Something went wrong!\n" + error);
                                });

                    })
                    .catch(error => {
                        notify('Something went wrong!\n' + error)
                    });
                })
                setState(
                    {
                        client_name: '',
                        user_name: "",
                        client_id: '',
                        user_id: '',
                        date: Date.now(),
                        userIDList: [],
                        visiting_reason: 0,
                        include_product: 0,
                        product: [],
                    }
                )

                setForm(
                    {
                        user_id: [],
                        start_date: null,
                        end_date: null,
                        tracking_type: null
                    }
                )
            }
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
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    } else if (data.sales_client_id != null) {
                        return
                    } else if (data.id != 0) {
                        history.push("/app/salesview");
                        
                    }

                })
                .catch(error => {
                    notify('Something went wrong!\n' + error)
                });
        }

    }

    const onReset = () => {
        setState({
            client_name: '',
            user_name: "",
            client_id: '',
            user_id: '',
            date: Date.now(),
            userIDList: [],
            visiting_reason: 0,
            include_product: 0,
            product: [],
        });
        setForm(
            {
                user_id: [],
                start_date: null,
                end_date: null,
                tracking_type: null
            }
        )
    }

    const clientList = clients.map(item => {
        return item?.value
    })

    const handleIsMultipleToggle = (event) => {
        setIsMultiple(event.target.checked);
    };

    return (
        <>
            <div className={classes.singlePage}>
                <PageTitle title="New Schedule" />
                
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
                        
                        </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                    <CustomCombobox req={true} name="Client Name" items={clientList} value={state.client_name}
                                        handleChange={(e) => handleChange(e, 'client_name')} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                    {isMultiple? 
                                        
                                        <FormControl fullWidth style={{margin: '10px', width: '95%'}}>
                                            <InputLabel id="employee-label">Multiple Employee Names</InputLabel>
                                            <Select
                                                labelId="employee-label"
                                                id="employee-checkbox"
                                                multiple
                                                value={typeof form.user_id !== 'object' ? [] : form.user_id}
                                                onChange={(e) => handleChange(e, 'multiple_employee_names')}
                                                renderValue={(selected) => userviewData.filter(item => selected.includes(item.user_id)).map(item => item.full_name).join(', ')}
                                            >
                                                {userviewData.map((user) => (
                                                    <MenuItem key={user.user_id} value={user.user_id}>
                                                        <Checkbox checked={!!form.user_id?.find?.(user_id => user_id === user.user_id)} />
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            width: '100%'
                                                        }}>
                                                            <div style={{marginRight: '6px'}}>
                                                                {user.full_name}
                                                            </div>
                                                        </Box>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>:
                                        <CustomCombobox req={true} name="Employee Name" items={userviewData.map(item => item.full_name)} value={state.user_name}
                                            handleChange={(e) => handleChange(e, 'employee_name')} />
                                    }
                                    {/*<FormControl className={classes.formControl}>
                                        
                                        <InputLabel id="demo-mutiple-checkbox-label">Employee Name</InputLabel>
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
                                    </FormControl>*/}
                                </Grid>

                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                    {/*<CustomCombobox req={true} name="Date Time" items={clientList} value={state.client_name}
                                        handleChange={(e) => handleChange(e, 'client_name')} />*/}
                                    <DateTimePicker
                                        style={{width: '95%'}}
                                        className={classes.formControl}
                                        ampm={false}
                                        label="Start Date"
                                        variant="inline"
                                        value={state.date}
                                        onChange={(e) =>handleChange(e, 'date')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                    <CustomCombobox req={true} name="Visiting Reason" items={visitingReasonData.map(item => item.name)} value={state.visiting_reason}
                                        handleChange={(e) => handleChange(e, 'visiting_reason')} />
                                </Grid>

                            </Grid>
                            {
                            state.include_product ? 
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                    <FormControl className={classes.formControl} style={{width: '95%'}}>
                                        <InputLabel id="demo-mutiple-checkbox-label">Products</InputLabel>
                                        <Select
                                            disabled={!state.include_product}
                                            labelId="demo-mutiple-checkbox-label"
                                            id="demo-mutiple-checkbox"
                                            multiple
                                            value={state.product}
                                            onChange={(e) => handleChange(e, 'products')}
                                            input={<Input />}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                        >
                                            {products.map((name) => (
                                                <MenuItem key={name.id} value={name.value}>
                                                    <Checkbox checked={state.product.indexOf(name.value) > -1} />
                                                    <ListItemText primary={name.value} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>: <div></div>
                            }
                            &nbsp;&nbsp;&nbsp;
                            {/*<div style={{paddingLeft: '10px', paddingRight: '10px'}}>
                                <Text strong>Enter notes</Text>
                                <TextArea rows={4} placeholder="Enter notes" maxLength={150} handleChange={(e) => handleChange(e, 'notes')} />
                        </div>*/}
                            <Grid container spacing={1}>
                                <Grid item xs={4} md={4} lg={4}></Grid>
                                <Grid item xs={6} md={6} lg={8}>
                                    <Grid container spacing={4} className={classes.buttonContainer} justifyContent="space-between">
                                        <Grid item xs={2}>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                className={classes.button}
                                                startIcon={<Icons.Refresh />}
                                                onClick={() => onReset()}
                                            >
                                                Reset
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

                                    </Grid>

                                </Grid>
                            </Grid>
                        </Widget>
                    </Grid>
                </Grid>
                <AntdDivider />
                &nbsp;&nbsp;
                <div style={{display: 'flex'}}>
                    <div>
                    <Text style={{fontWeight:'600'}}>Multiple Employees Scheduling</Text>
                    <Switch
                    checked={isMultiple}
                    onChange={handleIsMultipleToggle}
                    name="isMultiple"
                    inputProps={{ 'aria-label': 'toggle switch' }}
                    />
                    </div>
                    <div style={{marginLeft: '20px'}}>
                        {isMultiple ?
                        <Card type="inner" title="Assigned employee names" style={{ width: 300 }}>
                        { 
                            form.user_id.map((id) => (
                            <p>{getUserNamebyUserId(id)}</p>
                            ))
                        }
                        </Card>: <div></div>
                        }
                    </div>
                </div>
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
)(AddSchedule);