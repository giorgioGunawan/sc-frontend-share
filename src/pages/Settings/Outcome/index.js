import React, { useState, useEffect, useRef } from "react";
import { Grid, IconButton, Button, CircularProgress } from "@material-ui/core";
import MUIDataTable, {debounceSearchRender} from "mui-datatables";
import { Edit } from '@material-ui/icons'

// components
import PageTitle from "../../../components/PageTitle/PageTitle";
import { bindActionCreators } from "redux";
import { useHistory } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import fetchClientView from "../../../services/clientview/ClientViewWithFilterService";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../../common/config';

function OutcomePage(props) {
    const history = useHistory()
    const [companies, setCompanies] = useState([])
    const [isLoading, setIsLoading] = useState(false)
  const [filterList, setFilterList] = useState({
    limit: 10,
    offset: 0,
    company_id: null,
    keyword: ""
  })

    const getAllCompanies = () => {
        setIsLoading(true)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        }
        fetch(`${SERVER_URL}getCompany`, requestOptions)
            .then(async response => {
                const data = await response.json();
                setCompanies(data)
            }).finally(() => {
                setIsLoading(false)
            })
    }

  useEffect(() => {
    getAllCompanies()
  }, [])

  //Show notification
  const notify = (message) => toast(message);
  const actionEdit = (e, i) => {
    history.push("/app/settings/outcome/" + i);
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
      name: "company_id",
      label: "Company ID",
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: "company_entity_name",
      label: "Company Name",
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: "address",
      label: "Address",
      options: {
        filter: false,
        sort: true,
      }
    },
    {
        name: "company_id",
        label: "Action",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta, updateValue) => {
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

  const options = {
    filterType: 'dropdown',
    textLabels: {
      body: {
        noMatch: 'Loading...',
      }
    },
    print: false,
    download: true,
    filter: true,
    responsive: 'scroll',
    fixedHeader: false, elevation: 0,
    rowsPerPageOptions: [5, 10, 20],
    resizableColumns: false,
    serverSide: true,
    count: companies.length,
    pagination: true,
    customSearchRender: debounceSearchRender(500),
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

    onSearchChange: (value) => {
      setFilterList({
        ...filterList,
        offset: 0,
        keyword: value
      })
    },
    searchText: filterList.keyword,

  };

  return (
    <>
      <ToastContainer />
      <PageTitle title="Setting Outcome" />
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
        <Grid item xs={12} md={12}>
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              title={"Setting Outcome"}
              data={companies}
              // data={dataSource}
              columns={columns}
              options={options}
            />
          </MuiThemeProvider>
        </Grid>
      </Grid>
    </>
  );
}

export default OutcomePage