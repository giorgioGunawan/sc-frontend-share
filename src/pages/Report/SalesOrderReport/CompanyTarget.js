import React, { useState, useEffect } from "react";
import { Grid, Button, IconButton, InputBase, Tooltip, FormControlLabel, Switch, Menu, MenuItem, Divider } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
// styles
import useStyles from "./styles";

// components
import { bindActionCreators } from "redux";
import { useHistory } from "react-router-dom";
import { useSelector, connect } from "react-redux";
// import fetchSalesClientView from "../../services/salesview/SalesClientViewService";
import { SERVER_URL } from '../../../common/config';

function CompanyTarget({
  companyTarget,
  ...props
}) {
  var classes = useStyles();
  let history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);   // Table action menu
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);


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
    // props.fetchSalesClientView()
    // setDataSource(salesviewData.salesview);
  }, [])

  const columns = [
    {
      name: "full_name",
      label: "Company User",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "net_total",
      label: "Current Sales",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "sales_target",
      label: "Sales Target",
      options: {
        filter: true,
        sort: true,
      }
    },
  ];

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
      <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              title={"Company Target"}
              data={companyTarget}
              // data={salesviewData.salesview}
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
  // sales: state.sales
})

const mapDispatchToProps = dispatch => bindActionCreators({
  // fetchSalesClientView: fetchSalesClientView
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanyTarget);

