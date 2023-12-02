import React, { useState, useEffect } from "react";
import { Grid, Input, IconButton, FormControlLabel, Switch, Divider, Button, FormGroup, Box } from "@material-ui/core";
import {isMobile} from 'react-device-detect';

// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./styles";

// components
import Widget from "../../../components/Widget/Widget";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Icons from "@material-ui/icons";
import { toast, ToastContainer } from "react-toastify";
import { SERVER_URL } from '../../../common/config';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import CustomInput from "../../../components/FormControls/CustomInput";

function AddVisitingReasonPage(props) {
    var classes = useStyles();
    let history = useHistory();
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState({
        name: '',
        includeProduct: false,
    })
    const [name, setName] = useState('')
    const [errorToastId, setErrorToastId] = useState(null);

    //Show notification
    const notify = (message) => toast(message);

    const onSave = () => {
        setIsLoading(true)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                company_id: localStorage.getItem('company_id'),
                name: name,
                include_product: form.includeProduct
            })
        }
        fetch(`${SERVER_URL}createVisitingReason`, requestOptions)
            .then(async response => {
                const data = await response.json();
                setForm(form => ({
                    ...form,
                    name: '',
                    includeProduct: false
                }))
                notify('Successfully Saved ')
            }).finally(() => {
                setIsLoading(false)
            })
    }

    const handleChangeName = (e) => {
        console.log('g88 here', e);
        if(e?.target?.value) {
            setForm(form => ({
                ...form,
                name: e.target.value
            }))
        }
        
    }

    const handleChangeIncludeProduct = (e) => {
        setForm(form => ({
            ...form,
            includeProduct: !form.includeProduct
        }))
    }

    return (
        <>
            <div style={!isMobile ? {padding: '20px 20px 20px 20px'}: {}}>
                <PageTitle title="New Visiting Reason" />
                <Grid container>
                    <ToastContainer />
                    <Grid item xs={12} md={12}>
                        <Widget title="" disableWidgetMenu>
                            <Grid container spacing={1} className={classes.inputContainer}>
                                <FormControl className={classes.formControl}>
                                    <CustomInput title="Name" handleChange={(e) => setName(e.target.value)} value={name} />
                                </FormControl>
                            </Grid>
                            <Grid container spacing={1} className={classes.inputContainer}>
                                <FormControl className={classes.formControl}>
                                    <FormControlLabel control={<Switch onChange={handleChangeIncludeProduct} checked={form.includeProduct} />} label="Include Product" />
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
            </div>
        </>
    );
}

export default AddVisitingReasonPage