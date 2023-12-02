import React, { useState, useEffect } from "react";
import { Grid, IconButton, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Edit, Delete } from '@material-ui/icons'

// components
import PageTitle from "../../../../../components/PageTitle/PageTitle";
import { bindActionCreators } from "redux";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import Status from "../../../../../components/Status/Status";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../../../../../common/config';

function VisitingReasonPage(props) {
    let history = useHistory();
    const { company_id } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState({})
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
                company_id
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
        history.push(`/app/settings/visit/detail/${company_id}/visiting-reason/${i}`);
    }

    const actionDelete = (e, id) => {
        setIsDeleteConfirmationOpen(true)
        const item = visitingReasonData?.data?.find(item => item.id === id)
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
        fetch(`${SERVER_URL}deleteVisitingReason`, requestOptions)
            .then(async response => {
                handleCloseDeleteConfirmationBox()
                getAllVisitingReason()
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
                    height:"35px",
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
                sort: true,
            }
        },
        {
            name: "include_product",
            label: "Include Product",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value) => <span>{value ? 'Yes' : 'No'}</span>
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
            <PageTitle title="Visit" button={["Add New"]} category="detail-visiting-reason" history={history} />
            <Grid container spacing={4}>
                <Grid item xs={12} md={12}>
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            title={"Visiting Reason"}
                            data={visitingReasonData?.data || []}
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

export default VisitingReasonPage
