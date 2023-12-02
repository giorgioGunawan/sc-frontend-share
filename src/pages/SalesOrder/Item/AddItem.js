import React, { useState, useEffect, useRef } from "react";
import { Grid, Input, IconButton, FormControlLabel, Switch, Divider, Button } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

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
import fetchCompany from "../../../services/company/CompanyService";
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

function AddItemPage(props) {
    var classes = useStyles();
    let history = useHistory();
    const [errorToastId, setErrorToastId] = useState(null);
    var [notificationsPosition, setNotificationPosition] = useState(2);
    const [dataSource, setDataSource] = useState([]);
    const companyData = useSelector(state => state.company);

    // input form datas
    const [state, setState] = useState({
        company_entity_name: '',
        item_name: "",
        company_id: '',
        category_id: '',
        category_name: '',
        unit_price: '',
        unit: '',
        tag: '',
        companyIDList: localStorage.getItem('company_id').split(', '),
        categoryList: [],
        categoryNameList: [],
        unitList: [],
        item_id: 0,
        showDiscount: false,
        discount_type: "UNIT",
        min_qty: '',
        max_qty: '',
        amount: '',
        discountList: []
    })

    useEffect(() => {
        props.fetchCompany();
        console.log(companyData)
        getGroup()
        getUnit()
    }, [])

    const getGroup = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch(`${SERVER_URL}getCategory`, requestOptions)
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
                    list.push(item.category_name)
                })
                setState((state) => ({
                    ...state,
                    categoryList: data,
                    categoryNameList: [...list]
                }))
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    console.log('********************** state.categoryNameList ==>', state.categoryNameList)

    const getUnit = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch(`${SERVER_URL}getUnit`, requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                console.log("unitData--> ", data, state)
                let list = []
                data.map(unit => {
                    list.push(unit.unit_name)
                })
                setState((state) => ({
                    ...state,
                    unitList: [...list],
                }))
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
    //Show notification
    const notify = (message) => toast(message);
    const objArray2Array = (original) => {
        console.log('originall ====> ', state.companyIDList)
        let tmp = ["All"];
        if (Boolean(original)) {
            if (original.length) {
                original.map(item => {
                    if (state.companyIDList.includes(item.company_id.toString()))
                        tmp.push(item?.company_entity_name);
                })
                console.log('Temp==> ', tmp)
                return tmp;
            }
            return [];
        } else {
            return []
        }
    }

    const companies = objArray2Array(companyData.company)

    const setCompanyIdfromCompanyName = (company_entity_name) => {
        let com_id = ''
        if (company_entity_name == "All") {
            com_id = state.companyIDList.join(', ');
            setState({
                ...state,
                company_id: com_id
            })
        } else {
            let object = companyData.company.filter(item => item.company_entity_name == company_entity_name)
            if (object[0] != null) {
                com_id = object[0].company_id.toString()
                setState({
                    ...state,
                    company_id: com_id
                })
            }
        }

    }

    const setGroupIdfromGroupName = (category_name) => {
        let object = state.categoryList.filter(item => item.category_name == category_name)
        if (object[0] != null) {
            console.log("object[0].category_id==>", object[0].category_id)
            setState({
                ...state,
                category_id: object[0].category_id
            })
        }

    }

    const handleChange = (e, field) => {

        if (field == 'company_entity_name') {
            setCompanyIdfromCompanyName(e)
            setState(prevState => ({
                ...prevState, [field]: e
            }))
        } else if (field == 'category_name') {
            setGroupIdfromGroupName(e)
            setState(prevState => ({
                ...prevState, [field]: e
            }))
        } else if (field == 'unit') {
            setState(prevState => ({
                ...prevState, [field]: e
            }))
        } else if (field == "discount_type") {
            setState(prevState => ({
                ...prevState, [field]: e
            }))
        } else {
            const { name, value } = e.target;
            setState(prevState => ({
                ...prevState, [field]: value
            }))
        }
    }

    const onSave = () => {
        if (state.category_name == null || state.category_name == "") {
            notify("Please enter group name.")
            return
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    item_name: state.item_name,
                    category_id: state.category_id,
                    company_id: state.company_id,
                    unit_price: state.unit_price,
                    unit: state.unit,
                    tag: state.tag
                })
            };
            fetch(`${SERVER_URL}createItem`, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log("Response Data=============>", data)
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    } else if (data.id == 0) {
                        notify("This item is already exist.")
                        return
                    } else if (data.id != 0) {
                        setState((state) => ({
                            ...state,
                            item_id: data.id,
                            showDiscount: true
                        }))
                        handleNotificationCall("shipped");
                    }
                })
                .catch(error => {
                    notify('Something went wrong!\n' + error)
                    console.error('There was an error!', error);
                });
        }

    }
    const onAddDiscount = () => {
        if (state.min_qty == "") {
            notify("Please enter min quantity.")
        } else if (state.max_qty == "") {
            notify("Please enter max quantity.")
        } else if (state.amount == "") {
            notify("Please enter amount")
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    item_id: state.item_id,
                    amount: state.amount,
                    min_quantity: state.min_qty,
                    max_quantity: state.max_qty,
                    type: state.discount_type
                })
            };
            fetch(`${SERVER_URL}createDiscount`, requestOptions)
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
                        let list = state.discountList
                        list.push({
                            item_id: state.item_id,
                            amount: state.amount,
                            min_qty: state.min_qty,
                            max_qty: state.max_qty,
                            type: state.discount_type,
                            discount_id: data.discount_id
                        })
                        setState((state) => ({
                            ...state,
                            discountList: list
                        }))
                    }

                })
                .catch(error => {
                    notify('Something went wrong!\n' + error)
                    console.error('There was an error!', error);
                });
        }
    }

    const onDelete = (discount_id) => {
        console.log("Discount ID ==> ", discount_id)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                discount_id: discount_id
            })
        };
        fetch(`${SERVER_URL}removeDiscount`, requestOptions)
            .then(async response => {
                const data = await response.json();
                console.log("Response Data=============>", data)
                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                let list = state.discountList
                list = list.filter(item => {
                    return item.discount_id != discount_id
                })
                setState((state) => ({
                    ...state,
                    discountList: list
                }))
            })
            .catch(error => {
                notify('Something went wrong!\n' + error)
                console.error('There was an error!', error);
            });
    }

    const onCancel = () => {
        history.push("/app/salesorder/item");
    }

    return (
        <>
            <PageTitle title="New Item" />
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
                        <Grid container spacing={5}>
                            <Grid item xs={12} sm={6} md={6} lg={4} className={classes.formContainer}>
                                <CustomInput req={true} title="Name" value={state.item_name}
                                    handleChange={(e) => handleChange(e, 'item_name')} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={4} className={classes.formContainer}>
                                <CustomCombobox req={true} name="Company Name" items={companies} value={state.company_entity_name}
                                    handleChange={(e) => handleChange(e, 'company_entity_name')} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={4} className={classes.formContainer}>
                                <CustomCombobox req={true} name="Category Name" items={state.categoryNameList} value={state.category_name}
                                    handleChange={(e) => handleChange(e, 'category_name')} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={5}>
                            <Grid item xs={12} sm={6} md={6} lg={4} className={classes.formContainer}>
                                <CustomInput req={true} title="Unit Price" value={state.unit_price}
                                    handleChange={(e) => handleChange(e, 'unit_price')} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={4} className={classes.formContainer}>
                                <CustomCombobox req={true} name="Unit" items={state.unitList} value={state.unit}
                                    handleChange={(e) => handleChange(e, 'unit')} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={4} className={classes.formContainer}>
                                <CustomInput req={true} title="Tag" value={state.tag}
                                    handleChange={(e) => handleChange(e, 'tag')} />
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid container spacing={1}>
                            <Grid item xs={6} md={6} lg={6}></Grid>
                            <Grid item xs={6} md={6} lg={6}>
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
                        {
                            state.discountList.length != 0 ? <>
                                {
                                    state.discountList.map(item => {
                                        return (
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} sm={6} md={6} lg={2} className={classes.formContainer}>
                                                    <CustomInput disabled={true} title="Discount Type" value={item.type} />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={6} lg={2} className={classes.formContainer}>
                                                    <CustomInput disabled={true} title="Min QTY" value={item.min_qty} />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={6} lg={2} className={classes.formContainer}>
                                                    <CustomInput disabled={true} title="Max QTY" value={item.max_qty} />
                                                </Grid>
                                                {
                                                    item.type == "UNIT" ? <>
                                                        <Grid item xs={12} sm={6} md={6} lg={2} className={classes.formContainer}>
                                                            <CustomInput disabled={true} title="Free Unit" value={item.amount} />
                                                        </Grid>
                                                    </> : <>
                                                            <Grid item xs={12} sm={6} md={6} lg={2} className={classes.formContainer}>
                                                                <CustomInput disabled={true} title="Percentage" value={item.amount} />
                                                            </Grid>
                                                        </>
                                                }
                                                <Grid item xs={12} sm={6} md={6} lg={2} className={classes.formContainer}>
                                                    <IconButton aria-label="delete" className={classes.margin} onClick={() => onDelete(item.discount_id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        )

                                    })
                                }
                            </> : null
                        }

                        {
                            state.showDiscount ? <>
                                <Divider />
                                <Grid container spacing={5}>
                                    <Grid item xs={12} sm={6} md={6} lg={2} className={classes.formContainer}>
                                        <CustomCombobox req={true} name="Discount Type" items={["UNIT", "PERCENT"]} value={state.discount_type}
                                            handleChange={(e) => handleChange(e, 'discount_type')} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={2} className={classes.formContainer}>
                                        <CustomInput req={true} title="Min QTY" value={state.min_qty}
                                            handleChange={(e) => handleChange(e, 'min_qty')} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={2} className={classes.formContainer}>
                                        <CustomInput req={true} title="Max QTY" value={state.max_qty}
                                            handleChange={(e) => handleChange(e, 'max_qty')} />
                                    </Grid>
                                    {
                                        state.discount_type == "UNIT" ? <>

                                            <Grid item xs={12} sm={6} md={6} lg={2} className={classes.formContainer}>
                                                <CustomInput req={true} title="Free Unit" value={state.amount}
                                                    handleChange={(e) => handleChange(e, 'amount')} />
                                            </Grid>
                                        </> : <>

                                                <Grid item xs={12} sm={6} md={6} lg={2} className={classes.formContainer}>
                                                    <CustomInput req={true} title="Percentage" value={state.amount}
                                                        handleChange={(e) => handleChange(e, 'amount')} />
                                                </Grid>
                                            </>
                                    }
                                    <Grid item xs={12} sm={6} md={6} lg={2} className={classes.formContainer}>
                                        <IconButton aria-label="delete" className={classes.margin} onClick={() => onAddDiscount()}>
                                            <AddIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </>
                                : null
                        }

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
)(AddItemPage);