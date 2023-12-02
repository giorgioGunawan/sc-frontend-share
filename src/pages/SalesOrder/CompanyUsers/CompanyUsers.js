import React, { useState, useEffect } from "react";
import { Grid, Button, IconButton, InputBase, Tooltip, FormControlLabel, Switch, Menu, MenuItem, Divider } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Edit, Settings } from '@material-ui/icons'
import CSVReader from 'react-csv-reader'
// styles
import useStyles from "./styles";

// components
import PageTitle from "../../../components/PageTitle/PageTitle";
import { bindActionCreators } from "redux";
import { useHistory } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import fetchUserView from "../../../services/users/UserViewService";
import fetchCompany from "../../../services/company/CompanyService";
import CustomCombobox from "../../../components/FormControls/CustomCombobox";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../../common/config';

function CompanyUsersPage(props) {
  var classes = useStyles();
  let history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);   // Table action menu
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const userViewData = useSelector(state => state.userview);
  const companyData = useSelector(state => state.company);

  
  const [state, setState] = useState({
    company_id: localStorage.getItem('company_id'),
    company_entity_name: 'All',
    companyIDList: localStorage.getItem('company_id').split(', '),
    userData: []
  })

  //Show notification
  const notify = (message) => toast(message);

  useEffect(() => {
    props.fetchCompany();
    console.log(companyData)
    setDataSource(companyData.company);
    getUsersbyCompanyId(state.company_id)
  }, [])

  const getUsersbyCompanyId = (company_id) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_id: company_id,
      })
    };
    fetch(`${SERVER_URL}getUserById`, requestOptions)
      .then(async response => {
        const data = await response.json();
        console.log("Response Data=============>", data)
        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        setState(state => ({
          ...state,
          userData: data
        }))
      })
      .catch(error => {
        notify('Something went wrong!\n' + error)
        console.error('There was an error!', error);
      });
  }

  const objArray2Array = (original) => {
    let tmp = [];
    if (Boolean(original)) {
      if (original.length) {
        if (state.companyIDList.length != 1) {
          tmp.push("All")
        }
        original.map(item => {
          if (state.companyIDList.includes(item?.company_id.toString())) {
            tmp.push(item?.company_entity_name);
          }
        })
        return tmp;
      }
      return [];
    } else {
      return []
    }
  }
  const companies = objArray2Array(companyData.company)

  const setCompanyIdfromCompanyName = (company_entity_name) => {
    let com_id = ''
    if (company_entity_name == "All") {
      com_id = state.companyIDList.join(', ');
      setState({
        ...state,
        company_id: com_id
      })
      getUsersbyCompanyId(com_id)
    } else {
      let object = companyData.company.filter(item => item.company_entity_name == company_entity_name)
      if (object[0] != null) {
        com_id = object[0].company_id.toString()
        setState({
          ...state,
          company_id: com_id
        })
        getUsersbyCompanyId(com_id)
      }
    }
  }

  //input fields event
  const handleChange = (e, field) => {

    let comboFields = ['company_entity_name'];
    if (comboFields.includes(field)) {
      setCompanyIdfromCompanyName(e)
      setState(prevState => ({
        ...prevState, [field]: e
      }))
    }
  }

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
      label: "User Name",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "sales_target",
      label: "Amount(Rp)",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "user_id",
      label: "Setting",
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
                <Settings style={{ fontSize: '18' }} />
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

  const actionEdit = (e, i) => {
    history.push("/app/salesorder/companyusers/" + i + "/edit");
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
    download: false,
    filter: true,
    responsive: 'scroll',
    fixedHeader: false, elevation: 0,
    rowsPerPageOptions: [5, 10, 20],
    resizableColumns: false,
    onRowsDelete: (rowsDeleted) => {

      const delete_id = []
      rowsDeleted.data.map((data) => {
        const newDeleteId = userViewData.userview[data.dataIndex].user_id
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
      <PageTitle title="Company Users" />
      <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
          <Grid container spacing={1} >
            <Grid item xs={12} md={4}>
              <CustomCombobox req={true} name="Company"
                items={companies} value={companies.length == 1 ? companies[0] : state.company_entity_name}
                handleChange={(e) => handleChange(e, 'company_entity_name')} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant={'outlined'}
                size="small"
                color="primary"
                style={{ marginTop: 30, marginLeft: 10 }}
                // startIcon={iconVar[item]}
                onClick={() => {
                  history.push("/app/salesorder/companyusers/" + state.company_id + "/" + state.company_entity_name + "/setting")
                }}
              >
                Setting
              </Button>
            </Grid>
          </Grid>

          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              // data={dataSource}
              data={state.userData}
              columns={columns}
              options={options}
            />
          </MuiThemeProvider>

        </Grid>
      </Grid>

    </>
  );
}


const mapStateToProps = state => ({
  company: state.company
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCompany: fetchCompany
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanyUsersPage);

