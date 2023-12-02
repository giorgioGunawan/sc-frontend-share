import React from "react";
import { useTheme } from "@material-ui/styles";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import { Typography } from "../Wrappers";

export default function Status({ color = "primary", ...props }) {
  var classes = useStyles();
  var theme = useTheme();

  return (
    <div
      className={classNames(classes.status, {[classes.draft]: props.status === 'yes',[classes.paid]: props.status === 'no'}, )}
    >
        {props.status.toUpperCase()}
    </div>
  );
}
