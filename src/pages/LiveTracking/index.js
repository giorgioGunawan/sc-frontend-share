import { Box, Button, Checkbox, CircularProgress, colors, FormControl, Grid, InputLabel, ListItemText, MenuItem, Modal, OutlinedInput, Select, Tooltip } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import PageTitle from '../../components/PageTitle/PageTitle'
import { DatePicker, DateTimePicker } from '@material-ui/pickers'
import { bindActionCreators } from 'redux'
import { connect, useSelector } from 'react-redux'
import fetchUserView from '../../services/users/UserViewService'
import fetchMapTrackerHistories from '../../services/mapTracker/MapTrackerHistories'
import { GOOGLE_MAP_API_KEY, SERVER_URL, WEBSOCKET_MAP_TRACKER_URL } from '../../common/config'
import GoogleMapReact from 'google-map-react';
import Marker from './components/Marker'
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import getRandomColor from '../../utils/getRandomColor'
import { Room, CheckCircle, HourglassEmpty } from '@material-ui/icons'
import fetchScheduleDetail from '../../services/schedule/ScheduleDetailService'
import { makeStyles, withStyles } from '@material-ui/styles'
import ScheduleModal from '../../components/ScheduleModal'
import LastSeenBox from '../../components/LastSeenBox'


const DEFAULT_MAP = {
    center: {
        lat: -6.200000,
        lng: 106.816666
      },
    zoom: 12
}

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    borderRadius: `20px`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  tableWrapper: {
    paddingRight: '15px',
    paddingLeft: '15px',
  }
}));

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
    arrow: {
        color: '#f5f5f9',
    }
  }))(Tooltip);

