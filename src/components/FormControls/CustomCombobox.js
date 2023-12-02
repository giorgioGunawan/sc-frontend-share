import React from "react";
import { useTheme } from "@material-ui/styles";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import { FormControl, InputLabel, Select, MenuItem, Button, Divider, TextField, Grid, IconButton, Tooltip } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import Autocomplete from '@material-ui/lab/Autocomplete';
/**
 * 
 * @param {
 * 
 * require * value * items
 * handleChange, addItem
 * 
 * } param0 
 */

export default function CustomCombobox({ required = false, ...props }) {
    var classes = useStyles();
    var theme = useTheme();

    const defaultProps = {
        options: props.items,
        getOptionLabel: (option) => option,
    };
    return (
        <Grid container className={classes.comboContainer}>
            <Grid item md={props.addbtn ? 10 : 12}>
                <Autocomplete
                    classes={{root: classes.autoRoot}}
                    {...defaultProps}
                    id={props.name}
                    debug={false}
                    multiple={false}
                    openOnFocus={true}
                    value={props.value}
                    renderOption={(option) => option}
                    onChange={(e, value) => { console.log(e, value); props.handleChange(value) }}
                    renderInput={(params) => <TextField {...params} required={props.req} label={props.name} margin="normal" />}
                />
            </Grid>
            {props.addbtn ? <Grid item md={2}>
                <Tooltip title="Add Item">
                    <IconButton className={classes.addIcon}>
                        <AddIcon></AddIcon>
                    </IconButton>
                </Tooltip>
            </Grid>
                : null}
        </Grid>
    );
}
