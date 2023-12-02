import React from "react";
import { useTheme } from "@material-ui/styles";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import { TextField, FormControl } from "@material-ui/core";

/**
 * 
 * @param {
 * 
 * title, selectedDate
 * handleChange
 * 
 * } param0 
 */

export default function CustomInput(props) {
    var classes = useStyles();
    var theme = useTheme();

    return (
        <FormControl className={classes.formControl}>
            <TextField
                // error
                placeholder={props.placeholder}
                multiline={props.multiline}
                rows={4}
                required
                label={props.title}
                disabled={props.disabled}
                type={props.type}
                value={props.value}
                // helperText="Incorrect entry."
                onChange={(e) => props.handleChange(e)}
                onKeyDown={(e) => props?.handleKeyDown?.(e)}
            />
        </FormControl>
    );
}
