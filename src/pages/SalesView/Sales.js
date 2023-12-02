import React, { useState, useEffect, useRef } from "react";
import { Grid, Button, IconButton, InputBase, Tooltip, FormControlLabel, Switch, Menu, MenuItem, Divider, CircularProgress } from "@material-ui/core";
import MUIDataTable, { debounceSearchRender } from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Edit } from '@material-ui/icons'
import CSVReader from 'react-csv-reader'
import { Parser } from 'json2csv';
// styles
import useStyles from "./styles";

// components
import PageTitle from "../../components/PageTitle/PageTitle";
import { bindActionCreators } from "redux";
import { useHistory } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import fetchSalesClientView from "../../services/salesview/SalesClientViewService";
import fetchUserView from "../../services/users/UserViewService";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../common/config';
import FileSaver from "file-saver";
import ExampleData from '../../assets/csv/example_salesview.csv'
import debounce from "lodash.debounce";
import CustomInput from "../../components/FormControls/CustomInput";

function SalesViewPage(props) {
  var classes = useStyles();
  let history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);   // Table action menu
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const salesviewData = useSelector(state => state.salesview.salesview);
  const userviewData = useSelector(state => state.userview.userview);
  const isLoading = useSelector(state => state.salesview.loading);
  const [isImportLoading, setIsImportLoading] = useState(false)
  const csvRef = useRef(null)

  const [filterList, setFilterList] = useState({
    limit: 10,
    offset: 0,
    client_id: null,
    user_id: null,
    client_entity_name: "",
    full_name: ""
  })


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

  useEffect(() => {
    setDataSource(salesviewData?.data);
  }, [salesviewData?.data])

  useEffect(() => {
    props.fetchSalesClientView({
      ...filterList
    })
    setDataSource(salesviewData.data);
  }, [filterList])

  const handleSearchClient = debounce((e, search_by) => {
    const value = e.target.value
    setFilterList({
      ...filterList,
      offset: 0,
      client_id: null,
      user_id: null,
      client_entity_name: value
    })
  }, 500)

  const handleSearchName = debounce((e, search_by) => {
    const value = e.target.value
    setFilterList({
      ...filterList,
      offset: 0,
      client_id: null,
      user_id: null,
      full_name: value
    })
  }, 500)

  const columns = [
    {
      name: "sales_client_id",
      label: "ID",
      options: {
        filter: false,
        sort: true,
        display: false, // unchecked by default
      }
    },
    {
      name: "full_name",
      label: "User Name",
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
          render: value => `Full Name: ${userviewData?.find?.(item => item.user_id === value).full_name}`,
        },
      }
    },
    {
      name: "client_entity_name",
      label: "Client Name",
      options: {
        filter: false,
        sort: true,
        filterType: "textField"
      }
    },
    {
      name: "sales_client_id",
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

  const actionEdit = (e, i) => {
    // console.log(dataSource[selectedRowIndex]);
    // history.push("/app/sales/" + selectedRowIndex + "/edit");
    // console.log(dataSource[i]);
    history.push("/app/salesview/" + i + "/edit");
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
    downloadOptions: {
      filename: 'sales_client_data'
    },
    filter: true,
    fixedHeader: false, elevation: 0,
    rowsPerPageOptions: [5, 10, 20],
    resizableColumns: false,
    serverSide: true,
    count: salesviewData.total,
    responsive: "scrollFullHeight",
    customSearchRender: debounceSearchRender(500),
    onRowsDelete: (rowsDeleted) => {

      const delete_id = []
      rowsDeleted.data.map((data) => {
        const newDeleteId = salesviewData.data[data.dataIndex].sales_client_id
        delete_id.push(newDeleteId)
      })
      console.log("deleting Ids===> ", delete_id)
      delete_id.map((id) => {
        // row delete api call
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sales_client_id: id
          })
        };
        fetch(`${SERVER_URL}deleteSalesClient`, requestOptions)
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
      if(column === 'full_name'){
        setFilterList({
          ...filterList,
          offset: 0,
          user_id: list[1][0]
        })
      }
      // else if(column === 'client_entity_name'){
      //   setFilterList({
      //     ...filterList,
      //     offset: 0,
      //     client_id: list[2][0]
      //   })
      // }
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
    //   fetch(`${SERVER_URL}getSalesClientWithFilter`, {
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
    //     console.log(fields, "field")
    //     const opts = { fields };
    //     try {
    //       const parser = new Parser(opts);
    //       const csv = parser.parse(res.data);

    //       const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    //       FileSaver.saveAs(csvData, 'sales_client_data.csv');
    //     } catch (err) {
    //       console.error(err);
    //     }
    //   })
    //   return false;
    // }
    
  };


  const importCSV = (data) => {
    addWithCSV(data)
  }

  const addWithCSV = (data) => {
    for (let i = 1; i < data.length - 1; i++) {
      const row = data[i];
      let saveData = {
        user_id: row[0],
        client_id: row[1],
      }
      const reqOption = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      }
      setIsImportLoading(true)
      fetch(`${SERVER_URL}addSalesClientWithCSV`, reqOption)
        .then(async response => {
          const data = await response.json();
          console.log("Response Data=============>", data)
          // check for error response
          if (!response.ok) {
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          } else if (data.client_id != null) {
            notify("This client is already exist.")
            return
          } else if (data.id != 0) {

            notify("Successfully appended");
          }
        })
        .catch(error => {
          notify('Something went wrong!\n' + error)
          console.error('There was an error!', error);
        })
        .finally(() => {
          setIsImportLoading(false)
        });
    }
    csvRef.current.value = ''
  }

  return (
    <>
      {/*<PageTitle title="Sales Clients" button={["Add New"]} data={dataSource} category="salesview" history={history} />*/}
      {
        isLoading
        ?
          <div style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 10 }}>
            <CircularProgress />
          </div>
        :
          null
      }
      <Grid container spacing={4}>
        <Grid item xs={6} md={3} className={classes.formContainer}>
          <CustomInput title="Employee Name" placeholder="Search Employee Name" handleChange={(e) => { e.persist(); handleSearchName(e) }}/>
        </Grid>
        <Grid item xs={6} md={3} className={classes.formContainer}>
          <CustomInput title="Client Name" placeholder="Search Client Name" handleChange={(e) => { e.persist(); handleSearchClient(e) }}/>
        </Grid>
        <Grid item xs={12} md={12}>
          <MuiThemeProvider theme={getMuiTheme()}>
            <div className={classes.tableContainer}>
              <MUIDataTable
                title={"Manage Employee-Client Relationships"}
                data={dataSource}
                // data={salesviewData.data}
                columns={columns}
                options={options}
              />
            </div>
          </MuiThemeProvider>

        </Grid>
      </Grid>
      <PageTitle title="" button={["Add New"]} data={dataSource} category="salesview" history={history} />
    </>
  );
}


const mapStateToProps = state => ({
  sales: state.sales
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchSalesClientView: fetchSalesClientView,
  fetchUserView: fetchUserView
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SalesViewPage);

