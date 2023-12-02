import React, { useState, useEffect, useRef } from "react";
import { Grid, IconButton, Button, CircularProgress, Switch } from "@material-ui/core";
import MUIDataTable, {debounceSearchRender} from "mui-datatables";
import { Edit } from '@material-ui/icons'

// components
import PageTitle from "../../../components/PageTitle/PageTitle";
import { useHistory } from "react-router-dom";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../../common/config';

function AbsentFeaturePage(props) {
    const [companies, setCompanies] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const history = useHistory()

    const getAllCompanies = () => {
        setIsLoading(true)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        }
        fetch(`${SERVER_URL}getAllCompanyAbsentFeature`, requestOptions)
            .then(async response => {
                const data = await response.json();
                setCompanies(data?.payload)
            }).finally(() => {
                setIsLoading(false)
            })
    }

  useEffect(() => {
    getAllCompanies()
  }, [])

  const handleSwitchAbsent = (index, value, company_id) => {
    const temp = [...companies];
    temp[index].absent_feature = !value
    setCompanies(temp)
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            company_id,
            absent_feature: !value
        })
    }
    fetch(`${SERVER_URL}updateAbsentFeature`, requestOptions)
        .then(async response => {
            const data = await response.json();
            const temp = [...companies];
            temp[index].absent_feature = data?.payload
            setCompanies(temp)
            notify("The update was successful")
        }).catch(() => {
            const temp = [...companies];
            temp[index].absent_feature = value
            setCompanies(temp)
            notify("There was an error during the update")
        }).finally(() => {
            setIsLoading(false)
        })
  }

  const actionEdit = (e, id) => {
    history.push("/app/settings/absent-feature/" + id);
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
      name: "company_id",
      label: "Action",
      options: {
        filter: false,
        sort: true,
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
    serverSide: false,
    count: companies.length,
    pagination: true,
    customSearchRender: debounceSearchRender(500),

  };

  return (
    <>
      <ToastContainer />
      <PageTitle title="Setting Absent Feature" />
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
              title={"Setting Absent Feature"}
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

export default AbsentFeaturePage