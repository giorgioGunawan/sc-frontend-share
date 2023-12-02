import { Box, Button, Checkbox, CircularProgress, colors, FormControl, Grid, InputLabel, ListItemText, MenuItem, Modal, OutlinedInput, Select, Tooltip } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect, useSelector } from 'react-redux'
import fetchUserView from '../../services/users/UserViewService'
import fetchMapTrackerHistories from '../../services/mapTracker/MapTrackerHistories'
import { GOOGLE_MAP_API_KEY, SERVER_URL, WEBSOCKET_MAP_TRACKER_URL } from '../../common/config'
import GoogleMapReact from 'google-map-react';
// import Marker from '../../pages/LiveTracking/components/Marker'
import Marker from './Marker'
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify'
import useWebSocket from 'react-use-websocket';
import getRandomColor from '../../utils/getRandomColor'
import { Room, CheckCircle, HourglassEmpty } from '@material-ui/icons';
import fetchScheduleDetail from '../../services/schedule/ScheduleDetailService';
import { makeStyles, withStyles } from '@material-ui/styles'
import ScheduleModal from '../../components/ScheduleModal'
import LastSeenBox from '../../components/LastSeenBox';

const DEFAULT_MAP = {
    center: {
        lat: -6.200000,
        lng: 106.816666
      },
    zoom: 12
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

const ScheduleMapView = (props) => {
    
    const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
    const [form, setForm] = useState({
        user_id: 78,
        start_date: new Date(Date.now() - 486400000), //props.start_time,
        end_date: Date.now(),//props.end_time,
        _type: 2,
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
    const [submitPressed, setSubmitPressed] = useState([])
    const [mapCenter, setMapCenter] = useState([])

    const { lastMessage, readyState, getWebSocket } = useWebSocket(WEBSOCKET_MAP_TRACKER_URL);

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
        setForm({
            ...form,
            user_id: props.user_id,
            start_date: props.start_time,
            end_date: props.end_time,
        })
        setLastSeenList([])
            const start_date = props.start_time ? moment(props.start_time).format('YYYY-MM-DD HH:mm') : null
            const end_date = props.end_time ? moment(props.end_time).format('YYYY-MM-DD HH:mm') : null
            setIsLoading(true)
            getWebSocket().close()
            setSocketUrl('')
            setTracker([])
            props.fetchScheduleDetail({
                user_id: props.user_id,
                start_date,
                end_date,
            }, (resScheduleDetail, ok) => {
            if (ok) {
                setSchedules(resScheduleDetail)
                props.fetchMapTrackerHistories({
                    user_id: props.user_id,
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

                    if (temp.length != 0 && temp[0]) {
                        setMapCenter(temp[0]);
                    }
                    
                    setHistories(temp || [])
                })
            } else {
                setSchedules([])
            }
        })
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
        setForm({
            ...form,
            user_id: 0,
            start_date: null,
            end_date: null
        })
    }, [form.tracking_type])

    useEffect(() => {
        if (props.isSubmitPressed == true && submitPressed != true) {
            setSubmitPressed(true);
            setTimeout(() => {
                handleSearch();
                setSubmitPressed(false);
            }, 3000);
        }
    })
    
    return (
        <div>
            <ToastContainer />

            <div style={{ height: "675px", width:"auto", marginTop: "24px"}} className={classes.tableWrapper}>
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
                    center={
                        mapCenter ? {
                            lat: mapCenter.lat,
                            lng: mapCenter.long
                        } : DEFAULT_MAP.center}
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

                            console.log('ggitem', item);
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
)(ScheduleMapView);