const LiveTrackingPage = (props) => {
    const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
    const [form, setForm] = useState({
        user_id: [],
        start_date: null,
        end_date: null,
        tracking_type: null
    })
    const [defaultMap, setDefaultMap] = useState(DEFAULT_MAP)
    const [histories, setHistories] = useState([])
    const [tracker, setTracker] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [userColors, setUserColors] = useState({})
    const [schedules, setSchedules] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [selectedSchedule, setSelectedSchedule] = useState({})
    const [socketUrl, setSocketUrl] = useState(WEBSOCKET_MAP_TRACKER_URL);
    const [lastSeenList, setLastSeenList] = useState([])

    const { lastMessage, readyState, getWebSocket } = useWebSocket(socketUrl);

    const userviewData = useSelector(state => state.userview);

    const handleScheduleDetail = (id) => {
        setModalIsOpen(true)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id
            })
          }
          fetch(`${SERVER_URL}getScheduleById`, requestOptions)
              .then(async response => {
                  const data = await response.json();
                  setSelectedSchedule(data)
              })
              .catch(() => {
                
              })
    }

    const handleCloseModal = () => {
        setModalIsOpen(false)
    }

    const handleCenterMap = (item) => {
        setDefaultMap(defaultMap => {
            return {
                ...defaultMap,
                center: {
                    lat: item.lat,
                    lng: item.long
                }
            }
        })
    }

    const getLiveTrackerSetting = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({company_id: localStorage.getItem('company_id')})
        }
        if (localStorage.getItem('company_id')) {
            fetch(`${SERVER_URL}getLiveTrackerSetting`, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    setDefaultMap(defaultMap => {
                        return {
                            ...defaultMap,
                            center: {
                                lat: parseFloat(data.latitude),
                                lng: parseFloat(data.longitude)
                            }
                        }
                    })
                })
        }
    }

    const handleSearch = async () => {
        setLastSeenList([])
        if (form.tracking_type === 2) {
            const start_date = form.start_date ? moment(form.start_date).format('YYYY-MM-DD HH:mm') : null
            const end_date = form.end_date ? moment(form.end_date).format('YYYY-MM-DD HH:mm') : null
            setIsLoading(true)
            getWebSocket().close()
            setSocketUrl('')
            setTracker([])
            props.fetchScheduleDetail({
                user_id: form.user_id,
                start_date,
                end_date,
            }, (resScheduleDetail, ok) => {
                if (ok) {
                    setSchedules(resScheduleDetail)
                    props.fetchMapTrackerHistories({
                        user_id: form.user_id,
                        start_date,
                        end_date,
                    }, (resTrackerHistories, ok) => {
                        setIsLoading(false)
                        if (ok && !resTrackerHistories?.data?.length && !resScheduleDetail?.length) {
                            toast('Data is empty')
                        }
                        const temp = resTrackerHistories?.data?.map?.((item, i) => {
                            return {
                                ...item,
                                is_last: resTrackerHistories?.data?.length === i+1
                            }
                        })
                        setHistories(temp || [])
                    })
                } else {
                    setSchedules([])
                }
            })
        } else if(form.tracking_type === 1) {
            setSchedules([])
            setIsLoading(true)
            const lastSeenListTemp = form.user_id?.map?.(user_id => {
                return {
                    user_id,
                    full_name: userviewData.userview.find(item => item.user_id === user_id)?.full_name,
                    lastSeen: null
                }
            })
            setLastSeenList(lastSeenListTemp)
            props.fetchMapTrackerHistories({
                user_id: form.user_id,
            }, (res, ok) => {
                setIsLoading(false)
                if (ok) {
                    const temp = {}
                    const temp2 = []
                    res.data.forEach((item, i) => {
                        if (!temp[item.user_id]) {
                            temp[item.user_id] = []
                        }
                        temp[item.user_id].push(item)
                    })
                    Object.keys(temp).forEach(key => {
                        temp[key].forEach((item, i) => {
                            if (temp[key].length === i+1) {
                                temp2.push(item)
                            }
                        })
                    })
                    toast('live tracker is active')
                    console.log('hello', temp2)
                    console.log('hello form user id', form.user_id)
                    setTracker(temp2 || [])
                    setSocketUrl(`${WEBSOCKET_MAP_TRACKER_URL}live-tracking?user_id=${JSON.stringify(form.user_id)}`)
                }
            })
        }
    }

    useEffect(() => {
        if (lastMessage !== null) {
            const resItem = JSON.parse(lastMessage.data)
            const temp = [...tracker]
            const index = temp.findIndex(item => item.user_id === resItem.user_id)
            if (index !== -1) {
                temp[index] = resItem
            } else {
                temp.push(resItem)
            }
            setTracker(temp)
        }
      }, [lastMessage, setTracker]);
    

    useEffect(() => {
        props.fetchUserView((res, ok) => {
            if (ok && res.length) {
                const temp = {}
                console.log(Object.keys(colors))
                res.forEach((item, i) => {
                    temp[item.user_id] = colors[Object.keys(colors)[i+1]]?.['500'] ? colors[Object.keys(colors)[i+1]]?.['500'] : getRandomColor()
                })
                setUserColors(temp)
            }
        });
        getLiveTrackerSetting()
    }, [])

    useEffect(() => {
        const temp = lastSeenList.map(item => {
            return {
                ...item,
                lastSeen: tracker.find(user => user.user_id === item.user_id) ? (tracker.find(user => user.user_id === item.user_id)?.created_at || new Date()) : null
            }
        })
        temp.sort((a,b) => a.lastSeen ? -1 : 1 )
        setLastSeenList(temp)
    }, [tracker])
    

    useEffect(() => {
      if (form.tracking_type === 1) {
        setForm({
            ...form,
            user_id: [],
            start_date: null,
            end_date: null
        })
      } else {
            setForm({
                ...form,
                user_id: ''
            })
      }
    }, [form.tracking_type])

    const buttonIsDisabled = (() => {
        if (isLoading) {
            return true
        }
        if (!form.tracking_type) {
            return true
        }
        if ((typeof form.user_id === 'number' || typeof form.user_id === 'string') && !form.user_id) {
            return true
        }
        if (typeof form.user_id === 'object' && !form.user_id?.length) {
            return true
        }
        return false
    })()

    const handleChangeUserLive = (e) => {
        const value = e.target.value
        if (value?.some?.(item => item === 'all')) {
            setForm({
                ...form,
                user_id: userviewData?.userview?.map?.(item => item.user_id) || []
            })
        } else {
            setForm({
                ...form,
                user_id: e.target.value,
            })
        }
    }

    // console.log(lastSeenList, tracker, 'trackerrr');
    
    return (
        <div>
            <ToastContainer />
            <Grid container className={classes.tableWrapper}>
                <Grid container item xs={12} md={11}>
                    <Grid item xs={12} md={6} lg={3}>
                        <Box sx={{
                            px: 1
                        }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Tracking Type</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={form.tracking_type}
                                label="Tracking Type"
                                onChange={(e) => setForm({
                                    ...form,
                                    tracking_type: e.target.value
                                })}
                                >
                                    <MenuItem value={1}>Live</MenuItem>
                                    <MenuItem value={2}>Historical</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        {
                            form.tracking_type === 1
                                ?
                                <Box sx={{
                                    px: 1
                                }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="employee-label">Employee</InputLabel>
                                        <Select
                                            disabled={!!!form.tracking_type}
                                            labelId="employee-label"
                                            id="employee-checkbox"
                                            multiple
                                            value={typeof form.user_id !== 'object' ? [] : form.user_id}
                                            onChange={handleChangeUserLive}
                                            renderValue={(selected) => userviewData.userview.filter(item => selected.includes(item.user_id)).map(item => item.full_name).join(', ')}
                                        >
                                            <MenuItem value="all">
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    width: '100%'
                                                }}>
                                                    <div>Select All</div>
                                                </Box>
                                            </MenuItem>
                                            {userviewData.userview?.map?.((user) => (
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
                                                        <Marker
                                                            color={userColors[user.user_id]}
                                                        />
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                                :
                                <Box sx={{
                                    px: 1
                                }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="emoloyee-label">Employee</InputLabel>
                                        <Select
                                        disabled={!!!form.tracking_type}
                                        labelId="emoloyee-label"
                                        id="emoloyee"
                                        value={form.user_id}
                                        label="Tracking Type"
                                        onChange={(e) => setForm({
                                            ...form,
                                            user_id: e.target.value
                                        })}
                                        >
                                            {
                                                userviewData.userview?.map?.(user => (
                                                    <MenuItem key={user.user_id} value={user.user_id}>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            width: '100%'
                                                        }}>
                                                            <div style={{marginRight: '6px'}}>
                                                                {user.full_name}
                                                            </div>
                                                            <Marker
                                                                color={userColors[user.user_id]}
                                                            />
                                                        </Box>
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                        }
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Box sx={{
                            px: 1
                        }}>
                            <FormControl fullWidth>
                                <DateTimePicker
                                    ampm={false}
                                    disabled={form.tracking_type === 1}
                                    disableFuture
                                    label="Start Date"
                                    variant="inline"
                                    value={form.start_date}
                                    onChange={(e) => setForm({
                                        ...form,
                                        start_date: e
                                    })}
                                />
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Box sx={{
                            px: 1
                        }}>
                            <FormControl fullWidth>
                                <DateTimePicker
                                    ampm={false} 
                                    minDate={form.start_date}
                                    disabled={form.start_date ? false : true || form.tracking_type === 1}
                                    disableFuture
                                    label="End Date"
                                    variant="inline"
                                    value={form.end_date}
                                    onChange={(e) => setForm({
                                        ...form,
                                        end_date: e
                                    })}
                                />
                            </FormControl>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container item xs={12} md={1}>
                    <Box sx={{
                        px: 1,
                        alignSelf: 'end'
                    }}>
                        <Button disabled={buttonIsDisabled} onClick={handleSearch} color="primary" variant="contained">
                            {
                                isLoading
                                ?
                                <CircularProgress size="23px" style={{color: 'white'}} />
                                :
                                'Search'
                            }
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <div style={{ height: "82vh", width: "100%", marginTop: "24px", position: 'relative' }} className={classes.tableWrapper}>
                {
                    lastSeenList.length && !isLoading ? (
                        <div style={{
                            position: 'absolute',
                            top: '12px',
                            left: '29px',
                            zIndex: 3
                        }}>
                            <LastSeenBox data={lastSeenList} />
                        </div>
                    ) : null
                }
                <GoogleMapReact
                    bootstrapURLKeys={{ key: GOOGLE_MAP_API_KEY }}
                    defaultCenter={DEFAULT_MAP.center}
                    defaultZoom={DEFAULT_MAP.zoom}
                    center={defaultMap.center}
                    zoom={defaultMap.zoom}
                    onDragEnd={(e) => setDefaultMap({
                        center: {
                            lat: e.center.lat(),
                            lng: e.center.lng()
                        },
                        zoom: defaultMap.zoom
                    })}
                    
                >
                    {
                        tracker.map(item => {
                            return (
                                <HtmlTooltip 
                                    key={item.id}
                                    arrow
                                    title={
                                        <>
                                            <h3>{item.full_name || '-'}</h3>
                                            <div>{moment(item.created_at).format("DD MMM YYYY, HH:mm")}</div>
                                            <div>{item.lat+', '+item.long}</div>
                                        </>
                                    }
                                    lat={item.lat}
                                    lng={item.long}
                                >
                                    <Room
                                        onClick={() => handleCenterMap(item)}
                                        style={{
                                            fontSize: '36px',
                                            color: userColors[item.user_id]
                                        }}
                                    />
                                </HtmlTooltip>
                            )
                        })
                    }
                    {
                        histories.map(item => {
                            if (item.is_last) {
                                return(
                                    <HtmlTooltip 
                                        key={item.id}
                                        arrow
                                        title={
                                            <>
                                                <h3>{item.full_name || '-'}</h3>
                                                <div>{moment(item.created_at).format("DD MMM YYYY, HH:mm")}</div>
                                                <div>{item.lat+', '+item.long}</div>
                                            </>
                                        }
                                        lat={item.lat}
                                        lng={item.long}
                                    >
                                        <Room
                                            onClick={() => handleCenterMap(item)}
                                            style={{
                                                fontSize: '36px',
                                                color: userColors[item.user_id]
                                            }}
                                        />
                                    </HtmlTooltip>
                                )
                            } else {
                                return (
                                    <HtmlTooltip 
                                        key={item.id}
                                        arrow
                                        title={
                                            <>
                                                <h3>{item.full_name || '-'}</h3>
                                                <div>{moment(item.created_at).format("DD MMM YYYY, HH:mm")}</div>
                                                <div>{item.lat+', '+item.long}</div>
                                            </>
                                        }
                                        lat={item.lat}
                                        lng={item.long}
                                    >
                                        <Marker
                                            color={userColors[item.user_id]}
                                        />
                                    </HtmlTooltip>
                                )
                            }
                        })
                    }
                    {
                        schedules.map(item => {
                            if (item.check_in_datetime && item.check_out_datetime) {
                                return (
                                    <CheckCircle
                                        style={{
                                            fontSize: '36px',
                                            color: '#3D8361'
                                        }}
                                        key={item.schedule_id}
                                        lat={item.lat}
                                        lng={item.long}
                                        onClick={()=> handleScheduleDetail(item.schedule_id)}
                                    />
                                )
                            } else if (item.check_in_datetime && !item.check_out_datetime) {
                                return (
                                    <HourglassEmpty
                                        style={{
                                            fontSize: '36px',
                                            color: '#FFB200'
                                        }}
                                        key={item.schedule_id}
                                        lat={item.lat}
                                        lng={item.long}
                                        onClick={()=> handleScheduleDetail(item.schedule_id)}
                                    />
                                )
                            }
                        })
                    }
                </GoogleMapReact>
                <ScheduleModal
                    open={modalIsOpen}
                    onClose={handleCloseModal}
                    schedule={selectedSchedule}
                />
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    userview: state.userview,
    scheduleDetail: state.scheduleDetail
})
  
const mapDispatchToProps = dispatch => bindActionCreators({
    fetchUserView: fetchUserView,
    fetchMapTrackerHistories: fetchMapTrackerHistories,
    fetchScheduleDetail: fetchScheduleDetail
}, dispatch)
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LiveTrackingPage);