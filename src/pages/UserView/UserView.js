import React, { useState, useEffect } from "react";
import { Grid, Toolbar, IconButton, InputBase, Tooltip, Switch, Menu, MenuItem, Divider, CircularProgress } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

// styles
import useStyles from "./styles";

// components
import PageTitle from "../../components/PageTitle/PageTitle";
import { useHistory } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import BackdropLoading from "../../components/Loading/BackdropLoading";
import { bindActionCreators } from "redux";
import fetchUserView from "../../services/users/UserViewWithFilter";
import { useUserState } from "../../context/UserContext";
import CustomInput from "../../components/FormControls/CustomInput";
import debounce from "lodash.debounce";
import { Edit } from "@material-ui/icons";


function UserViewPage(props) {
  var classes = useStyles();
  let history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);   // Table action menu
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const userviewData = useSelector(state => state.userview.userview);
  const isLoading = useSelector(state => state.userview.loading);
  const [filterList, setFilterList] = useState({
    limit: 10,
    offset: 0,
    company_id: localStorage.getItem('company_id'),
    full_name: "",
    phone_number: ''
  })

  //loading image
  const [open, setOpen] = useState(false);
  let user = useUserState();

  const handleSearchName = debounce((e) => {
    const value = e.target.value
    setFilterList({
      ...filterList,
      offset: 0,
      full_name: value
    })
  }, 500)

  const handleSearchPhoneNumber = debounce((e) => {
    const value = e.target.value
    setFilterList({
      ...filterList,
      offset: 0,
      phone_number: value,
    })
  }, 500)
  
  useEffect(() => {
    props.fetchUserView({
      ...filterList
    });
    setDataSource(userviewData.data);
  }, [filterList]);

  const getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          paddingTop: "5px",
          paddingBottom: "5px",
          fontSize: '.8125rem',
          height: '30px'
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
        display: false
      }
    },
    {
      name: "full_name",
      label: <p style={{ textTransform: 'capitalize' }}>Name</p>,
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "email",
      label: <p style={{ textTransform: 'capitalize' }}>Email</p>,
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "phone_number",
      label: <p style={{ textTransform: 'capitalize' }}>Phone</p>,
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "user_id",
      label: <p style={{ textTransform: 'capitalize' }}>Edit</p>,
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
      }
    },
  ];

  const actionEdit = (e, i) => {
    setSelectedRowIndex(i)
    history.push("/app/userview/user/" + i + "/edit");
  }

  
  if (userviewData.loading) {
    return (
      <div>Loading...</div>
    )
  }

  const options = {
    filterType: 'dropdown',
    pagination: true,
    search: false,
    print: false,
    download: true,
    downloadOptions: {
      filename: 'employees_data'
    },
    filter: false,
    serverSide: true,
    count: userviewData.total,
    responsive: "scrollFullHeight",
    fixedHeader: false, elevation: 0,
    rowsPerPageOptions: [5, 10, 20],
    textLabels: {
      body: {
        noMatch: 'Loading...',
      }
    },
    resizableColumns: false,
    selectableRows: false,
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
    },
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
        <Grid item xs={6} md={3} className={classes.formContainer}>
          <CustomInput title="Employee Name" placeholder="Search Employee" handleChange={(e) => { e.persist(); handleSearchName(e) }}/>
        </Grid>
        <Grid item xs={6} md={3} className={classes.formContainer}>
          <CustomInput title="Phone Number" placeholder="Search Phone Number" handleChange={(e) => { e.persist(); handleSearchPhoneNumber(e) }}/>
        </Grid>
        <Grid item xs={12} md={12}>
            <MuiThemeProvider theme={getMuiTheme()}>
              <div className={classes.tableContainer}>
                <MUIDataTable
                  title="Manage Employees"
                  data={userviewData.data}
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
)(UserViewPage);