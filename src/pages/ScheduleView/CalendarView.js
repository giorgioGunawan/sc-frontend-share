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
import { DatePicker, DateTimePicker } from '@material-ui/pickers';
import moment from 'moment'
import fetchScheduleDetail from '../../services/schedule/ScheduleDetailService'
import DailyScheduleView from './DailyScheduleView';
import DailyScheduleViewClean from './DailyScheduleViewClean';
import ScheduleMapView from './MapView';
import Paper from '@material-ui/core/Paper';

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

function CalendarView(props) {
    var classes = useStyles();
    let history = useHistory();
    const [errorToastId, setErrorToastId] = useState(null);
    var [notificationsPosition, setNotificationPosition] = useState(2);
    const [isSubmitPressed, setIsSubmitPressed] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const userData = useSelector(state => state.userview);
    const clientData = useSelector(state => state.clientview);
    const company_id = localStorage.getItem('company_id');
    const [isLoading, setIsLoading] = useState(false)
    const [visitingReasonData, setVisitingReasonData ] = useState([]);
    const [products, setProducts] = useState([]);
    const userviewData = useSelector(state => state.userview.userview);
    const [dailySched, setDailySchedule] = useState([]);
    const now = new Date(Date.now());
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const dateString = now.toLocaleDateString(undefined, options);

    // input form datas
    const [state, setState] = useState({
        client_name: '',
        user_name: "",
        client_id: '',
        user_id: 0,
        date: Date(),
        userIDList: [],
        visiting_reason: 0,
        include_product: 0,
        product: [],
        start_date: null,
        end_date: null,
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

    const fetchSchedule = async () => {      

        console.log('ggdate', state.date);
        const date = new Date(state.date);
        // create a new Date object with the same date as the given date object, but with time set to 00:00:00
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 1);

        // create a new Date object with the same date as the given date object, but with time set to 23:59:59
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

        const start_date = startOfDay ? moment(startOfDay).format("YYYY-MM-DD HH:mm") : null
        const end_date = endOfDay ? moment(endOfDay).format("YYYY-MM-DD HH:mm") : null

        console.log('ggdate', start_date);
        console.log('ggdate', end_date);


        const response = await fetch(`${SERVER_URL}getScheduleByUserId_v2`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: state.user_id,
            start_date: start_date,
            end_date: end_date,
          })
        });
      
        const responseData = await response.json();

        console.log('ggresponse', responseData);

        return responseData;
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
    const handleChange = async (e, field) => {

        if (field === 'date') {
            const date = new Date(e);
            // create a new Date object with the same date as the given date object, but with time set to 00:00:00
            const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 1);

            // create a new Date object with the same date as the given date object, but with time set to 23:59:59
            const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

            const start_date = startOfDay ? moment(startOfDay).format("YYYY-MM-DD HH:mm") : null
            const end_date = endOfDay ? moment(endOfDay).format("YYYY-MM-DD HH:mm") : null

            console.log('ggdate', start_date);
            console.log('ggdate', end_date);

            setState({
                ...state,
                date: e,
                start_date: start_date,
                end_date: end_date,
            })
        }

        if (field === 'employee_name') {
            await setState({
                ...state,
                user_name: e,
                user_id: users.filter(item => item.value == e)[0].key
            })
        }

    }

    const handleSubmit = async (e) => {
        
        setIsSubmitPressed(true);
        const date = new Date(state.date);
        // create a new Date object with the same date as the given date object, but with time set to 00:00:00
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 1);

        // create a new Date object with the same date as the given date object, but with time set to 23:59:59
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

        const start_date = startOfDay ? moment(startOfDay).format("YYYY-MM-DD HH:mm") : null
        const end_date = endOfDay ? moment(endOfDay).format("YYYY-MM-DD HH:mm") : null

        props.fetchScheduleDetail({
            user_id: state.user_id,
            start_date,
            end_date,
        }, (resScheduleDetail, ok) => {
            console.log(ok)
            if (ok) {
                console.log('gge', resScheduleDetail)
                const formattedSchedDetail = resScheduleDetail.map(item => {
                    const dateObj = new Date(item.check_out_datetime); // create a Date object from sDate
                    const oneLessHour = new Date(dateObj.getTime() - 60 * 60 * 1000); 
                    return {
                        key: item.schedule_id,
                        id: item.schedule_id,
                        start_date: oneLessHour,
                        end_date: item.check_out_datetime,
                        title: item.client_entity_name
                    }
                });
                setDailySchedule(formattedSchedDetail);
            }
        })
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

    const getReasonIdFromReason = (reason) => {
        const visiting_reason = visitingReasonData.find(item => item.name === reason);
        const id = visiting_reason ? visiting_reason.id : null;
        return id;
    }

    const getReasonFromReasonId = (reasonId) => {
        const visiting_reason = visitingReasonData.find(item => item.id === reasonId);
        const id = visiting_reason ? visiting_reason.name : null;
        return id;
    }

    const getProductIdFromProduct = (product_name) => {
        const product_with_name = products.find(item => item.value === product_name);
        const id = product_with_name ? product_with_name.id : null;
        return id;
    }

    const getVisitingReasonIdFromReason = (visiting_reason) => {
        const visit_reason_name = products.find(item => item.name === visiting_reason);
        const id = visit_reason_name ? visit_reason_name.id : null;
        return id;
    }

    const onSaveandNew = async () => {
        if (state.client_name == null || state.client_name == "") {
            notify("Please enter client name.")
            return
        } else {
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
    }

    const clientList = clients.map(item => {
        return item?.value
    })

    return (
        <>
            <div className={classes.singlePage} style={{margin:"30px"}}>
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
                        <Widget title="" disableWidgetMenu >
                            <Grid container spacing={1}>
                                <Grid item xs={8} md={8} lg={8}></Grid>
                                <Grid item xs={4} md={4} lg={4}>
                                    
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                    {userviewData ? 
                                    <CustomCombobox req={true} name="Employee Name" items={userviewData.map(item => item.full_name)} value={state.user_name}
                                        handleChange={(e) => handleChange(e, 'employee_name')} /> : <></>
                                    }
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                                    <div className={classes.datePickerContainer}>
                                        <DatePicker
                                            className={classes.formControl}
                                            ampm={false}
                                            disableFuture
                                            label="Date"
                                            variant="inline"
                                            value={state.date}
                                            onChange={(e) => handleChange(e, 'date')}
                                        />
                                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                                            Submit
                                        </Button>
                                    </div>
                                </Grid>
                            </Grid>
                        </Widget>
                    </Grid>
                </Grid>
                &nbsp;
                &nbsp;
                <Paper elevation={7}>
                <div style={{ display: 'flex', alignItems: 'stretch' }}>
                
                <div style={{ width: 'auto' }}>
                    {/*<DailyScheduleView schedules={dailySched} style={{ padding: '3px' }}/>*/}
                    <DailyScheduleViewClean schedules={dailySched} style={{ padding: '3px' }} />
                </div>
                {state.start_date && isSubmitPressed == true && (
                    <div style={{ paddingLeft: '10px', flexGrow: 1, height:'700px' }}> 
                    
                        <ScheduleMapView user_id={state.user_id} start_time={state.start_date} end_time={state.end_date} isSubmitPressed={isSubmitPressed}/>
                    
                    </div>
                )}
                
                </div>
                </Paper>
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
    fetchClientView: fetchClientView,
    fetchScheduleDetail: fetchScheduleDetail,
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CalendarView);