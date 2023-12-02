import React, { useState, useEffect } from "react";
import { Grid, Input, IconButton, FormControlLabel, Switch, Divider, Button } from "@material-ui/core";

// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./styles";

// components
import Widget from "../../../../../components/Widget/Widget";
import PageTitle from "../../../../../components/PageTitle/PageTitle";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Icons from "@material-ui/icons";
import { toast, ToastContainer } from "react-toastify";
import { SERVER_URL } from '../../../../../common/config';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import CustomInput from "../../../../../components/FormControls/CustomInput";

function EditProductPage(props) {
    var classes = useStyles();
    let history = useHistory();
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')
    const [errorToastId, setErrorToastId] = useState(null);
    const { company_id, id } = useParams()

    useEffect(() => {
        getDetailProduct()
    }, [])

    //Show notification
    const notify = (message) => toast(message);

    const getDetailProduct = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id
            })
        }
        fetch(`${SERVER_URL}getProductById`, requestOptions)
            .then(async response => {
                const data = await response.json();
                setName(data?.name || '')
            })
    }

    const onSave = () => {
        setIsLoading(true)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id,
                name
            })
        }
        fetch(`${SERVER_URL}updateProduct`, requestOptions)
            .then(async response => {
                const data = await response.json();
                notify('Successfully Saved ')
            }).finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <>
            <PageTitle title="New Product" />
            <Grid container>
                <ToastContainer />
                <Grid item xs={12} md={12}>
                    <Widget title="" disableWidgetMenu>
                        <Grid container spacing={1}>
                            <FormControl className={classes.formControl}>
                                <CustomInput title="Name" handleChange={(e) => setName(e.target.value)} value={name} />
                            </FormControl>
                        </Grid>
                        <Grid item style={{marginTop: '18px'}}>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                startIcon={<Icons.Save />}
                                onClick={() => onSave()}
                            >
                                Save
                            </Button>
                        </Grid>
                    </Widget>
                </Grid>
            </Grid>
        </>
    );
}

export default EditProductPage