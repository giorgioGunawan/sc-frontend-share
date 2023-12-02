import React, { useState, useEffect } from "react";
import { Grid, IconButton } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import useStyles from "../styles";

// components
import PageTitle from "../../../components/PageTitle/PageTitle";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../../common/config';
import { useMemo } from "react";
import { PlayArrow } from "@material-ui/icons";

function ListOutcome(props) {
    var classes = useStyles();
    let history = useHistory();
    const [isLoading, setIsLoading] = useState(false)
    const [outcomeData, setOutcomeData ] = useState({})

    const filter = useMemo(() => {
        return props.filter
    }, [props.filter])

    useEffect(() => {
        getAllOutcome()
    }, [filter])

    const getAllOutcome = () => {
        setIsLoading(true)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                company_id: localStorage.getItem('company_id'),
                ...filter
            })
        }
        fetch(`${SERVER_URL}getOutcomeReport`, requestOptions)
            .then(async response => {
                const data = await response.json();
                setOutcomeData(data)
            }).finally(() => {
                setIsLoading(false)
            })
    }

    const handleRedirectToDetail = (_, id) => {
        props.onClickDetail(id)
    }

    //Show notification
    const notify = (message) => toast(message);

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
                display: false,
            }
        },
        {
            name: "name",
            label: "Outcome",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "total_schedule",
            label: "Count",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "id",
            label: "Action",
            options: {
              filter: false,
              sort: false,
              customBodyRender: (value) => {
                // console.log("==================>", value, tableMeta, updateValue)
                return (
                  <>
                    <IconButton
                      onClick={(e) => {
                        handleRedirectToDetail(e, value)
                      }}
                    >
                      <PlayArrow style={{ fontSize: '18' }} />
                    </IconButton>
                  </>
                );
              }
            },
        }
    ];

    const options = {
        filterType: 'dropdown',
        textLabels: {
            body: {
                noMatch: isLoading ? 'Loading...' : 'Not Found',
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
            tableState.data.map((item) => {
                tmp.push(item.data);
            });
            console.log(tmp);
        },
        selectableRows: false

    };

    return (
        <>
            <Grid container spacing={4} className={classes.tableWrapper}>
                <Grid item xs={12} md={12}>
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <div className={classes.tableContainer}>
                            <MUIDataTable
                                title="Summary"
                                data={outcomeData?.data || []}
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

export default ListOutcome
