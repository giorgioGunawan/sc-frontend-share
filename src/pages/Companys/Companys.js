import React, { useState, useEffect } from "react";
import { Grid, Toolbar, IconButton, InputBase, Tooltip, Switch, FormControlLabel, Menu, MenuItem, Divider } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { Edit } from "@material-ui/icons";

// styles
import useStyles from "./styles";

// components
import { bindActionCreators } from "redux";
import PageTitle from "../../components/PageTitle/PageTitle";
import Status from "../../components/Status/Status";
import { useHistory } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import fetchCompany from "../../services/company/CompanyService";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../common/config';

function CompanysPage(props) {
  var classes = useStyles();
  let history = useHistory();
  const [dataSource, setDataSource] = useState([]);
  const companyData = useSelector(state => state.company);

  useEffect(() => {
    props.fetchCompany();
    console.log(companyData)
    setDataSource(companyData.company);
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
      name: "company_id",
      label: "ID",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "company_entity_name",
      label: "Entity Name",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "company_owner_name",
      label: "Owner Name",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "address",
      label: "Address",
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
      name: "time_limit_per_schedule",
      label: "Time Limit",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "late_policy",
      label: "Late Policy",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "min_schedule_time",
      label: "Min Time",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "max_schedule_time",
      label: "Max Time",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "notes",
      label: "Notes",
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
      name: "upload",
      label: "Upload",
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
      name: "company_info",
      label: "Company Information",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value != null) {
            return (
              <>
                <ul>
                  {
                    value.split(', ').map((item, index) => {
                      return (
                        <li>
                          <a key={index} href={`${SERVER_URL}pdf/${item}`} target="_blank">{item}</a>
                        </li>

                      )
                    })
                  }
                </ul>
              </>
            )
          } else {
            return <></>
          }
        }
      },
    },
    {
      name: "company_id",
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
    console.log("====", dataSource[i]);
    history.push("/app/company/" + i + "/edit");
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
        const newDeleteId = companyData.company[data.dataIndex].company_id
        delete_id.push(newDeleteId)
      })
      console.log("deleting Ids===> ", delete_id)
      delete_id.map((id) => {
        // row delete api call
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company_id: id
          })
        };
        fetch(`${SERVER_URL}deleteCompany`, requestOptions)
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
      <PageTitle title="Companies" button={["Add New"]} data={dataSource} category="company" history={history} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              data={companyData.company}
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


const mapStateToProps = state => ({
  company: state.company
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCompany: fetchCompany
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanysPage);
