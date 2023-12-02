import React from "react";
import { useTheme } from "@material-ui/styles";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import { Typography } from "../Wrappers/Wrappers";

export default function Status3({ color = "primary", ...props }) {
  var classes = useStyles();
  var theme = useTheme();

  return (
    <div
      className={classNames(classes.status, {
        [classes.draft]: props.status === 'reject',
        [classes.paid]: props.status === 'accept',
        [classes.pending]: props.status === 'pending'
      }
      )}
    >
      {props.status.toUpperCase()}
    </div>
  );
}
