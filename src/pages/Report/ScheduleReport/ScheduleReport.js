import React, { useState, useEffect } from "react";
import { Grid, Toolbar, IconButton, InputBase, Tooltip, Switch, Menu, MenuItem, Divider } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles'
// styles
import useStyles from "./styles";

// components
import PageTitle from "../../../components/PageTitle/PageTitle";
import { useHistory } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import BackdropLoading from "../../../components/Loading/BackdropLoading";
import { bindActionCreators } from "redux";
import fetchUserView from "../../../services/users/UserViewService";
import { useUserState } from "../../../context/UserContext";
import moment from 'moment'
import { SERVER_URL } from '../../../common/config';
import CustomDatePicker from "../../../components/FormControls/CustomDatePicker";

function ScheduleReportPage(props) {
  var classes = useStyles();
  let history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);   // Table action menu
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const userviewData = useSelector(state => state.userview);


  //loading image
  const [open, setOpen] = useState(false);
  let user = useUserState();
  const [report, setReport] = useState([])
  const curDate = new Date()
  const [state, setState] = useState({

    start_date: new Date(curDate.getFullYear(), curDate.getMonth(), 1),
    end_date: new Date(curDate.getFullYear(), curDate.getMonth() + 1, 0),

  })
  useEffect(() => {
    props.fetchUserView();
    // setDataSource(userviewData.userview);     // from backend(redux)
    // setDataSource(data);

  }, [])

  useEffect(() => {
    if (!props.userview.loading && props.userview.userview.length > 0) {
      setDataSource(userviewData.userview.userview);     // from backend(redux)
      let start_date = moment(firstDay).startOf('day').format("YYYY-MM-DD HH:mm:ss")
      let end_date = moment(lastDay).endOf('day').format("YYYY-MM-DD HH:mm:ss")
      console.log(moment(firstDay).startOf('day').format("YYYY-MM-DD HH:mm:ss"), moment(lastDay).endOf('day').format("YYYY-MM-DD HH:mm:ss"))

      getReportData(start_date, end_date, props.userview.userview)
    }
  }, [props.userview]);

  const getMuiTheme = () => createTheme({
    components: {
      MuiTableCell: {
        styleOverrides:{ root: {
          padding: '8px',
          backgroundColor: '#CDCAC6',
        }}
      },
      MuiToolbar: {
        styleOverrides:{regular: {
          minHeight: '8px',
        }}
      }
    },
    palette: {
      primary: {
        main: "#006400"
      },
      secondary: {
        main: "#ffa500"
      }
    },
  })

  const columns = [
    {
      name: "full_name",
      label: "Sales Name",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "schedule_number",
      label: "No of Schedules",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "success",
      label: "Success",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "percentage",
      label: "Success Percentage (%)",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "new_client",
      label: "Clients Added",
      options: {
        filter: true,
        sort: true,
        display: false // hide this column by default
      }
    },
  ];

  const options = {
    filterType: 'dropdown',
    textLabels: {
      body: {
        noMatch: 'Loading...',
      }
    },
    textLabels: {
      body: {
        noMatch: 'Loading...',
      }
    },
    pagination: true,
    print: false,
    download: true,
    filter: true,
    responsive: "scrollFullHeight",
    fixedHeader: false, elevation: 0,
    rowsPerPageOptions: [5, 10, 20],
    resizableColumns: false,
    selectableRows: false,
    onTableChange: (action, tableState) => {
      console.log(action, tableState);
      let tmp = [];
      tableState.data.map((item, i) => {
        tmp.push(item.data);
      });
      console.log(tmp);
    },
    onRowsDelete: (rowsDeleted) => {

    },
  };

  var reportData = []
  const getReportData = async (start_date, end_date, userviewData0) => {
    reportData = []
    for (let item of userviewData0) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: item.user_id,
          start_date: start_date,
          end_date: end_date
        })
      };
      try {
        let response = await fetch(`${SERVER_URL}getReport`, requestOptions);
        const data = await response.json();
        reportData.push({
          full_name: item.full_name,
          schedule_number: data.schedule_number,
          success: data.success,
          new_client: data.new_client,
          percentage: data.percentage.toFixed(1),
        })
      } catch (err) {
      }
    }
    console.log('################### ', reportData)
    setReport(reportData)
  }

  console.log('***&&&&&&&&&&&&&& ', props.userview.userview)

  console.log('state ^^^^^^^^^^^ ', report)

  if (props.userview.loading) {
    return (
      <div>Loading...</div>
    )
  } else {
    var date = new Date();

    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  }

  const handleDateChange = (date, field) => {
    setState(prevState => ({
      ...prevState, [field]: date
    }))
    if (field == 'start_date') {
      let s_date = moment(date).startOf('day').format("YYYY-MM-DD HH:mm:ss")
      let e_date = moment(state.end_date).endOf('day').format("YYYY-MM-DD HH:mm:ss")

      getReportData(s_date, e_date, props.userview.userview)
    } else if (field == 'end_date') {
      let s_date = moment(state.start_date).startOf('day').format("YYYY-MM-DD HH:mm:ss")
      let e_date = moment(date).endOf('day').format("YYYY-MM-DD HH:mm:ss")

      getReportData(s_date, e_date, props.userview.userview)
    }

  };

  return (
    <>
      {/*<PageTitle title="Schedules Report" data={dataSource} />*/}
      <Grid container spacing={1} className={classes.tableWrapper}>
        <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
          <CustomDatePicker title="Start Date" selectedDate={state.start_date} handleChange={(e) => handleDateChange(e, 'start_date')} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
          <CustomDatePicker title="End Date" selectedDate={state.end_date} handleChange={(e) => handleDateChange(e, 'end_date')} />
        </Grid>
      </Grid>
      <Grid container spacing={4} className={classes.tableWrapper}>
        <Grid item xs={12} md={12}>
          <MuiThemeProvider theme={getMuiTheme()}>
            <div className={classes.tableContainer}>
              <MUIDataTable
              title="Employee Visits Report"
                data={report}
                columns={columns}
                options={options}
              />
            </div>
          </MuiThemeProvider>
        </Grid>
      </Grid>
      <BackdropLoading open={open} />
    </>
  );
}

const mapStateToProps = state => ({
  userview: state.userview
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchUserView: fetchUserView
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScheduleReportPage);
