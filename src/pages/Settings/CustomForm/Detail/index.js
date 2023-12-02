import React, { useState, useEffect, useRef } from "react";
import { Grid, IconButton, Button, CircularProgress } from "@material-ui/core";
import MUIDataTable, {debounceSearchRender} from "mui-datatables";
import { Edit } from '@material-ui/icons'

// components
import PageTitle from "../../../../components/PageTitle/PageTitle";
import { useHistory, useParams } from "react-router-dom";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../../../common/config';
import FormModal from "./FormModal";

function CustomFormListDetailPage(props) {
    const history = useHistory()
    const { company_id } = useParams()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedData, setSelectedData] = useState(null)
    const [customUploadFields, setCustomUploadFields] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const getAllCustomUploadField = () => {
        setIsLoading(true)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                company_id
            })
        }
        fetch(`${SERVER_URL}getAllCustomUploadField`, requestOptions)
            .then(async response => {
                const data = await response.json();
                setCustomUploadFields(data)
            }).finally(() => {
                setIsLoading(false)
            })
    }

    const handleSave = (data) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch(`${SERVER_URL}updateCustomUploadField`, requestOptions)
            .then(() => {
                getAllCustomUploadField();
                setIsModalOpen(false)
            })
    }

  useEffect(() => {
    getAllCustomUploadField()
  }, [])

  const actionEdit = (e, tableMeta) => {
    setSelectedData(tableMeta.tableData[tableMeta.rowIndex])
    setIsModalOpen(true);
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
      name: "form_id",
      label: "Form ID",
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: "form_name",
      label: "Form Name",
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
                    actionEdit(e, tableMeta)
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
    count: customUploadFields.length,
    pagination: true,
    customSearchRender: debounceSearchRender(500),
    selectableRows: 'none'

  };

  return (
    <>
      <ToastContainer />
      <PageTitle title="Setting Custom Form" />
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
              title={"Setting Custom Form"}
              data={customUploadFields}
              // data={dataSource}
              columns={columns}
              options={options}
            />
          </MuiThemeProvider>
        </Grid>
      </Grid>
      <FormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedData}
        onSave={handleSave}
      />
    </>
  );
}

export default CustomFormListDetailPage