import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  CircularProgress,
  Modal,
  IconButton
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
// styles
import useStyles from "./styles";

// components
import PageTitle from "../../components/PageTitle/PageTitle";
import { bindActionCreators } from "redux";
import Status from "../../components/Status/Status";
import { useHistory } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import fetchSchedule from "../../services/schedule/ScheduleService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SERVER_URL } from "../../common/config";
import CSVReader from "react-csv-reader";
import moment from "moment";
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

function SchedulePage(props) {
  var classes = useStyles();
  let history = useHistory();
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalStyle] = React.useState(getModalStyle);
  const [selectedSchedule, setSelectedSchedule] = useState({})
  const [anchorEl, setAnchorEl] = useState(null);   // Table action menu
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const scheduleData = useSelector(state => state.schedule.schedule);
  const isLoading = useSelector(state => state.schedule.loading);
  const [filterList, setFilterList] = useState({
    limit: 10,
    offset: 0,
    keyword: "",
    user_id: null,
    predicted_time_spent: null,
    reason: null,
    isLate: null,
    present: null
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

  useEffect(() => {
    props.fetchSchedule({
      ...filterList
    });
    setDataSource(scheduleData.data);
  }, [filterList]);

  console.log("schedule data=====>", scheduleData);

  const columns = [
    {
      name: "schedule_id",
      label: "ID",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "full_name",
      label: "User Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "company_entity_name",
      label: "Company Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "client_entity_name",
      label: "Client Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "schedule_datetime",
      label: "DateTime",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "predicted_time_spent",
      label: "Predicted Time Spent",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "isLate",
      label: "Late",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Status status={value ? "yes" : "no"} />
          );
        },
      },
    },
    {
      name: "check_in_datetime",
      label: "Present",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Status status={value != "0000-00-00 00:00:00" ? "yes" : "no"} />
          );
        },
      },
    },
    {
      name: "schedule_id",
      label: "Action",
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
  ];

  /**
   * Table Action menu event
   * @param {*} event
   * @param {*} i
   */

    /// Table Action event end

    const options = {
      filterType: "dropdown",
      pagination: true,
      print: false,
      download: true,
      filter: true,
      responsive: "scroll",
      fixedHeader: false, elevation: 0,
      rowsPerPageOptions: [5, 10, 20],
      responsive: "scrollFullHeight",
      resizableColumns: false,
      selectableRows: false,
      serverSide: true,
      count: scheduleData.total,
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
        }else if(column === 'isLate'){
          setFilterList({
            ...filterList,
            offset: 0,
            isLate: list[10][0] === "yes" ? true : list[10][0] === "no" ? false : null
          })
        }else if(column === 'check_in_datetime'){
          setFilterList({
            ...filterList,
            offset: 0,
            present: list[11][0] === "yes" ? true : list[11][0] === "no" ? false : null
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
        })
      },
  
    };

  const importCSV = (data) => {
    console.log(data);
    addWithCSV(data);
  };

  const addWithCSV = (data) => {
    for (let i = 1; i < data.length - 1; i++) {
      setTimeout(() => {
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

  console.log(scheduleData, 'scheduleeeee')

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
      <PageTitle title="Schedules" data={dataSource} history={history} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              data={scheduleData.data}
              // data={dataSource}
              columns={columns}
              options={options}
            />
          </MuiThemeProvider>

        </Grid>
      </Grid>
      <Grid container spacing={1}>
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
      </Grid>
      <ScheduleModal
          open={modalIsOpen}
          onClose={handleCloseModal}
          schedule={selectedSchedule}
      />
    </>
  );
}


const mapStateToProps = state => ({
  schedule: state.schedule,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchSchedule: fetchSchedule,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SchedulePage);
