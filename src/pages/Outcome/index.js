import React, { useState, useEffect } from "react";
import { Grid, IconButton, Typography, Button } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { RemoveRedEye } from '@material-ui/icons'
import AddIcon from '@material-ui/icons/Add';
import useStyles from "./styles";
import {isMobile} from 'react-device-detect';

// components
import PageTitle from "../../components/PageTitle/PageTitle";
import { bindActionCreators } from "redux";
import { useHistory } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import Status from "../../components/Status/Status";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../common/config';

function OutcomePage(props) {
    let history = useHistory();
    var classes = useStyles();
    const [isLoading, setIsLoading] = useState(false)
    const [outcomeData, setOutcomeData ] = useState({})

    useEffect(() => {
        getAllOutcome()
    }, [])

    const getAllOutcome = () => {
        setIsLoading(true)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                company_id: localStorage.getItem('company_id')
            })
        }
        fetch(`${SERVER_URL}getAllOutcome`, requestOptions)
            .then(async response => {
                const data = await response.json();
                setOutcomeData(data)
            }).finally(() => {
                setIsLoading(false)
            })
    }

    //Show notification
    const notify = (message) => toast(message);

    const actionEdit = (e, i) => {
        history.push("/app/outcome/" + i);
    }

    const handleAddOutcome = () => {
        history.push("/app/outcome/add");
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
            label: <p style={{ textTransform: 'capitalize' }}>Checkout Name</p>,
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
        <div style={!isMobile ? {padding: '6px 20px'} : {}}>
            <Grid container spacing={4} className={classes.tableWrapper}>
                <Grid container item xs={10} md={0}>
                    <Grid item container justifyContent="flex-end" xs={6}>
                        
                    </Grid>
                </Grid>
                <Grid item xs={12} md={12}>
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <div className={classes.tableContainer}>
                            <MUIDataTable
                                title={"Manage Checkout Outcome"}
                                data={outcomeData?.data || []}
                                // data={dataSource}
                                columns={columns}
                                options={options}
                            />
                        </div>
                    </MuiThemeProvider>
                </Grid>
                <Grid item xs={12} md={12}>
                    <div className="buttonWrapper">
                        <Button
                            className="buttonWrapper"
                            variant="contained"
                            size="medium"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleAddOutcome}
                            >
                                Add Outcome
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default OutcomePage
