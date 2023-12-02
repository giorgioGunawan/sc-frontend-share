import React, { useState, useEffect } from "react";
import { Grid, IconButton, Typography, Button } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { RemoveRedEye } from '@material-ui/icons'
import useStyles from "./styles";

// components
import PageTitle from "../../../components/PageTitle/PageTitle";
import { bindActionCreators } from "redux";
import { useHistory } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import Status from "../../../components/Status/Status";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../../common/config';

function VisitingReasonPage(props) {
    var classes = useStyles();
    let history = useHistory();
    const [isLoading, setIsLoading] = useState(false)
    const [visitingReasonData, setVisitingReasonData ] = useState({})

    useEffect(() => {
        getAllVisitingReason()
    }, [])

    const getAllVisitingReason = () => {
        setIsLoading(true)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                company_id: localStorage.getItem('company_id')
            })
        }
        fetch(`${SERVER_URL}getAllVisitingReason`, requestOptions)
            .then(async response => {
                const data = await response.json();
                setVisitingReasonData(data)
            }).finally(() => {
                setIsLoading(false)
            })
    }

    //Show notification
    const notify = (message) => toast(message);

    const actionEdit = (e, i) => {
        history.push("/app/visit/visiting-reason/" + i);
    }

    const getMuiTheme = () => createMuiTheme({
        overrides: {
            MUIDataTableBodyCell: {
                root: {
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    fontSize: '.8125rem',
                },
            }
        },
        MuiTableCell: {
            root: {
                borderColor: '#d3d3d3',
                fontSize: '.8125rem',
            },
            head: {
                paddingTop: "5px",
                paddingBottom: "5px",
            },
        },
    })

    const columns = [
        {
            name: "id",
            label: "ID",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "name",
            label: <p style={{ textTransform: 'capitalize' }}>Reason Name</p>,
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "include_product",
            label: <p style={{ textTransform: 'capitalize' }}>Include Product</p>,
            options: {
                filter: true,
                sort: false,
                customBodyRender: (value) => <span>{value ? 'Yes' : 'No'}</span>
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
        filter: false,
        responsive: 'scroll',
        fixedHeader: false, elevation: 0,
        rowsPerPageOptions: [5, 10, 20],
        resizableColumns: false,
        onTableChange: (action, tableState) => {
            console.log(action, tableState);
            let tmp = [];
            tableState.data.map((item) => {
                tmp.push(item.data);
            });
            console.log(tmp);
        },
        selectableRows: false

    };

    return (
        <>
            <PageTitle button={["Add New"]} category="visiting-reason" history={history} />
            <Grid container spacing={4} className={classes.tableWrapper}>
                <Grid item xs={12} md={12}>
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <div className={classes.tableContainer}>
                            <MUIDataTable
                                title={"Visiting Reason"}
                                data={visitingReasonData?.data || []}
                                // data={dataSource}
                                columns={columns}
                                options={options}
                            />
                        </div>
                    </MuiThemeProvider>

                </Grid>
            </Grid>
        </>
    );
}

export default VisitingReasonPage
