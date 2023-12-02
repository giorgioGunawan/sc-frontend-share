import React, { useState, useEffect } from "react";
import {
  Grid,
  Toolbar,
  IconButton,
  InputBase,
  Tooltip,
  FormControlLabel,
  Switch,
  Menu,
  MenuItem,
  Divider, Button, CircularProgress, Modal
} from "@material-ui/core";
import { DatePicker, DateTimePicker } from '@material-ui/pickers';
import { DatePicker as DatePickerAnt, Typography } from 'antd';
import MUIDataTable, { debounceSearchRender } from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
// styles
import useStyles from "./styles";

// components
import PageTitle from "../../components/PageTitle/PageTitle";
import Status from "../../components/Status/Status";
import { useHistory } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import fetchScheduleView from "../../services/scheduleview/ScheduleViewService";
import { bindActionCreators } from "redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SERVER_URL } from "../../common/config";
import CSVReader from "react-csv-reader";
import moment from "moment";
import fetchUserView from "../../services/users/UserViewService";
import { Parser } from "json2csv";
import FileSaver from "file-saver";
import CustomInput from "../../components/FormControls/CustomInput";
import debounce from "lodash.debounce";
import { RemoveRedEye } from '@material-ui/icons'
import ScheduleModal from "../../components/ScheduleModal";

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

