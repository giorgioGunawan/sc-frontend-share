import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../../common/config'

import {
  Grid,
  IconButton,
} from "@material-ui/core";
import MUIDataTable from 'mui-datatables';
import { useSelector } from "react-redux";
import { GOOGLE_MAP_API_KEY } from '../../common/config';
import Geocode from "react-geocode";
import useStyles from "./styles";
import { RemoveRedEye } from '@material-ui/icons'
import MuiTableCell from '@material-ui/core/TableCell';
import MuiTableRow from '@material-ui/core/TableRow';
import CustomInput from "../../components/FormControls/CustomInput";
import { Button, DatePicker as DatePickerAnt, Tag, Typography } from 'antd';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import debounce from "lodash.debounce";
import moment from "moment";
import FileSaver from 'file-saver';
import { Parser } from 'json2csv';

Geocode.setApiKey(GOOGLE_MAP_API_KEY);

function AbsentView() {
    var classes = useStyles();

  const [absentData, setAbsentData] = useState([]);
  const userData = useSelector(state => state.userview);
  const { Text } = Typography;
  const [datePicker, setDatePicker] = useState(Date());
  const [filterList, setFilterList] = useState({
    limit: 10,
    offset: 0,
    full_name: null,
    start_date: null,
    end_date: null
  })

  const getUserNamebyUserId = (user_id) => {
        let object = userData.userview.filter(item => item.user_id == user_id)
        if (object[0] != null) {
            return object[0].full_name
        }
    }

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${SERVER_URL}getAllAbsent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          company_id: localStorage.getItem('company_id'),
          ...filterList
        })
      });


      const res = await response.json();
      const data = await Promise.all(
        res.payload?.data?.map?.(async record => ({
          ...record,
          check_in_datetime: formatDate(record.check_in_datetime),
          check_out_datetime: formatDate(record.check_out_datetime),
          totalWorked: record.check_out_datetime ? calculateTotalWorked(record.check_in_datetime, record.check_out_datetime) :'--h --m',
          check_in_address: await getAddressByCoordinates(record.check_in_lat, record.check_in_long),
          check_out_address: 
            await getAddressByCoordinates(record.check_out_lat ?? 0, record.check_out_long ?? 0) ?? '',
          user_status: getStatus(record.check_in_datetime, record.check_out_datetime),
        }))
      );

      setAbsentData({
        ...res.payload,
        data
      });
    }

    fetchData();
  }, [filterList]);

  const calculateTotalWorked = (checkInDatetime, checkOutDatetime) => {
    const checkIn = new Date(checkInDatetime);
    const checkOut = new Date(checkOutDatetime);
    const diffInMilliseconds = checkOut - checkIn;
    const diffInMinutes = Math.floor(diffInMilliseconds / 60000); // Convert milliseconds to minutes
  
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
  
    const formattedTime = `${hours}h ${String(minutes).padStart(2, '0')}m`;
    return formattedTime;
  };

  const getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          paddingTop: "5px",
          paddingBottom: "5px",
          fontSize: ".8125rem",
          height:"35px",
          textTransform: 'lowercase',
        },
      },
      MUIDataTableHeadCell: {
        root: {
          textTransform: 'lowercase', // Remove the all caps style
        },
      },
    },
    MuiTableCell: {
      root: {
        borderColor: "#d3d3d3",
        fontSize: ".8125rem",
        textTransform: 'lowercase',
      },
    },
  });

  const handleChange = async (e, field) => {

    let start_date = null;
    let end_date = null;

    if (field == 'start_date') {
      if (e !== null) {
        const date = new Date(e);
  
        setDatePicker(date);
        // create a new Date object with the same date as the given date object, but with time set to 00:00:00
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 1);
  
        start_date = startOfDay ? moment(startOfDay).format("YYYY-MM-DD HH:mm") : null
      }

      setFilterList({
        ...filterList,
        offset: 0,
        start_date: start_date
      })
    }

    if (field == 'end_date') {
      if (e !== null) {
        const date = new Date(e);
  
        setDatePicker(date);
  
        // create a new Date object with the same date as the given date object, but with time set to 23:59:59
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
        
        end_date = endOfDay ? moment(endOfDay).format("YYYY-MM-DD HH:mm") : null
      }

      setFilterList({
        ...filterList,
        offset: 0,
        end_date: end_date
      })

      const response = await fetch(`${SERVER_URL}getAllAbsent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          company_id: localStorage.getItem('company_id'),
          ...filterList
        })
      });


      const res = await response.json();
      const data = await Promise.all(
        res.payload?.data?.map?.(async record => ({
          ...record,
          check_in_datetime: formatDate(record.check_in_datetime),
          check_out_datetime: formatDate(record.check_out_datetime),
          totalWorked: record.check_out_datetime ? calculateTotalWorked(record.check_in_datetime, record.check_out_datetime) : '--h --m',

          check_in_address: await getAddressByCoordinates(record.check_in_lat, record.check_in_long),
          check_out_address: 
            await getAddressByCoordinates(record.check_out_lat ?? 0, record.check_out_long ?? 0) ?? '',
          user_status: getStatus(record.check_in_datetime, record.check_out_datetime),
        }))
      );

      setAbsentData({
        ...res.payload,
        data
      });
    }
  }

  const columns = [
    { name: 'full_name', label: <p style={{ textTransform: 'capitalize' }}>Name</p> },
    { name: 'check_in_datetime', label: <p style={{ textTransform: 'capitalize' }}>Checkin</p> },
    { name: 'check_out_datetime', 
    label: <p style={{ textTransform: 'capitalize' }}>Checkout</p> ,
      options: {
        customBodyRender: (value, tableMeta) => {
          const checkOutDateTime = tableMeta.rowData[2];
        
          if (!checkOutDateTime) {
            return <Tag color="warning">Pending</Tag>; // Return null if check_in_datetime is not defined
          }        
          return value;
        }
      }
    },
    { name: 'totalWorked', label: <p style={{ textTransform: 'capitalize' }}>Hours</p> },
    { 
      name: 'check_in_image',
      label: <p style={{ textTransform: 'capitalize' }}>In</p> ,
      options: {
        filter: false,
        download: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const checkInDatetime = tableMeta.rowData[1];
        
          if (!checkInDatetime) {
            return null; // Return null if check_in_datetime is not defined
          }

          if( value === null ){
            return <Tag color="error">No photo</Tag>;
          }
    
          return (
            <a href={"http://109.106.255.118:4000/upload/" + value} target="_blank" rel="noopener noreferrer">
              <Button type="primary" size="small">View</Button>
            </a>
          );
        }
      }, 
    },
    { 
      name: 'check_out_image',
      label: <p style={{ textTransform: 'capitalize' }}>Out</p>,
      options: {
        filter: false,
        download: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const checkOutDateTime = tableMeta.rowData[2];
        
          if (!checkOutDateTime) {
            return <Tag color="warning">Pending</Tag>; // Return null if check_in_datetime is not defined
          }

          if( value === null ){
            return <Tag color="error">No photo</Tag>;
          }
        
          return (
            <a href={"http://109.106.255.118:4000/upload/" + value} target="_blank" rel="noopener noreferrer">
              <Button type="primary" size="small">View</Button>
            </a>
          );
        }
      }, 
    },
    {
      name: 'check_in_address',
      label: <p style={{ textTransform: 'capitalize' }}>In-Location</p>,
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => {
          return <CustomTableCell value={value} />;
        },
      },
    },
    {
      name: 'check_out_address',
      label:<p style={{ textTransform: 'capitalize' }}>Out-Location</p>,
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => {
          return <CustomTableCell value={value} />;
        },
      },
    },
    {
      name: 'overtime_notes',
      label: <p style={{ textTransform: 'capitalize' }}>Overtime</p>,
      options: {
        filter: false,
        sort: false,
      }
    }
  ];

  const options = {
    filter: true,
    selectableRows: 'none',
    responsive: 'standard',
    search: false,
    filter: false,
    print: false,
    serverSide: true,
    pagination: true,
    count:  absentData.total,
    download: true,
    downloadOptions: {
      filename: 'absent_data.xlsx'
    },
    onDownload: (buildHead, buildBody, columns, data) => {
      const body = { company_id: localStorage.getItem('company_id') }
      let notLimitedFilterList = filterList;
      notLimitedFilterList.limit = 999;

      fetch(`${SERVER_URL}getAllAbsent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: localStorage.getItem('company_id'),
          ...notLimitedFilterList
        })
      })
      .then(res => res.json())
      .then(async res => {
        const fields = [];
        columns.map(item => {
          if (item.label !== "Action" && item.download) {
            fields.push({
              label: item.label,
              value: item.name
            })
          }
        })
        const opts = { fields };
        try {
          const data = await Promise.all(res.payload.data.map( async item => {
            return {
              ...item,
              check_in_datetime: formatDate(item.check_in_datetime),
              check_out_datetime: formatDate(item.check_out_datetime),
              totalWorked: item.check_out_datetime ? calculateTotalWorked(item.check_in_datetime, item.check_out_datetime) : '--h --m',

              check_in_address: await getAddressByCoordinates(item.check_in_lat, item.check_in_long),
              check_out_address: 
                await getAddressByCoordinates(item.check_out_lat ?? 0, item.check_out_long ?? 0) ?? '',
            }
          }))

          const parser = new Parser(opts);
          const csv = parser.parse(data);

          const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          FileSaver.saveAs(csvData, 'absent_data.xlsx');
        } catch (err) {
          console.error(err);
        }
      })
      return false;
    },
    onTableChange: (action, tableState) => {
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
  };

  function TruncateText(props) {
    const [isTruncated, setIsTruncated] = useState(true);
  
    const toggleTruncate = () => {
      setIsTruncated(!isTruncated);
    };
  
    const textToShow = isTruncated
      ? props.text.slice(0, 20) + '...'
      : props.text;
  
    return (
      <span>
        {textToShow}
        {props.text.length > 20 && (
          <a style={{color: 'blue', cursor: 'pointer', textDecoration:'underline'}} onClick={toggleTruncate}>
            {isTruncated ? 'View More' : 'View Less'}
          </a>
        )}
      </span>
    );
  }
  
  function CustomTableCell(props) {
    const { value } = props;
    const [isExpanded, setIsExpanded] = useState(false);
  
    const toggleExpand = () => {
      setIsExpanded(!isExpanded);
    };
  
    return (
      <MuiTableCell style={{width:'150px', border:'none'}} {...props}>
        {typeof value === 'string' && value.length > 20 ? (
          <div>
            <TruncateText text={value} />
            {isExpanded && (
              <div>
                <br />
                {value}
              </div>
            )}
          </div>
        ) : (
          value
        )}
      </MuiTableCell>
    );
  }
  
  function CustomTableRow(props) {
    const { row, ...rest } = props;
  
    return (
      <MuiTableRow {...rest}>
        {Object.keys(row).map((key) => (
          <CustomTableCell key={key} value={row[key]} />
        ))}
      </MuiTableRow>
    );
  }

  function formatDate(dateString) {
    if (!dateString) {
      return '';
    }

    const datetime = moment(dateString);
    
    if (!datetime.isValid()) {
      return ''; // Handle invalid date strings
    }

    return datetime.format('h:mm A, D MMM YYYY');
  }

  function toTimestamp(dateTime) {
    if (!dateTime) {
      return '';
    }
    const date = new Date(dateTime);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const rawFormatDate = date.toLocaleDateString( {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const dateParts = rawFormatDate.split('/');
    let formattedDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    formattedDate = formatter.format(formattedDate);

    return `${formattedHours}:${formattedMinutes} ${ampm}, ${formattedDate}`;
  }

  function getStatus(checkInDateTime, checkOutDateTime) {
    if (!checkInDateTime) {
      return 'Belum Check In';
    } else if (!checkOutDateTime) {
      return 'Sudah Check In';
    } else {
      return 'Sudah Check Out';
    }
  }

  async function getAddressByCoordinates(lat, long) {
    if (!lat || !long) {
        return '';
    }

    const result =  await Geocode.fromLatLng(lat, long);

    let address = result?.results[0].formatted_address;

    if(address == "JL. Boulevard Barat Raya, Kelapa Gading, Komplek Plaza Pasific Blok A2/46, Gading Resort Residences, RT.18/RW.8, Klp. Gading Bar., Kec. Klp. Gading, Jkt Utara, Daerah Khusus Ibukota Jakarta 14240, Indonesia"){
      address = "Kantor APT"
    }

    return address ?? 'Address Not Found';
  }

  return (
    <div>
      <Grid container spacing={4} className={classes.tableWrapper}>
        <Grid item xs={6} md={3} className={classes.formContainer}>
          <div style={{display: "flex", flexDirection: "column"}}>
            <Text>Start Date</Text>
            <DatePickerAnt onChange={(e) => handleChange(e, 'start_date')} />
          </div>
        </Grid>
        <Grid item xs={6} md={3} className={classes.formContainer}>
          <div style={{display: "flex", flexDirection: "column"}}>
            <Text>End Date</Text>
            <DatePickerAnt onChange={(e) => handleChange(e, 'end_date')} />
          </div>
        </Grid>
          <Grid item xs={12} md={12}>
            <MuiThemeProvider theme={getMuiTheme()}>
              <div className={classes.tableContainer}>
              <MUIDataTable
                title={'Absent'}
                data={absentData?.data}
                columns={columns}
                options={options}
                />
              </div>
            </MuiThemeProvider>
          </Grid>
      </Grid>
    </div>
  );
}

export default AbsentView;