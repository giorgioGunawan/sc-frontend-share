import React, { useState, useEffect } from "react";
import { Grid, Button, IconButton, InputBase, Tooltip, FormControlLabel, Switch, Menu, MenuItem, Divider } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Edit } from '@material-ui/icons'
import CSVReader from 'react-csv-reader'
// styles
import useStyles from "./styles";

// components
import PageTitle from "../../../components/PageTitle/PageTitle";
import { bindActionCreators } from "redux";
import { useHistory } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import fetchSalesItem from "../../../services/salesorder/SalesItemService";
import CustomCombobox from "../../../components/FormControls/CustomCombobox";
import fetchCompany from "../../../services/company/CompanyService";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../../common/config';

function ItemPage(props) {
  var classes = useStyles();
  let history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);   // Table action menu
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const companyData = useSelector(state => state.company);

  const [state, setState] = useState({
    company_id: localStorage.getItem('company_id'),
    company_entity_name: 'All',
    companyIDList: localStorage.getItem('company_id').split(', '),
    itemData: []
  })

  useEffect(() => {
    props.fetchCompany();
    console.log(companyData)
    setDataSource(companyData.company);
    getItemsbyCompanyId(state.company_id)
  }, [])

  const getItemsbyCompanyId = (company_id) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_id: company_id,
      })
    };
    fetch(`${SERVER_URL}getItemsbyCompanyId`, requestOptions)
      .then(async response => {
        const data = await response.json();
        console.log("Response Data=============>", data)
        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        setState(state => ({
          ...state,
          itemData: data
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
      getItemsbyCompanyId(com_id)
    } else {
      let object = companyData.company.filter(item => item.company_entity_name == company_entity_name)
      if (object[0] != null) {
        com_id = object[0].company_id.toString()
        setState({
          ...state,
          company_id: com_id
        })
        getItemsbyCompanyId(com_id)
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
    } else {
      const { name, value } = e.target;
      setState(prevState => ({
        ...prevState, [field]: value
      }))
    }
  }

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
      name: "item_name",
      label: "Item Name",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "company_entity_name",
      label: "Company",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "category_name",
      label: "Category",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "unit_price",
      label: "Unit Price",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "unit",
      label: "Unit",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "tag",
      label: "Tag",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "item_id",
      label: "Edit",
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
    history.push("/app/salesorder/item/" + i + "/edit");
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
        const newDeleteId = state.itemData.salesitem[data.dataIndex].order_id
        delete_id.push(newDeleteId)
      })
      console.log("deleting Ids===> ", delete_id)
      delete_id.map((id) => {
        // row delete api call
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            item_id: id
          })
        };
        fetch(`${SERVER_URL}removeItem`, requestOptions)
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

  const importCSV = (data) => {
    console.log(data)
    addWithCSV(data)
  }

  const addWithCSV = (data) => {
    for (let i = 1; i < data.length - 1; i++) {
      const row = data[i];
      let saveData = {
        item_name: row[0],
        category_id: row[1],
        company_id: row[2],
        unit_price: row[3],
        unit: row[4],
      }
      const reqOption = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      }
      setTimeout(
        fetch(`${SERVER_URL}createItem`, reqOption)
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
        }), 100
      )
      
    }
  }

  return (
    <>
      <PageTitle title="Items Database" button={["Add New"]} data={dataSource} category="salesorder_item" history={history} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
          <Grid item xs={12} md={4}>
            <CustomCombobox req={true} name="Company"
              items={companies} value={companies.length == 1 ? companies[0] : state.company_entity_name}
              handleChange={(e) => handleChange(e, 'company_entity_name')} />
          </Grid>
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              title={"Items Database"}
              // data={dataSource}
              data={state.itemData}
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
          <Button variant="outlined" color="primary" onClick={() => { window.location.reload() }}>
            See Result
          </Button>
        </Grid>
      </Grid>
    </>
  );
}


const mapStateToProps = state => ({
  salesitem: state.salesitem,
  company: state.company
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchSalesItem: fetchSalesItem,
  fetchCompany: fetchCompany
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemPage);

