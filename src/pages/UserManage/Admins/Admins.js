import React, { useState, useEffect } from "react";
import { Grid, IconButton, } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

// styles
import useStyles from "./styles";

// components
import PageTitle from "../../../components/PageTitle/PageTitle";
import Status from "../../../components/Status/Status";
import { useHistory } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import BackdropLoading from "../../../components/Loading/BackdropLoading";
import { bindActionCreators } from "redux";
import fetchAdmins from "../../../services/admins/AdminService";
import { useUserState } from "../../../context/UserContext";
import { Edit } from "@material-ui/icons";
import { toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../../common/config';

function AdminPage(props) {
  let history = useHistory();
  const [dataSource, setDataSource] = useState([]);
  const adminData = useSelector(state => state.admin);

  //loading image
  const [open, setOpen] = useState(false);

  useEffect(() => {
    props.fetchAdmins();// call backend
    console.log("Admin Data === > ", adminData);
    setDataSource(adminData.admin);     // from backend(redux)
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
        }
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
      name: "sales_target",
      label: "Sales Target",
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
      name: "allow_so",
      label: "Allow Sales Order",
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
        customBodyRender: (value) => {
          return (
            <>
              <IconButton
                onClick={(e) => {
                  console.log("Edit Event===> ", value)
                  actionEdit(e, value)
                }}
              >
                <Edit style={{ fontSize: '18' }} />
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

  //Edit admin
  const actionEdit = (e, i) => {
    history.push("/app/usermanage/admin/" + i + "/edit");

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
        const newDeleteId = adminData.admin[data.dataIndex].user_id
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
      <PageTitle title="Administrators" button={["Add New"]} data={dataSource} category="admin" history={history} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              // data={dataSource}
              data={adminData.admin}
              columns={columns}
              options={options}
            />
          </MuiThemeProvider>
        </Grid>
      </Grid>
      <BackdropLoading open={open} />
    </>
  );
}

const mapStateToProps = state => ({
  admin: state.admin
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchAdmins: fetchAdmins
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminPage);
