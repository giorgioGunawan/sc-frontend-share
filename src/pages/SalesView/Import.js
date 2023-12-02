import React, { useState, useEffect } from "react";
import { Grid, Input, IconButton, FormControlLabel, Switch, Divider, Button, ButtonGroup } from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';

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

function Import(props) {
    var classes = useStyles();
    let history = useHistory();
    const [errorToastId, setErrorToastId] = useState(null);
    var [notificationsPosition, setNotificationPosition] = useState(2);
    const [dataSource, setDataSource] = useState([]);
    const userData = useSelector(state => state.userview);
    const clientData = useSelector(state => state.clientview);

    // input form datas
    const [state, setState] = useState({
        client_names: [],
        user_names: [],
        client_ids: [],
        user_ids: [],
        userIDList: [],
        language: "bahasa", // default language
        salesClientList: [0],
        salesClientCount: 1,
    })

    useEffect(() => {
        props.fetchClientView()
        props.fetchUserView();
    }, [])

    const [userList, setUserList] = React.useState([]);

    //Show notification
    const notify = (message) => toast(message);
    const getClientNameList = (original) => {
        console.log('originall ====> ', original, clientData.clientview)
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

    const clients = getClientNameList(clientData.clientview)

    console.log("Client Data =====> ", clients.map(item => {
        return item?.value
    }))

    const getUserNameList = (original) => {
        console.log('originall ====> ', original, userData.userview)
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


    //input fields event
    const handleChange = (e, index, field) => {

      console.log('index',index);
      console.log('aab',e)
      console.log('aab2',clients)
      console.log('aab3',clients.filter(item => item.value == e))


        if (field == "client_names") {
            if (clients.filter(item => item.value == e)[0] != null) {
                const newClientName = state.client_names.slice()
                const newClientIds = state.client_ids.slice()
                if (index + 1 > newClientName.length) {
                  newClientName.push(e);
                  newClientIds.push(clients.filter(item => item.value == e)[0].key)
                } else {
                  newClientName[index] = e;
                  newClientIds[index] = clients.filter(item => item.value == e)[0].key
                }
                console.log('newClientName',newClientName);
                console.log('newClientIds',newClientIds);
                setState({
                    ...state,
                    client_names: newClientName,
                    client_ids: newClientIds,
                })
            }

        }
        console.log('clienIds',state.client_ids);
    }

    const handleNameChange = (e, index) => {
        console.log('handleNameChange index, e', index, '  ', e)

        console.log('handleNameChange e.target.value', e.target.value)

        const userId = getUserIDbyUserName(e.target.value)
        const userName = e.target.value

        console.log('handleNameChange userId', userId)

        const newUserName = state.user_names.slice()
        const newUserIds = state.user_ids.slice()
        if (index + 1 > newUserIds.length) {
          newUserIds.push(userId);
          newUserName.push(userName);
        } else {
          newUserIds[index] = userId;
          newUserName[index] = userName;
        }
        console.log('newUserIds', newUserIds);
        console.log('newUserName', newUserName);
        setState(prevState => ({
            ...prevState,
            user_ids: newUserIds,
            user_names: newUserName,
        }))
    };

    const getUserIDbyUserName = (user_name) => {
        console.log("state.user===>", users)
        let object = userData.userview.filter(item => item.full_name == user_name)
        if (object[0] != null) {
            return object[0].user_id
        }

    }

    const onSaveandNew = () => {
        if (state.client_names == null || state.client_names == "") {
            notify("Please enter client name.")
            return
        } else {
            for (let i = 0; i < state.user_ids.length; i++) {
              console.log('request option', state.client_ids[i])
              console.log('request option user ids', state.user_ids[i])

              const requestOptions = {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                      client_id: String(state.client_ids[i]),
                      user_id: [String(state.user_ids[i])],
                  })
              };
              fetch(`${SERVER_URL}addSalesClient`, requestOptions)
                  .then(async response => {
                      const data = await response.json();
                      console.log("Response Data=============>", data)
                      // check for error response
                      if (!response.ok) {
                          // get error message from body or default to response status
                          const error = (data && data.message) || response.status;
                          return Promise.reject(error);
                      } else if (data.sales_client_id != null) {
                          notify("Some relationships already exist")
                          return
                      } else if (data.id != 0) {
                          if (i == state.user_ids.length - 1) {
                            handleNotificationCall("shipped");
                          }
                          setState(prevState => ({
                            ...prevState,
                            client_names: [],
                            user_names: [],
                            client_ids: [],
                            user_ids: [],
                            userIDList: [],
                            salesClientList: [0],
                        }))
                          
                      }

                  })
                  .catch(error => {
                      notify('Something went wrong!\n' + error)
                      console.error('There was an error!', error);
                  });
            }
        }
    }

    const onSaveandBack = () => {
        if (state.client_names == null || state.client_names == []) {
            notify("Please enter client name.")
            return
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_ids: state.client_ids,
                    user_id: state.userIDList,
                })
            };
            fetch(`${SERVER_URL}addSalesClient`, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log("Response Data=============>", data)
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    } else if (data.sales_client_id != null) {
                        notify("This client is already exist.")
                        return
                    } else if (data.id != 0) {

                        handleNotificationCall("shipped");
                        setState(()=>({
                            client_names: [],
                            user_names: [],
                            client_ids: [],
                            user_ids: [],
                        }))
                        history.push("/app/salesview");
                        
                    }

                })
                .catch(error => {
                    notify('Something went wrong!\n' + error)
                    console.error('There was an error!', error);
                });
        }

    }

    const clientList = clients.map(item => {
        return item?.value
    })

    const handleClick = (e) => {
      e.preventDefault();
      setState(prevState => ({
          ...prevState,
          language: e.currentTarget.value
      }))
    }

    const handleAddSalesClient = () => {
      setState(prevState => ({
        ...prevState,
        salesClientCount: state.salesClientCount + 1
      }))
      setState(prevState => ({
        ...prevState,
        salesClientList: [...state.salesClientList, state.salesClientCount - 1]
      }))
    }

    return (
        <>
            <div className={classes.languageOption}>
                  <ButtonGroup>
                      <Button onClick={handleClick} value={"bahasa"}>Bahasa Indonesia</Button>
                      <Button onClick={handleClick} value={"english"}>English</Button>
                  </ButtonGroup>
            </div>
            &nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;
            <div className={classes.item} style={{display: 'flex', flexDirection: 'column'}}>
                <h4>{state.language === "bahasa" ? "Tambah hubungan karyawan dan klien, dan tonton tutorial dibawah jika perlu panduan" : "Add employee and client relationship, and watch the tutorial below for help"}</h4>
                <div>
                    {
                    state.language === "bahasa" ? 
                    <div 
                        style={{height: '100%', width: '100%', flexGrow: '1'}}
                        dangerouslySetInnerHTML={{ __html:"<iframe src='https://www.loom.com/embed/7486de2beee04116b2b84f82e35ccd35' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen style={{position: 'absolute', width: '100%', height: '100%'}};/>"}}
                    />
                    :
                    <div 
                        style={{height: '100%', width: '100%', flexGrow: '1'}}
                        dangerouslySetInnerHTML={{ __html:"<iframe src='https://www.loom.com/embed/0282792edb9445dd87801490955cfa5b' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen style={{position: 'absolute', width: '100%', height: '100%'}};/>"}}
                    />
                    }
                </div>                    
            </div>
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
                  <div className={classes.item}>
                    <div className={classes.multiFormComponent}>
                      {state.salesClientList.map((item, index) => (
                        <>
                        <div className={classes.formContainerImport}>
                          <div className={classes.formInput}>
                            <CustomCombobox req={true} name={state.language === "bahasa" ? "Nama klien" : "Client Name"} items={clientList} value={state.client_names[index]}
                              handleChange={(e) => handleChange(e, index, 'client_names')} />
                          </div>
                          &nbsp;&nbsp;&nbsp;
                          <div className={classes.formInput}>
                              <FormControl className={classes.formControl}>
                                <InputLabel id="demo-mutiple-checkbox-label">{state.language === "bahasa" ? "Nama karyawan" : "Employee's Name"}</InputLabel>
                                <Select
                                  labelId="demo-mutiple-checkbox-label"
                                  id="demo-mutiple-checkbox"
                                  value={state.user_names[index]}
                                  onChange={(e) => handleNameChange(e, index)}
                                  input={<Input />}
                                  renderValue={selected => selected}
                                  MenuProps={MenuProps}
                                >
                                  {users.map((name) => (
                                    <MenuItem key={name.value} value={name.value}>
                                      <Checkbox checked={userList.indexOf(name.value) > -1} />
                                      <ListItemText primary={name.value} />
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              &nbsp;
                            </div>
                          </div>
                          </>
                    ))}
                    </div>
                    </div>
                  <Grid container>
                      <Grid item xs={8} md={8} lg={8}></Grid>
                      <Grid item xs={4} md={4} lg={4}>
                          <Grid container spacing={1} className={classes.buttonContainer}>
                              <Grid item>
                                  <Button
                                      variant="contained"
                                      color="secondary"
                                      className={classes.button}
                                      onClick={() => handleAddSalesClient()}
                                  >
                                      {state.language === "bahasa" ? "Tambah baris" : "Add more rows"}
                                  </Button>
                              </Grid>
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
                          </Grid>
                      </Grid>
                  </Grid>
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
)(Import);