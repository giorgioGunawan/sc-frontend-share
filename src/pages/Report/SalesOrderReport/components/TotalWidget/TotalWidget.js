import React, { useState } from "react";
import {
    Paper,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Divider,
    Grid,
} from "@material-ui/core";
import { MoreVert as MoreIcon } from "@material-ui/icons";
import * as Icons from "@material-ui/icons";
import classnames from "classnames";
import moment from 'moment'
// styles
import useStyles from "./styles";

export default function TotalWidget({
    children,
    title,
    noBodyPadding,
    bodyClass,
    disableWidgetMenu,
    header,
    sales_target,
    current_total_sales,
    date,
    ...props
}) {
    var classes = useStyles();
    const createIcon = (title) => {
        switch (title) {
            case "Sales Target":
                return (
                    <div className={classes.iconContainer}>
                        <Icons.LocalAtm className={classes.incomeIcon} />
                    </div>
                )
            case "Current Total Sales":
                return (
                    <div className={classes.iconContainer}>
                        <Icons.ShoppingCart className={classes.expenseIcon} />
                    </div>
                )

            default:
                return null;
        }
    }

    return (
        <div className={classes.widgetWrapper}>
            <Paper className={classes.paper} classes={{
                root: classnames(classes.widgetRoot,
                    { [classes.incomeWidget]: title === "Sales Target" },
                    { [classes.expenseWidget]: title === "Current Total Sales" },
                )
            }}>
                <div className={classes.widgetHeader}>
                    <Grid container>
                        <Grid item lg={8} md={8} sm={8} xs={6}>
                            <React.Fragment>
                                <Typography variant="h4" color="inherit">
                                    {title}
                                </Typography>
                            </React.Fragment>
                            { title == "Sales Target" ?
                                <React.Fragment>
                                    <Typography variant="h6">
                                        {moment(new Date()).format('YYYY-MM')}
                                </Typography>
                                </React.Fragment> : <React.Fragment>
                                    <Typography variant="h6">
                                        {moment(new Date()).format('YYYY-MM-DD')}
                                </Typography>
                                </React.Fragment>
                            }

                        </Grid>
                        <Grid item className={classes.iconArea} lg={4} md={4} sm={4} xs={6}>
                            {createIcon(title)}
                        </Grid>
                    </Grid>
                </div>
                <Grid container className={classes.widgetHeader}>
                    
                    <Grid item lg={6} md={6} sm={6} xs={6} className={classes.totalRight}>
                        <Typography variant="h3" color="inherit">
                            {title == "Sales Target" ? sales_target : current_total_sales }
                        </Typography>
                    </Grid>
                </Grid>
                <div
                    className={classnames(classes.widgetBody, {
                        [classes.noPadding]: noBodyPadding,
                        [bodyClass]: bodyClass,
                    })}
                >
                    {children}
                </div>
            </Paper>
        </div>
    );
}
