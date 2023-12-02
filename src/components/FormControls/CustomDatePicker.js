import React from "react";
import { useTheme } from "@material-ui/styles";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import { DatePicker, KeyboardDatePicker } from "@material-ui/pickers";

/**
 * 
 * @param {
 * 
 * title, selectedDate
 * handleChange
 * 
 * } param0 
 */

export default function CustomDatePicker( props ) {
    var classes = useStyles();
    var theme = useTheme();

    return (
        <DatePicker className={classes.formControl}
            required
            variant="inline"
            animateYearScrolling
            autoOk
            // views
            clearable='true'
            label={props.title}
            value={props.selectedDate}
            onChange={(e) => props.handleChange(e)}
        />
    );
}
