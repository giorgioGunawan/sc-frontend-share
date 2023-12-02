import React from "react";
import { useTheme } from "@material-ui/styles";
import classNames from "classnames";
import { Input } from 'antd';
import { Space, Typography } from 'antd';

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

 const { Text, Link } = Typography;
 const {TextArea} = Input;

export default function CustomInput(props) {
    var classes = useStyles();
    var theme = useTheme();

    return (
        <FormControl className={classes.formControl}>
            <Text>{props.title}</Text>
            {props.textarea ? 
            <TextArea
                showCount
                maxLength={175}
                // error
                placeholder={props.placeholder}
                rows={6}
                required
                label={props.title}
                disabled={props.disabled}
                type={props.type}
                value={props.value}
                // helperText="Incorrect entry."
                onChange={(e) => props.handleChange(e)}
                onKeyDown={(e) => props?.handleKeyDown?.(e)}
            />:
            <Input
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
            }
        </FormControl>
    );
}
