import React from "react";
import { useTheme } from "@material-ui/styles";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import { Typography } from "../Wrappers/Wrappers";

export default function Status2({ color = "primary", ...props }) {
  var classes = useStyles();
  var theme = useTheme();

  return (
    <div
      className={classNames(classes.status, {[classes.draft]: props.status === 'in',[classes.paid]: props.status === 'out'}, )}
    >
        {props.status.toUpperCase()}
    </div>
  );
}
