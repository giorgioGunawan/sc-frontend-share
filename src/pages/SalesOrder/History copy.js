import React, { useState, useEffect } from "react";
import { Grid, IconButton, Typography, Menu, MenuItem } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import MenuIcon from '@material-ui/icons/Menu';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
// styles
import useStyles from "./styles";

// components
import PageTitle from "../../components/PageTitle/PageTitle";
import { bindActionCreators } from "redux";
import { useHistory } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import fetchSalesHistory from "../../services/salesorder/SalesHistoryService";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../common/config';
import Status3 from "../../components/Status/Status3";
import Status2 from "../../components/Status/Status2";
import moment from 'moment'
import CustomDatePicker from "../../components/FormControls/CustomDatePicker";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Modal from '@material-ui/core/Modal';

function HistoryPage(props) {
  let history = useHistory();
  var classes = useStyles();
  const [dataSource, setDataSource] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);   // Table action menu
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const historyData = useSelector(state => state.saleshistory);
  console.log("sales history===============>", historyData);
  const curDate = new Date()
  const [state, setState] = useState({
    start_date: new Date(curDate.getFullYear(), curDate.getMonth(), 1),
    end_date: new Date(curDate.getFullYear(), curDate.getMonth() + 1, 0),
    inShow: false,
    outShow: false,
    uploaded_picture: '',
    user_signature: '',
    client_signature: '',
    location: '',
  })

  const handleDateChange = (date, field) => {
    setState(prevState => ({
      ...prevState, [field]: date
    }))
    if (field == 'start_date') {
      let s_date = moment(date).startOf('day').format("YYYY-MM-DD HH:mm:ss")
      let e_date = moment(state.end_date).endOf('day').format("YYYY-MM-DD HH:mm:ss")

      // getReportData(s_date, e_date, props.userview.userview)
    } else if (field == 'end_date') {
      let s_date = moment(state.start_date).startOf('day').format("YYYY-MM-DD HH:mm:ss")
      let e_date = moment(date).endOf('day').format("YYYY-MM-DD HH:mm:ss")

      // getReportData(s_date, e_date, props.userview.userview)
    }

  };
  useEffect(() => {
    props.fetchSalesHistory()
    // setDataSource(historyData.saleshistory);
  }, [])


  //Show notification
  const notify = (message) => toast(message);

  const getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          paddingTop: "5px",
          paddingBottom: "5px",
          fontSize: '.8125rem',
          height:"35px",
        },
      }
    },
    MuiTableCell: {
      root: {
        borderColor: '#d3d3d3',
        fontSize: '.8125rem',
      },
      
    },
  })
  const columns = [
    {
      name: "full_name",
      label: "User",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "client_entity_name",
      label: "Client",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "order_items",
      label: "Items",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "promotions",
      label: "Promotion",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "tax",
      label: "Tax",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "shipping_cost",
      label: "Shipping Cost",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "net_total",
      label: "Total",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "order_date",
      label: "Due Date",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "notes",
      label: "Notes",
      options: {
        filter: true,
        sort: true,
      }
    },
    // {
    //   name: "client_signature",
    //   label: "Client Signature",
    //   options: {
    //     filter: true,
    //     sort: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       console.log(value)
    //       return (
    //         <a href={`${SERVER_URL}signature/${value}`} target="_blank"> {value} </a>
    //       );
    //     }
    //   }
    // },
    // {
    //   name: "user_signature",
    //   label: "User Signature",
    //   options: {
    //     filter: true,
    //     sort: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       console.log(value)
    //       return (
    //         <a href={`${SERVER_URL}signature/${value}`} target="_blank"> {value} </a>
    //       );
    //     }
    //   }
    // },
    // {
    //   name: "upload_picture",
    //   label: "Uploaded Picture",
    //   options: {
    //     filter: true,
    //     sort: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       console.log(value)
    //       return (
    //         <a href={`${SERVER_URL}upload/${value}`} target="_blank"> {value} </a>
    //       );
    //     }
    //   }
    // },
    {
      name: "custom_field",
      label: "Custom Field",
      options: {
        filter: true,
        sort: true,
      }
    },
    // {
    //   name: "location",
    //   label: "Location",
    //   options: {
    //     filter: true,
    //     sort: true,
    //   }
    // },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Status3 status={
              value == 0 ? 'pending' : (value == 1 ? 'accept' : 'reject')
            } />
          );
        }
      }
    },
    {
      name: "order_method",
      label: "Order Method",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Status2 status={
              value
            } />
          );
        }
      }
    },
    {
      name: "order_id",
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
                  actionView(e, value)
                }}
              >
                <VisibilityIcon style={{ fontSize: '20' }} />
              </IconButton>
            </>
          );
        }
      },
    },
  ];

  const actionView = (e, i) => {

    historyData.saleshistory.filter(item => item.order_id == i).map(k => {
      if (k.order_method == 'in') {
        setState({
          ...state,
          inShow: true,
          user_signature: `${SERVER_URL}signature/${k.user_signature}`,
          client_signature: `${SERVER_URL}signature/${k.client_signature}`,
          location: k.location
        })
      } else if (k.order_method == 'out') {
        setState({
          ...state,
          outShow: true,
          uploaded_picture: `${SERVER_URL}upload/${k.upload_picture}`,
        })
      }
    }
    )

  }

  const options = {
    filterType: 'dropdown',
    textLabels: {
      body: {
        noMatch: 'Loading...',
      }
    },
    pagination: true,
    print: false,
    download: true,
    filter: true,
    responsive: 'scroll',
    fixedHeader: false, elevation: 0,
    rowsPerPageOptions: [5, 10, 20],
    resizableColumns: false,
    onRowsDelete: (rowsDeleted) => {

      const delete_id = []
      rowsDeleted.data.map((data) => {
        const newDeleteId = historyData.saleshistory[data.dataIndex].order_id
        delete_id.push(newDeleteId)
      })
      console.log("deleting Ids===> ", delete_id)
      delete_id.map((id) => {
        // row delete api call
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: id
          })
        };
        fetch(`${SERVER_URL}removeOrder`, requestOptions)
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

  };

  return (
    <>
      <PageTitle title="Orders History" data={dataSource} category="history" history={history} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
          <MuiThemeProvider theme={getMuiTheme()}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                <CustomDatePicker title="Start Date" selectedDate={state.start_date} handleChange={(e) => handleDateChange(e, 'start_date')} />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} className={classes.formContainer}>
                <CustomDatePicker title="End Date" selectedDate={state.end_date} handleChange={(e) => handleDateChange(e, 'end_date')} />
              </Grid>
            </Grid>
            <MUIDataTable
              title={"Orders History"}
              data={historyData.saleshistory}
              // data={dataSource}
              columns={columns}
              options={options}
            />
            <Modal
              open={state.inShow}
              onClose={() => {
                setState({
                  ...state,
                  inShow: false,
                  // outShow: false,
                  // uploaded_picture: '',
                  // user_signature: '',
                  // client_signature: '',
                  // location: '',
                })
              }}
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={classes.modal}
            >
              <div className={classes.paper}>
                <div style={{ flexDirection: "row", }}>
                  <Typography variant="h4" style={{ padding: 10, marginTop: 30, marginBottom: 20 }}>User Signature</Typography>
                  <img className={classes.img} src={state.user_signature} alt="No ser signature" />
                  <Typography variant="h4" style={{ padding: 10, marginTop: 20, marginBottom: 20 }}>Client Signature</Typography>
                  <img className={classes.img} src={state.client_signature} alt="No client signature" />
                  <Typography variant="h4" style={{ padding: 10, marginTop: 20, marginBottom: 20 }}>Location : {state.location}</Typography>
                </div>
              </div>
            </Modal>
            <Modal
              open={state.outShow}
              onClose={() => setState(
                {
                  ...state,
                  // inShow: false,
                  outShow: false,
                  // uploaded_picture: '',
                  // user_signature: '',
                  // client_signature: '',
                  // location: '',
                }
              )}
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={classes.modal}
            >
              <div className={classes.paper}>
                <div style={{ flexDirection: "row", }}>
                  <Typography variant="h4" style={{ padding: 10, marginTop: 30, marginBottom: 20 }}>Uploaded Picture</Typography>
                  <img className={classes.img} src={state.uploaded_picture} alt="No uploaded picture" />
                </div>
              </div>
            </Modal>

          </MuiThemeProvider>
        </Grid>
      </Grid>

    </>
  );
}


const mapStateToProps = state => ({
  saleshistory: state.saleshistory
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchSalesHistory: fetchSalesHistory
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HistoryPage);
