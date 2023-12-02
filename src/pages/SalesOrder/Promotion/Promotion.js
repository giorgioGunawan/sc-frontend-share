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
import fetchPromotion from "../../../services/salesorder/SalesPromotionService";
import fetchCoupon from "../../../services/salesorder/SalesCouponService";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../../common/config';

function PromotionPage(props) {
  var classes = useStyles();
  let history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);   // Table action menu
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [dataSource, setDataSource] = useState([
    {
      promotion_id: 1,
      code: 'AAAAAA',
      type: 'PERCENT',
      amount: 10,
    },
    {
      promotion_id: 2,
      code: 'BBBBBB',
      type: 'UNIT',
      amount: 5,
    },
    {
      promotion_id: 3,
      code: 'CCCCCC',
      type: 'TOTAL',
      amount: 560,
    }
  ]);
  const promotionData = useSelector(state => state.promotion);
  const couponData = useSelector(state => state.coupon);

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
    props.fetchPromotion()
    setDataSource(promotionData.promotion);
    props.fetchCoupon()
    
  }, [])

  const columns = [
    {
      name: "type",
      label: "Type",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "amount",
      label: "Amount",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "client_entity_name",
      label: "Client",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "promotion_id",
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

  const coupon_columns = [
    {
      name: "code",
      label: "Code",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "type",
      label: "Type",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "amount",
      label: "Amount",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "start_date",
      label: "Start Date",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "end_date",
      label: "Expiration Date",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "coupon_id",
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
                  actionCouponEdit(e, value)
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
    history.push("/app/salesorder/promotion/" + i + "/edit");
  }

  const actionCouponEdit = (e, i) => {
    history.push("/app/salesorder/coupon/" + i + "/edit");
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
        const newDeleteId = promotionData.promotion[data.dataIndex].promotion_id
        delete_id.push(newDeleteId)
      })
      console.log("deleting Ids===> ", delete_id)
      delete_id.map((id) => {
        // row delete api call
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            promotion_id: id
          })
        };
        fetch(`${SERVER_URL}removePromotion`, requestOptions)
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

  const coupon_options = {
    filterType: 'dropdown',
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
        const newDeleteId = couponData.coupon[data.dataIndex].coupon_id
        delete_id.push(newDeleteId)
      })
      console.log("deleting Ids===> ", delete_id)
      delete_id.map((id) => {
        // row delete api call
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            coupon_id: id
          })
        };
        fetch(`${SERVER_URL}removeCoupon`, requestOptions)
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
      <PageTitle title="Company Loyalty" button={["Add New"]} data={dataSource} category="salesorder_promotion" history={history} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              title={"Company Loyalty"}
              // data={dataSource}
              data={promotionData.promotion}
              columns={columns}
              options={options}
            />
          </MuiThemeProvider>

        </Grid>
      </Grid>
      <Divider/>
      <PageTitle title="Coupon Loyalty" button={["Add New"]} data={dataSource} category="salesorder_coupon" history={history} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              title={"Coupon Loyalty"}
              // data={dataSource}
              data={couponData.coupon}
              columns={coupon_columns}
              options={coupon_options}
            />
          </MuiThemeProvider>

        </Grid>
      </Grid>
    </>
  );
}


const mapStateToProps = state => ({
  promotion: state.promotion,
  coupon: state.coupon
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchPromotion: fetchPromotion,
  fetchCoupon: fetchCoupon
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PromotionPage);

