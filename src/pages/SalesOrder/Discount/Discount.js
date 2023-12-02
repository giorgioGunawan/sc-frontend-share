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
import fetchDiscount from "../../../services/salesorder/SalesDiscountService";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../../common/config';

function DiscountPage(props) {
  var classes = useStyles();
  let history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);   // Table action menu
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const discountData = useSelector(state => state.discount);

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
    props.fetchDiscount()
    setDataSource(discountData.discount);
  }, [])

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
      name: "min_quantity",
      label: "Min Quantity",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "max_quantity",
      label: "Max Quantity",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "amount",
      label: "Unit",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "discount_id",
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
    history.push("/app/salesorder/discount/" + i + "/edit");
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
        const newDeleteId = discountData.discount[data.dataIndex].discount_id
        delete_id.push(newDeleteId)
      })
      console.log("deleting Ids===> ", delete_id)
      delete_id.map((id) => {
        // row delete api call
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            discount_id: id
          })
        };
        fetch(`${SERVER_URL}removeDiscount`, requestOptions)
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
      {/* <PageTitle title="Discounts" button={["Add New"]} data={dataSource} category="salesorder_discount" history={history} /> */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              title={"Discounts"}
              // data={dataSource}
              data={discountData.discount}
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
  discount: state.discount
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchDiscount: fetchDiscount
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscountPage);

