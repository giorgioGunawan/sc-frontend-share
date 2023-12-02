import React, { useState, useEffect } from "react";
import { Grid, IconButton, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Edit, Delete, Add as AddIcon } from '@material-ui/icons'

// components
import PageTitle from "../../../../components/PageTitle/PageTitle";
import { bindActionCreators } from "redux";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../../../common/config';

function OutcomeListDetailPage(props) {
    let history = useHistory();
    const { company_id } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [outcomeData, setOutcomeData ] = useState({})
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState({})

    useEffect(() => {
        getAllOutcome()
    }, [])

    const getAllOutcome = () => {
        setIsLoading(true)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                company_id
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
        history.push(`/app/settings/outcome/${company_id}/${i}`);
    }

    const handleAddOutcome = () => {
        history.push(`/app/settings/outcome/${company_id}/add`);
    }

    const actionDelete = (e, id) => {
        setIsDeleteConfirmationOpen(true)
        const item = outcomeData?.data?.find(item => item.id === id)
        setSelectedItem(item)
    }

    const handleCloseDeleteConfirmationBox = () => {
        setIsDeleteConfirmationOpen(false)
        setSelectedItem({})
    }

    const handleDelete = () => {
        setIsLoading(true)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: selectedItem.id
            })
        }
        fetch(`${SERVER_URL}deleteOutcome`, requestOptions)
            .then(async response => {
                handleCloseDeleteConfirmationBox()
                getAllOutcome()
            }).finally(() => {
                setIsLoading(false)
            })
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
            label: "Entity Name",
            options: {
                filter: true,
                sort: true,
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
                                    actionEdit(e, value)
                                }}
                            >
                                <Edit style={{ fontSize: '18' }} />
                            </IconButton>
                            <IconButton
                                onClick={(e) => {
                                    actionDelete(e, value)
                                }}
                            >
                                <Delete style={{ fontSize: '18' }} />
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
            <Dialog
                open={isDeleteConfirmationOpen}
                onClose={handleCloseDeleteConfirmationBox}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Delete {selectedItem.name}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteConfirmationBox}>Cancel</Button>
                    <Button style={{color: 'red'}} onClick={handleDelete} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Grid container item xs={12} md={12}>
                <Grid item xs={6}>
                    <Typography variant="h2" size="sm" color="myprimary" weight="bold">
                        Outcome
                    </Typography>
                </Grid>
                <Grid item container justifyContent="flex-end" xs={6}>
                    <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAddOutcome}
                    >
                        Add Outcome
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={4}>
                <Grid item xs={12} md={12}>
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            title={"Outcome"}
                            data={outcomeData?.data || []}
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

export default OutcomeListDetailPage
