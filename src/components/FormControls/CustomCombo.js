import React from "react";
import { useTheme } from "@material-ui/styles";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import { FormControl, InputLabel, Select, MenuItem, Button, Divider } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';

/**
 * 
 * @param {
 * 
 * require * value * items
 * handleChange, addItem
 * 
 * } param0 
 */

export default function CustomerCombo({ required = false, ...props }) {
    var classes = useStyles();
    var theme = useTheme();

    return (
        <FormControl required={required} className={classes.formControl}>
            <InputLabel id="demo-simple-select-required-label">{props.name}</InputLabel>
            <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={props.value}
                onChange={(e) => props.handleChange(e)}
                className={classes.selectEmpty}
                native={false}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {
                    props.items.map((item, i) => {
                        return (
                            <MenuItem key={i} value={item}>{item}</MenuItem>
                        )
                    })
                }
                {props.addbtn && <Divider component="li" />}
                {props.addbtn && <MenuItem button value={'button'} className={classes.addButton}>
                    <AddIcon fontSize='small' />
                        Add New
                </MenuItem>}
            </Select>
        </FormControl>
    );
}
