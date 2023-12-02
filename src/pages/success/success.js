import React from "react";
import { Grid, Paper, Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// logo
import logo from "../../assets/images/logo.png";

export default function Success() {
  var classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <Paper classes={{ root: classes.paperRoot }}>
        <Typography
          variant="h4"
          color="primary"
        >
          Success!
        </Typography>
        <Typography variant="h5" color="primary" className={classes.textRow}>
          Your action is done successfully.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/login"
          size="large"
          className={classes.backButton}
        >
          Go to Login
        </Button>
      </Paper>
    </Grid>
  );
}
