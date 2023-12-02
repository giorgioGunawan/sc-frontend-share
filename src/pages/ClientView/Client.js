import React, { useState, useEffect, useRef } from "react";
import { Grid, IconButton, Button, Switch, CircularProgress } from "@material-ui/core";
import MUIDataTable, {debounceSearchRender} from "mui-datatables";
import { Edit } from '@material-ui/icons'
import {isMobile} from 'react-device-detect';

// styles
import useStyles from "./styles";

// components
import PageTitle from "../../components/PageTitle/PageTitle";
import { bindActionCreators } from "redux";
import { useHistory } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import fetchClientView from "../../services/clientview/ClientViewWithFilterService";
import { toast, ToastContainer } from "react-toastify";
import Status from "../../components/Status/Status";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../common/config';
import fetchAllUser from "../../services/users/AllUserService";
import { Parser } from "json2csv";
import FileSaver from "file-saver";
import Tabs from "../../components/Tabs";
import CustomInput from "../../components/FormControls/CustomInput";
import debounce from 'lodash.debounce'

function ClientViewPage(props) {
  var classes = useStyles();
  let history = useHistory();
  const csvRef = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const [keyword, setKeyword] = useState('')
  const [filterList, setFilterList] = useState({
    limit: 10,
    offset: 0,
    created_by: null,
    approved: null,
    client_entity_name: "",
    created_by_name: ""
  })
  const clientViewData = useSelector(state => state.clientview.clientview);
  const userData = useSelector(state => state.allUser.user);

  const isLoading = useSelector(state => state.clientview.loading);

  useEffect(() => {
    props.fetchAllUser()
  }, [])
  

  useEffect(() => {
    setDataSource(clientViewData?.data);
  }, [clientViewData?.data])

  useEffect(() => {
    props.fetchClientView({
      ...filterList
    })
  }, [filterList])

  const handleSearchClient = debounce((e, search_by) => {
    const value = e.target.value
    setFilterList({
      ...filterList,
      offset: 0,
      created_by: null,
      approved: null,
      client_entity_name: value
    })
  }, 500)

  const handleSearchCreatedByName = debounce((e, search_by) => {
    const value = e.target.value
    setFilterList({
      ...filterList,
      offset: 0,
      created_by: null,
      approved: null,
      created_by_name: value
    })
  }, 500)

  //Show notification
  const notify = (message) => toast(message);
  const getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          paddingTop: "5px",
          paddingBottom: "5px",
          fontSize: '.8125rem',
          height:"60px",
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
      name: "approved",
      label: isMobile ? "App" : "Approved",
      options: {
        filter: true,
        sort: true,
        filterOptions: {
          names: ["yes", "no"],
        },
        customFilterListOptions: {
          render: v => `Approved: ${v}`,
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          const approvedValue = clientViewData?.data?.[tableMeta.rowIndex]?.approved;
          const index = tableMeta.rowIndex;
          return (
            <Switch checked={Number(approvedValue)} onClick={() => {
              updateClientInfo(
                clientViewData.data[index].client_id,
                clientViewData.data[index].created_by,
                approvedValue == 1? 0 : 1,
                tableMeta.rowIndex)
            }} name="approved" />
          );
        }
      }
    },
    {
      name: "client_id",
      label: "ID",
      options: {
        filter: false,
        sort: true,
        display: false, // unchecked by default
      }
    },
    {
      name: "client_entity_name",
      label: "Client",
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: "custom_field",
      label: "Custom Field",
      options: {
        filter: false,
        sort: true,
        display: isMobile ? false : true,
      }
    },
    {
      name: "address",
      label: "Address",
      options: {
        filter: false,
        sort: true,
        display: isMobile ? false : true,
      }
    },
    
    {
      name: "full_name",
      label: "Employee",
      options: {
        filter: true,
        sort: true,
        filterOptions: {
          names: userData.map(item => item.user_id),
          renderValue: (value) => {
            return userData.find(item => item.user_id === value).full_name
          }
        },
        customFilterListOptions: {
          render: value => `Created by: ${userData.find(item => item.user_id === value).full_name}`,
        },
      }
    },
    {
      name: "location",
      label: "Location",
      options: {
        filter: false,
        sort: true,
        display: isMobile ? false : true,        
      },
    },
    {
      name: "phone_number",
      label: "Phone",
      options: {
        filter: false,
        sort: true,
        display: isMobile ? false : true,
      },
    },
    {
      name: "client_id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        display: isMobile ? false : true,
        customBodyRender: (value) => {
          // console.log("==================>", value, tableMeta, updateValue)
          return (
            <>
              <IconButton
                onClick={(e) => {
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

  const actionEdit = (e, i) => {
    history.push("/app/clientview/" + i + "/edit");
  }

  const updateClientInfo = (client_id, user_id, approved, index) => {
    const oldDataSource = [...dataSource]
    const newDataSource = [...dataSource]
    newDataSource[index].approved = approved
    setDataSource(newDataSource);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: client_id,
            approved: approved ? 1 : 0,
            user_id: user_id
        })
    };
    fetch(`${SERVER_URL}updateClientApproval`, requestOptions)
        .then(async response => {
            const data = await response.json();
            notify('Successfully updated')
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }
        })
        .catch(error => {
            notify('Something went wrong!\n' + error)
            setDataSource(oldDataSource)
        });
  }

  const options = {
    filterType: 'dropdown',
    textLabels: {
      body: {
        noMatch: 'Loading...',
      }
    },
    print: false,
    download: true,
    downloadOptions: {
      filename: 'client_data'
    },
    filter: true,
    search: false,
    responsive: 'scroll',
    fixedHeader: false, elevation: 0,
    selectableRows: 'none',
    rowsPerPageOptions: [5, 10, 20],
    resizableColumns: false,
    serverSide: true,
    count: clientViewData.total,
    responsive: "scrollFullHeight",
    pagination: true,
    customSearchRender: debounceSearchRender(500),
    onRowsDelete: (rowsDeleted) => {

      const delete_id = []
      rowsDeleted.data.map((data) => {
        const newDeleteId = clientViewData.data[data.dataIndex].client_id
        delete_id.push(newDeleteId)
      })
      delete_id.map((id) => {
        // row delete api call
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: id
          })
        };
        fetch(`${SERVER_URL}deleteClient`, requestOptions)
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
      if(column === 'approved'){
        setFilterList({
          ...filterList,
          offset: 0,
          approved: list[4][0] === "yes" ? true : list[4][0] === "no" ? false : null
        })
      }else if(column === 'full_name'){
        setFilterList({
          ...filterList,
          offset: 0,
          created_by: list[5][0]
        })
      }
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
    //   let body = {}
    //   console.log('branch id',localStorage.getItem('branch_id'))
    //   const branch_id = localStorage.getItem('branch_id');
    //   if (branch_id !== "null") {
    //     body = { company_id: localStorage.getItem('company_id'), branch_id: localStorage.getItem('branch_id'), 
    //       isDirector: localStorage.getItem('isDirector')};
    //   } else {
    //     body = { company_id: localStorage.getItem('company_id'), isDirector: localStorage.getItem('isDirector')};
    //   }
      
    //   fetch(`${SERVER_URL}getClientWithFilter`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(body)
    //   })
    //   .then(res => res.json())
    //   .then(res => {
    //     console.log(columns)
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
    //       FileSaver.saveAs(csvData, 'client_data.csv');
    //     } catch (err) {
    //       console.error(err);
    //     }
    //   })
    //   return false;
    // }

  };

  return (
    <>
      <ToastContainer />
      {
        isLoading
        ?
          <div style={{top: '50%', left: '50%', zIndex: 10 }}>
            <CircularProgress />
          </div>
        :
          null
      }
      <Grid container spacing={4}>
        <Grid item xs={6} md={3} className={classes.formContainer}>
          <CustomInput title="Client Name" placeholder="Search Client Name" handleChange={(e) => { e.persist(); handleSearchClient(e) }}/>
        </Grid>
        <Grid item xs={6} md={3} className={classes.formContainer}>
          <CustomInput title="Created By" placeholder="Search Created By" handleChange={(e) => { e.persist(); handleSearchCreatedByName(e) }}/>
        </Grid>
        <Grid item xs={12} md={12}>
          <MuiThemeProvider theme={getMuiTheme()}>
            <div className={classes.tableContainer}>
              <MUIDataTable
              title="Manage Clients"
                // data={clientViewData.data}
                data={dataSource}
                columns={columns}
                options={options}
              />
            </div>
          </MuiThemeProvider>
        </Grid>
      </Grid>
      <PageTitle title="" button={["Add New"]} data={dataSource} category="clientview" history={history}/>

    </>
  );
}


const mapStateToProps = state => ({
  clientview: state.clientview,
  user: state.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchClientView: fetchClientView,
  fetchAllUser: fetchAllUser
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientViewPage);