function ScheduleViewPage(props) {
  var classes = useStyles();
  let history = useHistory();
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalStyle] = React.useState(getModalStyle);
  const [selectedSchedule, setSelectedSchedule] = useState({})
  const [anchorEl, setAnchorEl] = useState(null);   // Table action menu
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const scheduleviewData = useSelector(state => state.scheduleview.scheduleview);
  const userviewData = useSelector(state => state.userview.userview);
  const [dataLength, setDataLength] = useState([]);

  const isLoading = useSelector(state => state.scheduleview.loading);
  const [datePicker, setDatePicker] = useState(Date());
  const { Text } = Typography;

  const [filterList, setFilterList] = useState({
    limit: 10,
    offset: 0,
    user_id: null,
    predicted_time_spent: null,
    reason: null,
    isLate: null,
    present: null,
    start_date: null,
    end_date: null
  })

  //Show notification
  const notify = (message) => toast(message);
  const getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          paddingTop: "5px",
          paddingBottom: "5px",
          fontSize: ".8125rem",
          height:"35px",
        },
      },
    },
    MuiTableCell: {
      root: {
        borderColor: "#d3d3d3",
        fontSize: ".8125rem",
      },
    },
  });
  
  const handleCloseModal = () => {
    setModalIsOpen(false)
  }

  const handleSelectedSchedule = (e, id) => {
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
            console.log('g78', data);
            setSelectedSchedule(data)
        })
        .catch(() => {
          
        })
  }

  useEffect(() => {
    props.fetchUserView()
  }, [])

  useEffect(() => {
    console.log('g78length', scheduleviewData?.data?.length);
    if (scheduleviewData?.data?.length) {
      setDataLength(scheduleviewData?.data?.length)
    }
    setDataSource(scheduleviewData?.data);
  }, [scheduleviewData?.data])
  
  useEffect(() => {
    props.fetchScheduleView({
      ...filterList
    });
    console.log('g78total', scheduleviewData.data?.length);
    setDataSource(scheduleviewData.data);
  }, [filterList]);

  const handleSearchClient = debounce((e, search_by) => {
    const value = e.target.value
    setFilterList({
      ...filterList,
      offset: 0,
      user_id: null,
      predicted_time_spent: null,
      reason: null,
      isLate: null,
      present: null,
      client_entity_name: value
    })
  }, 500)

  const handleSearchName = debounce((e, search_by) => {
    const value = e.target.value
    setFilterList({
      ...filterList,
      offset: 0,
      user_id: null,
      predicted_time_spent: null,
      reason: null,
      isLate: null,
      present: null,
      full_name: value
    })
  }, 500)

  function formatDate(dateString) {
    // Parse the date string
    const date = new Date(dateString);
  
    // Get the hours and minutes
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    // Determine the AM/PM suffix
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    // Convert the hours to 12-hour format
    const formattedHours = hours % 12 || 12;
  
    // Pad the minutes with a leading zero if necessary
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    // Get the month and day
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
  
    // Return the formatted date string
    return `${formattedHours}:${formattedMinutes} ${ampm}, ${day} ${month} ${date.getFullYear()}`;
  }

  const columns = [
    {
      name: "schedule_id",
      label: <p style={{ textTransform: 'capitalize' }}>View</p>,
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => {
          // console.log("==================>", value, tableMeta, updateValue)
          return (
            <>
              <IconButton
                onClick={(e) => {
                  handleSelectedSchedule(e, value)
                }}
              >
                <RemoveRedEye style={{ fontSize: '18' }} />
              </IconButton>
            </>
          );
        }
      },
    },
    {
      name: "schedule_id",
      label: "ID",
      options: {
        filter: false,
        sort: true,
        display: false, // unchecked by default
      },
    },
    {
      name: "full_name",
      label: <p style={{ textTransform: 'capitalize' }}>Employee</p>,
      options: {
        filter: true,
        sort: true,
        filterOptions: {
          names: userviewData?.map?.(item => item.user_id),
          renderValue: (value) => {
            return userviewData?.find?.(item => item.user_id === value)?.full_name
          }
        },
        customFilterListOptions: {
          render: value => `Full Name: ${userviewData?.find?.(item => item.user_id === value)?.full_name}`,
        },
      }
    },
    {
      name: "client_entity_name",
      label: <p style={{ textTransform: 'capitalize' }}>Client</p>,
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "schedule_datetime",
      label: <p style={{ textTransform: 'capitalize' }}>Date Created</p>,
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          console.log('here21'+value);
          return (
            <div>
              {value != "0000-00-00 00:00:00" ? formatDate(value) : "Not created"}
            </div>
          );
        }
      },
    },    {
      name: "check_in_datetime",
      label: <p style={{ textTransform: 'capitalize' }}>Checkin</p>,
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              {value != "0000-00-00 00:00:00" ? formatDate(value) : "-"}
            </div>
          );
        }
      },
    },
    {
      name: "check_out_datetime",
      label: <p style={{ textTransform: 'capitalize' }}>Checkout</p>,
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              {value != "0000-00-00 00:00:00" ? formatDate(value) : "-"}
            </div>
          );
        }
      },
    },
    /*
    {
      name: "isLate",
      label: "Late",
      options: {
        filter: true,
        sort: true,
        filterOptions: {
          names: ["yes", "no"],
        },
        customFilterListOptions: {
          render: v => `Late: ${v}`,
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Status status={value == 1 ? "yes" : "no"} />
          );
        }
      }
    },
    */
    {
      name: "check_in_datetime",
      label: <p style={{ textTransform: 'capitalize' }}>Present</p>,
      options: {
        filter: true,
        sort: true,
        filterOptions: {
          names: ["yes", "no"],
        },
        customFilterListOptions: {
          render: v => `Present: ${v}`,
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Status status={value != "0000-00-00 00:00:00" ? "yes" : "no"} />
          );
        }
      }
    },
    

  ];

  /**
   * Table Action menu event
   * @param {*} event
   * @param {*} i
   */


  const options = {
    filterType: "dropdown",
    search: false,
    pagination: true,
    print: false,
    download: true,
    downloadOptions: {
      filename: 'schedule_data.xlsx'
    },
    filter: false,
    responsive: "scroll",
    fixedHeader: false, elevation: 0,
    rowsPerPageOptions: [5, 10, 20],
    responsive: "scrollFullHeight",
    resizableColumns: false,
    selectableRows: 'multiple',
    serverSide: true,
    count:  scheduleviewData.total,
    customSearchRender: debounceSearchRender(500),
    onTableChange: (action, tableState) => {
      console.log(action, tableState, "table change")
      switch (action) {
        case 'changePage':
          setFilterList({
            ...filterList,
            offset: tableState.page * filterList.limit
          })
          break;
        case 'changeRowsPerPage':
          setFilterList({
            ...filterList,
            limit: tableState.rowsPerPage
          })
          break;
        default:
          console.log('action not handled.');
      }
    },
    onRowsDelete: (rowsDeleted) => {

      const delete_id = []
      rowsDeleted.data.map((data) => {
        const newDeleteId = scheduleviewData.data[data.dataIndex]
        console.log('g789', newDeleteId)
        delete_id.push(newDeleteId.schedule_id)
      })

      delete_id.map((id) => {
        // row delete api call
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            schedule_id: id
          })
        };
        fetch(`${SERVER_URL}deleteSchedule`, requestOptions)
          .then(async response => {
            const data = await response.json();
            console.log("Response Data=============>", data)
            // check for error response
            if (!response.ok) {
              // get error message from body or default to response status
              const error = (data && data.message) || response.status;
              return Promise.reject(error);
            }
            return
          })
          .catch(error => {
            notify('Something went wrong!\n' + error)
            console.error('There was an error!', error);
          });
      })
    },
    onFilterChange: (column, list, type) => {
      if(column === 'full_name'){
        setFilterList({
          ...filterList,
          offset: 0,
          user_id: list[1][0]
        })
      }else if(column === 'check_in_datetime'){
        setFilterList({
          ...filterList,
          offset: 0,
          present: list?.[6]?.[0] === "yes" ? true : list?.[6]?.[0] === "no" ? false : null
        })
      // }else if(column === 'predicted_time_spent'){
      //   setFilterList({
      //     ...filterList,
      //     offset: 0,
      //     predicted_time_spent: list[4][0]
      //   })
      }
    },
    onFilterConfirm: (column, list, type) => {
      console.log(column, list, type, "confirm filterrrrr")
    },
    onSearchChange: (value) => {
      setFilterList({
        ...filterList,
        offset: 0,
        keyword: value
      })
    },
    searchText: filterList.keyword,
    // onDownload: (buildHead, buildBody, columns, data) => {
    //   const body = { company_id: localStorage.getItem('company_id') }
    //   fetch(`${SERVER_URL}getScheduleWithFilter`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(body)
    //   })
    //   .then(res => res.json())
    //   .then(res => {
    //     const fields = [];
    //     columns.map(item => {
    //       if (item.label !== "Action") {
    //         fields.push({
    //           label: item.label,
    //           value: item.name
    //         })
    //       }
    //     })
    //     const opts = { fields };
    //     try {
    //       const parser = new Parser(opts);
    //       const csv = parser.parse(res.data);

    //       const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    //       FileSaver.saveAs(csvData, 'schedule_data.csv');
    //     } catch (err) {
    //       console.error(err);
    //     }
    //   })
    //   return false;
    // }

  };

  const importCSV = (data) => {
    console.log(data);
    addWithCSV(data);
  };

  const addWithCSV = (data) => {
    for (let i = 1; i < data.length - 1; i++) {
      setTimeout(() => {
        console.log('here1'+moment(row[2]).format('YYYY-MM-DD hh:mm:ss'))
        const row = data[i];
        let saveData = {
          user_id: row[0],
          client_id: row[1],
          schedule_datetime: moment(row[2]).format('YYYY-MM-DD hh:mm:ss'),
          predicted_time_spent: row[3],
          reason: row[4],
        };
        const reqOption = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(saveData),
        };
        fetch(`${SERVER_URL}createNewSchedule`, reqOption)
          .then(async response => {
            const data = await response.json();
            console.log("Response Data=============>", data);
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
            console.error("There was an error!", error);
          });
      }, 500);
    }
  };

  const handleChange = (e, field) => {

    let start_date;
    let end_date;
    if (e !== null) {
      const date = new Date(e);

      setDatePicker(date);
      // create a new Date object with the same date as the given date object, but with time set to 00:00:00
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 1);

      // create a new Date object with the same date as the given date object, but with time set to 23:59:59
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

      start_date = startOfDay ? moment(startOfDay).format("YYYY-MM-DD HH:mm") : null
      end_date = endOfDay ? moment(endOfDay).format("YYYY-MM-DD HH:mm") : null
    } else {
      start_date= new Date(null);
      end_date = new Date() + 1;
    }

    setFilterList({
      ...filterList,
      offset: 0,
      user_id: null,
      predicted_time_spent: null,
      reason: null,
      isLate: null,
      present: null,
      start_date: start_date,
      end_date: end_date
    })
  }

  return (
    <>
      {/*<PageTitle title="Schedules" data={dataSource} history={history} />*/}
      {
        isLoading
        ?
          <div style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 10 }}>
            <CircularProgress />
          </div>
        :
          null
      }
      <Grid container spacing={4} className={classes.tableWrapper}>
        <Grid item xs={6} md={3} className={classes.formContainer}>
          <CustomInput title="Employee Name" placeholder="Search Employee Name" handleChange={(e) => { e.persist(); handleSearchName(e) }}/>
        </Grid>
        <Grid item xs={6} md={3} className={classes.formContainer}>
          <CustomInput title="Client Name" placeholder="Search Client Name" handleChange={(e) => { e.persist(); handleSearchClient(e) }}/>
        </Grid>
        <Grid item xs={6} md={3} className={classes.formContainer}>
          <div style={{display: "flex", flexDirection: "column"}}>
            <Text>Select Date</Text>
            <DatePickerAnt onChange={(e) => handleChange(e, 'date')} />
          </div>
        </Grid>
          <Grid item xs={12} md={12}>
            <MuiThemeProvider theme={getMuiTheme()}>
              <div className={classes.tableContainer}>
                <MUIDataTable
                title="Schedules"
                  data={dataSource}
                  columns={columns}
                  options={options}
                />
              </div>
            </MuiThemeProvider>
          </Grid>
      </Grid>
      {/* <Grid container spacing={1}>
        <Grid item xs={6} md={6} lg={6}></Grid>
        <Grid item xs={4} md={4} lg={4}>
          <CSVReader label="Import CSV: " onFileLoaded={(data) => importCSV(data)} />
        </Grid>
        
        <Grid item xs={2} md={2} lg={2}>
          <Button variant="outlined" color="primary" onClick={() => {
            window.location.reload();
          }}>
            See Result
          </Button>
        </Grid>
      </Grid> */}
      <ScheduleModal
          open={modalIsOpen}
          onClose={handleCloseModal}
          schedule={selectedSchedule}
      />
    </>
  );
}

const mapStateToProps = state => ({
  scheduleview: state.scheduleview,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchScheduleView: fetchScheduleView,
  fetchUserView: fetchUserView
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScheduleViewPage);