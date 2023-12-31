import React, { useState, useEffect } from "react";
import { Grid,IconButton, CircularProgress } from "@material-ui/core";
import { DatePicker as DatePickerAnt, Typography } from 'antd';
import MUIDataTable, { debounceSearchRender } from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import useStyles from "./styles";
import Status from "../../components/Status/Status";
import { useHistory } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import fetchScheduleView from "../../services/scheduleview/ScheduleViewService";
import { bindActionCreators } from "redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SERVER_URL } from "../../common/config";
import moment from "moment";
import fetchUserView from "../../services/users/UserViewService";
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

function AbsentViewPage(props) {
  var classes = useStyles();
  const [dataSource, setDataSource] = useState([]);
  const scheduleviewData = useSelector(state => state.scheduleview.scheduleview);
  const userviewData = useSelector(state => state.userview.userview);

  const isLoading = useSelector(state => state.scheduleview.loading);

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

  const handleSelectedSchedule = (e, id) => {
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
        })
        .catch(() => {
          
        })
  }

  useEffect(() => {
    props.fetchUserView()
  }, [])

  useEffect(() => {
    setDataSource(scheduleviewData?.data);
  }, [scheduleviewData?.data])
  
  useEffect(() => {
    props.fetchScheduleView({
      ...filterList
    });
    setDataSource(scheduleviewData.data);
  }, [filterList]);

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
      label: "View",
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
      label: "Employee",
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
      label: "Client",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "schedule_datetime",
      label: "Date Created",
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
      label: "Check In",
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
      label: "Check Out",
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
      name: "check_in_datetime",
      label: "Present",
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
      filename: 'schedule_data'
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

  return (
    <>
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
)(AbsentViewPage);