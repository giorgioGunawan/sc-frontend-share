import React, { useState, useEffect } from "react";
import { Grid, Button, IconButton, InputBase, Tooltip, FormControlLabel, Typography, Menu, MenuItem, Divider } from "@material-ui/core";
import CustomCombobox from "../../../components/FormControls/CustomCombobox";
import { DatePicker } from "@material-ui/pickers";
// styles
import useStyles from "./styles";

// components
import { bindActionCreators } from "redux";
import { useHistory } from "react-router-dom";
import { useSelector, connect } from "react-redux";
// import fetchSalesClientView from "../../services/salesview/SalesClientViewService";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../../common/config';
import TotalWidget from "./components/TotalWidget/TotalWidget";
import CashFlow from "./components/CashFlow/CashFlow";
import TopWidget from "./components/TopWidget/TopWidget";
import CustomDatePicker from "../../../components/FormControls/CustomDatePicker";
import CompanyTarget from './CompanyTarget'
import ItemTarget from './ItemTarget'
import fetchCompany from "../../../services/company/CompanyService";
import fetchGroup from "../../../services/salesorder/SalesGroupService";
import { PresentToAll } from "@material-ui/icons";

function TargetPage(props) {
  let history = useHistory();
  var classes = useStyles();
  const [activate, setActivate] = useState(true)
  // const [company, setCompany] = useState('Default')
  const [item, setItem] = useState('Default')
  const companyData = useSelector(state => state.company);
  const groupData = useSelector(state => state.group);
  const curDate = new Date()
  const [state, setState] = useState({
    top3Data: [],
    graphData: [],
    // date: curDate,
    start_date: new Date(curDate.getFullYear(), curDate.getMonth(), 1),
    end_date: curDate,
    company_id: localStorage.getItem('company_id'),
    company_entity_name: 'All',
    companyIDList: localStorage.getItem('company_id').split(', '),
    item_id: '0',
    item_name: 'All',
    category: 'Amount',
    sales_target: '',
    current_total_sales: '',
    companyTarget: [],
    itemTarget: [],
  })
  const categoryList = [
    'Amount',
    'Unit'
  ]
  useEffect(() => {
    props.fetchCompany();
    console.log(companyData)
    props.fetchGroup()
    console.log(groupData)
    if (activate) {
      getSalesTargetbyCompanyId(state.company_id)
      getCurrentSalesbyCompanyID(state.company_id, state.start_date, state.end_date)
      getUsersTargetbyCompanyID(state.company_id, state.start_date, state.end_date)
      setState(prevState => ({
        ...prevState,
        category: "Amount",
      }))
      for (let i = 0; i < curDate.getMonth() + 1; i++) {

        let s_date1 = new Date(curDate.getFullYear(), i, 1)
        let e_date1 = new Date(curDate.getFullYear(), i + 1, 0)
        getGraphData(state.company_id, s_date1, e_date1)
      }
    } else {
      getCategorySalesTarget(state.item_id)
    }

  }, [])

  const getCompanyList = (original) => {
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

  const getItemList = (original) => {
    let tmp = [];
    if (Boolean(original)) {
      if (original.length) {
        if (original.length != 1) {
          tmp.push("All")
        }
        original.map(item => {
          tmp.push(item?.category_name);
        })
        return tmp;
      }
      return [];
    } else {
      return []
    }
  }

  const companyList = getCompanyList(companyData.company)

  const itemList = getItemList(groupData.group)

  const setCompanyIdfromCompanyName = (company_entity_name) => {
    let com_id = ''
    if (company_entity_name == "All") {
      com_id = state.companyIDList.join(', ');
      setState((prevState) => ({
        ...prevState,
        company_id: com_id,
        category: "Amount",
      }))
      state.graphData = []

      getSalesTargetbyCompanyId(com_id)
      getCurrentSalesbyCompanyID(com_id, state.start_date, state.end_date)
      getUsersTargetbyCompanyID(com_id, state.start_date, state.end_date)
      for (let i = 0; i < state.end_date.getMonth() + 1; i++) {

        let s_date1 = new Date(state.end_date.getFullYear(), i, 1)
        let e_date1 = new Date(state.end_date.getFullYear(), i + 1, 0)
        getGraphData(com_id, s_date1, e_date1)
      }
    } else {
      let object = companyData.company.filter(item => item.company_entity_name == company_entity_name)
      if (object[0] != null) {
        com_id = object[0].company_id.toString()
        setState((prevState) => ({
          ...prevState,
          company_id: com_id,
          category: "Amount",
        }))
        state.graphData = []
        getSalesTargetbyCompanyId(com_id)
        getCurrentSalesbyCompanyID(com_id, state.start_date, state.end_date)
        getUsersTargetbyCompanyID(com_id, state.start_date, state.end_date)

        for (let i = 0; i < state.end_date.getMonth() + 1; i++) {

          let s_date1 = new Date(state.end_date.getFullYear(), i, 1)
          let e_date1 = new Date(state.end_date.getFullYear(), i + 1, 0)
          getGraphData(com_id, s_date1, e_date1)
        }
      }
    }
  }

  const getSalesTargetbyCompanyId = async (company_id) => {
    setTimeout(() => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: company_id
        })
      };
      fetch(`${SERVER_URL}getSalesTargetbyCompanyID`, requestOptions)
        .then(async response => {
          const data = await response.json();
          console.log("Response Data=============>", data)
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          setState((prevState) => ({
            ...prevState,
            sales_target: data.sales_target
          }))

        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }, 500)
  }

  const getCurrentSalesbyCompanyID = async (company_id, start_date, end_date) => {
    setTimeout(() => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: company_id,
          start_date: start_date,
          end_date: end_date
        })
      };
      fetch(`${SERVER_URL}getCurrentSalesbyCompanyID`, requestOptions)
        .then(async response => {
          const data = await response.json();
          console.log("Response Data=============>", data)
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          setState((prevState) => ({
            ...prevState,
            current_total_sales: data.current_total
          }))

        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }, 500)
  }

  const getCurrentSalesbyCategoryID = async (category_id, start_date, end_date) => {
    setTimeout(() => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: category_id,
          start_date: start_date,
          end_date: end_date,
          type: state.category
        })
      };
      fetch(`${SERVER_URL}getCurrentSalesbyCategoryID`, requestOptions)
        .then(async response => {
          const data = await response.json();
          console.log("Response Data=============>", data)
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          setState((prevState) => ({
            ...prevState,
            current_total_sales: data.quantity
          }))

        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }, 500)
  }

  const getUsersTargetbyCompanyID = async (company_id, start_date, end_date) => {
    setTimeout(() => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: company_id,
          start_date: start_date,
          end_date: end_date
        })
      };
      fetch(`${SERVER_URL}getUsersTargetbyCompanyID`, requestOptions)
        .then(async response => {
          const data = await response.json();
          console.log("Response Data=============>", data)
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          setState((prevState) => ({
            ...prevState,
            companyTarget: [...data],
            // groupData: [...[]],
            top3Data: data.length > 3 ? data.slice(0, 3) : data
          }))

        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }, 500)
  }

  const getGraphData = async (company_id, start_date, end_date) => {
    setTimeout(() => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: company_id,
          start_date: start_date,
          end_date: end_date
        })
      };
      fetch(`${SERVER_URL}getCurrentSalesbyCompanyID`, requestOptions)
        .then(async response => {
          const data = await response.json();

          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          console.log("Data==========>", data)
          let tmp = state.graphData
          tmp.push(data.current_total)
          setState((prevState) => ({
            ...prevState,
            graphData: [...tmp]
          }))
          // state.graphData.push(data.current_total)

        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }, 500)
  }

  const getCategorySalesTarget = (item_id) => {
    setTimeout(() => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: item_id,
          type: state.category
        })
      };
      fetch(`${SERVER_URL}getCategorySalesTarget`, requestOptions)
        .then(async response => {
          const data = await response.json();
          console.log("Response Data=============>", data)
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          setState((prevState) => ({
            ...prevState,
            sales_target: data.sales_target
          }))

        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }, 500)
  }

  const getItemCategoryTarget = () => {
    setTimeout(() => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_date: state.start_date,
          end_date: state.end_date,
          type: state.category
        })
      };
      fetch(`${SERVER_URL}getItemCategoryTarget`, requestOptions)
        .then(async response => {
          const data = await response.json();
          console.log("Item Target Data=============>", data)
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          setState((prevState) => ({
            ...prevState,
            itemTarget: [...data],
            top3Data: data.length > 3 ? data.slice(0, 3) : data
          }))

        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }, 500)
  }

  const setItemIdfromItemName = (item_name) => {
    let item_id = ''
    if (item_name == "All") {
      item_id = '0'
      setState((state) => ({
        ...state,
        item_id: item_id
      }))
      getCategorySalesTarget(item_id)
      getCurrentSalesbyCategoryID(item_id, state.start_date, state.end_date)
    } else {
      let object = groupData.group.filter(item => item.category_name == item_name)
      console.log("object====>", object)
      if (object[0] != null) {
        item_id = object[0].category_id
        console.log("Item ID====>", item_id)
        setState(state => ({
          ...state,
          item_id: item_id
        }))
        getCategorySalesTarget(item_id)
        getCurrentSalesbyCategoryID(item_id, state.start_date, state.end_date)
      }
    }
  }

  const handleCompanyChange = (e, field) => {
    if (field == 'company_entity_name') {
      setCompanyIdfromCompanyName(e)
      setState(prevState => ({
        ...prevState, [field]: e
      }))
    }
  }

  const handleItemChange = (e, field) => {
    if (field == 'item') {
      setItemIdfromItemName(e)
      setState(prevState => ({
        ...prevState, item_name: e
      }))
    }
  }

  const handleDateChange = async (date, field) => {

    let s_date = new Date(curDate.getFullYear(), curDate.getMonth(), 1)
    let e_date = date
    setState(prevState => ({
      ...prevState,
      start_date: s_date,
      end_date: e_date,
    }))
    state.start_date = s_date
    state.end_date = e_date

    if (activate) {
      getUsersTargetbyCompanyID(state.company_id, s_date, e_date)

      state.graphData = []
      for (let i = 0; i < date.getMonth() + 1; i++) {

        let s_date1 = new Date(date.getFullYear(), i, 1)
        let e_date1 = new Date(date.getFullYear(), i + 1, 0)
        getGraphData(state.company_id, s_date1, e_date1)

      }
    } else {
      getCurrentSalesbyCategoryID(state.item_id, s_date, e_date)
      getItemCategoryTarget()
    }

  };

  const handleCategoryChange = (category, field) => {
    setState(prevState => ({
      ...prevState,
      [field]: category,
    }))
    state.category = category

    if (activate == false) {
      getCategorySalesTarget(state.item_id)
      getCurrentSalesbyCategoryID(state.item_id, state.start_date, state.end_date)
      getItemCategoryTarget()
    }

  };

  return (
    <>
      <div>
        <Grid container spacing={1} >
          <Grid item
            lg={3}
            md={3}
            sm={3}
            xs={12}>
            <Typography variant="h3" size="sm" color="initial" weight="bold">
              Sales Order Report
            </Typography>
          </Grid>
          <Grid item
            lg={6}
            md={6}
            sm={6}
            xs={12}>
          </Grid>
          <Grid item
            lg={3}
            md={3}
            sm={3}
            xs={12}
            style={{ display: 'flex' }}
          >
            <Grid item>
              <Button
                variant={!activate ? "outlined" : "contained"}
                size="large"
                color="primary"
                style={{ margin: 5 }}
                // startIcon={iconVar[item]}
                onClick={() => {
                  setActivate(true);
                  getSalesTargetbyCompanyId(state.company_id)
                  getCurrentSalesbyCompanyID(state.company_id, state.start_date, state.end_date)
                  getUsersTargetbyCompanyID(state.company_id, state.start_date, state.end_date)
                  setState(prevState => ({
                    ...prevState,
                    category: "Amount",
                    end_date: curDate
                  }))
                  state.graphData = []
                  for (let i = 0; i < curDate.getMonth() + 1; i++) {
                    let s_date1 = new Date(curDate.getFullYear(), i, 1)
                    let e_date1 = new Date(curDate.getFullYear(), i + 1, 0)
                    getGraphData(state.company_id, s_date1, e_date1)
                  }

                }}
              >
                Company
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={activate ? "outlined" : "contained"}
                size="large"
                color="primary"
                style={{ margin: 5 }}
                // startIcon={iconVar[item]}
                onClick={() => {
                  setActivate(false);
                  getCategorySalesTarget(state.item_id)
                  getCurrentSalesbyCategoryID(state.item_id, state.start_date, state.end_date)
                  getItemCategoryTarget()
                  state.graphData = []
                  setState(prevState => ({
                    ...prevState,
                    category: "Amount",
                    end_date: curDate
                  }))
                }}
              >
                Item
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div>
        <Grid container spacing={1} >
          <Grid item
            lg={4}
            md={4}
            sm={4}
            xs={12}>
            {
              activate ? <CustomCombobox req={true} name="Company"
                items={companyList} value={state.company_entity_name}
                handleChange={(e) => handleCompanyChange(e, 'company_entity_name')}
              /> : <CustomCombobox req={true} name="Item"
                items={itemList} value={state.item_name}
                handleChange={(e) => handleItemChange(e, 'item')}
                />
            }

          </Grid>

          <Grid item xs={12} sm={4} md={4} lg={4}>
            <DatePicker className={classes.formControl}
              required
              variant="inline"
              animateYearScrolling
              autoOk
              views={["year", "month"]}
              clearable='true'
              label={"Date"}
              value={state.end_date}
              onChange={(e) => handleDateChange(e, 'end_date')}
            />
          </Grid>

          <Grid item
            lg={4}
            md={4}
            sm={4}
            xs={12}
          >
            <CustomCombobox req={true} name="Category"
              items={activate ? ["Amount"] : categoryList} value={state.category}
              handleChange={(e) => handleCategoryChange(e, 'category')}
            />
          </Grid>
        </Grid>
      </div>
      <Grid container spacing={8}>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <TotalWidget
            title="Current Total Sales"
            current_total_sales={state.category == "Amount" ? "Rp " + state.current_total_sales : state.current_total_sales + " Unit"}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <TotalWidget
            title="Sales Target"
            sales_target={state.category == "Amount" ? "Rp " + state.sales_target : state.sales_target + " Unit"}
          />
        </Grid>
      </Grid>
      <Grid container spacing={8}>
        {activate ? <Grid item lg={6} md={6} sm={6} xs={12}>
          <CashFlow
            title="Amount"
            data={{
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].slice(0, state.graphData.length),
              datasets: [
                {
                  label: 'Sales Target',
                  fill: false,
                  lineTension: 0.3,
                  backgroundColor: '#00A3EE',
                  borderColor: '#00A3EE',
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: '#0198C9',
                  pointBackgroundColor: '#fff',
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: '#0198C9',
                  pointHoverBorderColor: 'rgba(220,220,220,1)',
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: state.graphData
                },
              ]
            }}
          ></CashFlow>
        </Grid> : null}
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <TopWidget
            data={state.top3Data}
            title={activate ? "Sales LeaderBoard" : "Top Categories"}
            type={state.category}
          >
          </TopWidget>
        </Grid>
      </Grid>
      {
        activate ? <CompanyTarget companyTarget={state.companyTarget} /> : <ItemTarget itemTarget={state.itemTarget} type={state.category} />
      }



    </>
  );
}


const mapStateToProps = state => ({
  company: state.company,
  group: state.group
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCompany: fetchCompany,
  fetchGroup: fetchGroup
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TargetPage);

