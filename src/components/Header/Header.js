import React from "react";
import {
  Toolbar,
  IconButton,
  Grid
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  MailOutline as MailIcon,
  NotificationsNone as NotificationsIcon,
  Person as AccountIcon,
  Search as SearchIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  FormatAlignJustifyOutlined,
  FormatAlignLeftOutlined,
} from "@material-ui/icons";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import { Badge, Typography, Button } from "../Wrappers/Wrappers";
import { toggleSidebar, useLayoutDispatch, useLayoutState } from "../../context/LayoutContext";

export default function Header(props) {
  var classes = useStyles();

  // global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();
  // var layoutState = useLayoutState();

  return (
    <Grid container spacing={4}>
      <Toolbar className={classes.toolbar} style={{display: 'flex', justifyContent: 'space-between'}}>
        <IconButton
          color="inherit"
          onClick={() => toggleSidebar(layoutDispatch)}
          className={classNames(
            classes.headerMenuButton,
            classes.headerMenuButtonCollapse,
          )}
        >
          {isSidebarOpened ? (
            <FormatAlignJustifyOutlined
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse,
                ),
              }}
            />
          ) : (
              <FormatAlignLeftOutlined
                classes={{
                  root: classNames(
                    classes.headerIcon,
                    classes.headerIconCollapse,
                  ),
                }}
              />
            )}
        </IconButton>
        <Typography variant="h4" weight="medium" className={classes.logotype}>
          Super Admin ScoutHippo
          </Typography>

        <Typography variant="h6" weight="medium" className={classes.logotype} style={{ float: 'center', marginLeft: 30 }}>
          Hi, {localStorage.getItem('full_name')}
        </Typography>
      </Toolbar>
    </Grid>
  );
}
