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
import fetchBranch from "../../services/branch/BranchServices";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../common/config';

function BranchesPage(props) {
  var classes = useStyles();
  let history = useHistory();
  const [dataSource, setDataSource] = useState([]);
  const branchData = useSelector(state => state.branch);

  useEffect(() => {
    props.fetchBranch();
    console.log(branchData)
    setDataSource(branchData.company);
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
      name: "branch_id",
      label: "ID",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "branch_name",
      label: "Branch Name",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "company_entity_name",
      label: "Company Name",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "branch_id",
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

  /**
   * Table Action menu event
   * @param {*} event 
   * @param {*} i 
   */

  const actionEdit = (e, i) => {
    history.push("/app/branch/" + i + "/edit");
  }

  const options = {
    selectableRows: false,
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
      <PageTitle title="Branches" button={["Add New"]} data={dataSource} category="branch" history={history} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              data={branchData.company}
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
  fetchBranch: fetchBranch
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BranchesPage);
