import React, { useState, useEffect } from "react";
import { Grid, Toolbar, IconButton, InputBase, Tooltip, Switch, FormControlLabel,  Menu, MenuItem, Divider } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Edit } from "@material-ui/icons";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../../common/config';

// styles
import useStyles from "./styles";

// components
import PageTitle from "../../../components/PageTitle/PageTitle";
import Status from "../../../components/Status/Status";
import { useHistory } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import BackdropLoading from "../../../components/Loading/BackdropLoading";
import { bindActionCreators } from "redux";
import fetchUsers from "../../../services/users/UserService";
import { useUserState } from "../../../context/UserContext";

function UserPage(props) {
  var classes = useStyles();
  let history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);   // Table action menu
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const userData = useSelector(state => state.user);

  //loading image
  const [open, setOpen] = useState(false);
  let user = useUserState();

  useEffect(() => {
    props.fetchUsers();
    console.log(userData, props.user, user);
    setDataSource(userData.data);     // from backend(redux)
    // setDataSource(data);
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
      name: "user_id",
      label: "ID",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "full_name",
      label: "Full Name",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "phone_number",
      label: "Phone Number",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "company_id",
      label: "Company ID",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "branch_id",
      label: "Branch ID",
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
      name: "isActive",
      label: "Active",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Status status={value ? "yes" : "no"} />
          );
        }
      },
    },
    {
      name: "user_id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          // console.log("==================>", value, tableMeta, updateValue)
          return (
            <>
              <IconButton
                  onClick={(e) => {
                    actionEdit(e, value)
                  }}
                >
                  <Edit style={{fontSize:'18'}}/>
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
  // const actionClick = (event, i) => {
  //   setSelectedRowIndex(i);
  //   setAnchorEl(event.currentTarget);
  // };

  // const actionClose = () => {
  //   setAnchorEl(null);
  // };

  //Edit user
  const actionEdit = (e, i) => {
    setSelectedRowIndex(i)
    console.log("=================>",selectedRowIndex, i);
    history.push("/app/usermanage/user/" + i + "/edit");
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
        const newDeleteId = userData.user[data.dataIndex].user_id
        delete_id.push(newDeleteId)
      })
      console.log("deleting Ids===> ", delete_id)
      delete_id.map((id) => {
        // row delete api call
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: id
          })
        };
        fetch(`${SERVER_URL}deleteUser`, requestOptions)
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
    onTableChange: (action, tableState) => {
      console.log(action, tableState);
      let tmp = [];
      tableState.data.map((item, i) => {
        tmp.push(item.data);
      });
      console.log(tmp);
    }
   
  };

  return (
    <>
      <PageTitle title="Users" button={["Add New"]} data={dataSource} category="user" history={history}/>
      <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              data={userData.user}
              columns={columns}
              options={options}
            />
          </MuiThemeProvider>
        </Grid>
      </Grid>
      <BackdropLoading open={open}/>
    </>
  );
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchUsers: fetchUsers
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPage);
