import React, { useState, useEffect } from "react";
import {BrowserView, MobileView} from 'react-device-detect';
import { Drawer, IconButton, List } from "@material-ui/core";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  NotificationsNone as NotificationsIcon,
  FormatSize as TypographyIcon,
  FilterNone as UIElementsIcon,
  BorderAll as TableIcon,
  QuestionAnswer as SupportIcon,
  LibraryBooks as LibraryIcon,
  HelpOutline as FAQIcon,
  ArrowBack as ArrowBackIcon,
  Place as PlaceIcon,
  MenuOpen, LocalAtmOutlined, ShoppingCartOutlined,
  AccountBalanceOutlined, AssessmentOutlined,
  FormatAlignJustifyOutlined, FormatAlignLeftOutlined, People, Settings, AccountCircleOutlined, BusinessOutlined, PeopleAltOutlined, TransferWithinAStationOutlined, TimerOutlined
} from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import SidebarLink from "./components/SidebarLink/SidebarLink";
import Dot from "./components/Dot";

//logo
import logo from "../../assets/images/logo.png";
// import biglogo from "../../assets/images/biglogo.jpg";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";
import { Typography } from "../Wrappers/Wrappers";

const structure = [
  {
    id: 0,
    label: "User",
    link: "/app/usermanage",
    icon: <AccountCircleOutlined fontSize="small" />,
    children: [
      { label: "Administrators", link: "/app/usermanage/admin" },
      { label: "Users", link: "/app/usermanage/user" },
    ],
  },
  {
    id: 1,
    label: "Company",
    link: "/app/company",
    icon: <BusinessOutlined fontSize="small" />,
    children: [
      { label: "Companies", link: "/app/company" },
      { label: "Branches", link: "/app/branch" },
    ],
  },
  
  {
    id: 2,
    label: "CRM",
    link: "/app/clientview",
    icon: <PeopleAltOutlined fontSize="small" />,
    children: [
      {
        id: 3,
        label: "Client",
        link: "/app/client",
        icon: <PeopleAltOutlined fontSize="small" />,
    
      },
      {
        id: 4,
        label: "Client Relationship",
        link: "/app/sales",
        icon: <TransferWithinAStationOutlined fontSize="small" />,
      },
    ]
  },
  {
    id: 5,
    label: "Schedule",
    link: "/app/schedule",
    icon: <TimerOutlined fontSize="small" />,
  },
  {
    id: 6,
    label: "Live Tracking",
    link: "/app/live-tracking",
    icon: <TimerOutlined fontSize="small" />,
  },
  {
    id: 7,
    label: "Settings",
    link: "/app/settings",
    icon: <PeopleAltOutlined fontSize="small" />,
    children: [
      {
        id: 8,
        label: "Live Tracking",
        link: "/app/settings/live-tracking",
        icon: <PeopleAltOutlined fontSize="small" />,
      },
      {
        id: 9,
        label: "Visit",
        link: "/app/settings/visit",
        icon: <PlaceIcon fontSize="small" />,
      },
      {
        id: 10,
        label: "Outcome",
        link: "/app/settings/outcome",
        icon: <PlaceIcon fontSize="small" />,
      },
      {
        id: 11,
        label: "Absent Feature",
        link: "/app/settings/absent-feature",
        icon: <PlaceIcon fontSize="small" />,
      },
      {
        id: 12,
        label: "Self Client",
        link: "/app/settings/allow-self-create",
        icon: <PlaceIcon fontSize="small" />,
      },
      {
        id: 13,
        label: "Canvas Checkin Feature",
        link: "/app/settings/canvas-checkin-feature",
        icon: <PlaceIcon fontSize="small" />,
      },
      {
        id: 14,
        label: "Custom Form",
        link: "/app/settings/custom-form",
        icon: <PlaceIcon fontSize="small" />,
      },
    ]
  },
];

function Sidebar({ location }) {
  var classes = useStyles();
  var theme = useTheme();

  // global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  // global
  var layoutState = useLayoutState();
  // var layoutDispatch = useLayoutDispatch();

  // local
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function () {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  return (
    <div>
    <BrowserView>
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames(classes.drawerPaper, {
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >

        <Typography color="white" variant="h4" className={classes.logotype}>
            ASILE
        </Typography>
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            style={{ color: 'white' }}
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {structure.map(link => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        ))}
      </List>
      <div className={classes.sidebarList} style={{ justifyContent: 'center', alignSelf: 'center',  marginTop: 20}}>
        <IconButton style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}>
          <ArrowBackIcon style={{marginRight: 5}}/>
          Log Out
        </IconButton>
      </div>
    </Drawer>
    </BrowserView>
    <MobileView>
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height:"60px",
        backgroundColor: "#F5F5F5",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: "10px",
        borderTop: "1px solid #E0E0E0",
        zIndex: 9999, // set a high z-index value
      }}
    >
      <a href="#/app/usermanage/admin">
        Ad
      </a>
      <a href="#/app/usermanage/user">
        Us
      </a>
      <a href="#/app/company">
        Co
      </a>
      <a href="#/app/branch">
        Br
      </a>
      <a href="#/app/client">
        Cl
      </a>
      <a href="#/app/settings/live-tracking">
        LT
      </a>
      <a href="#/app/settings/visit">
        Vi
      </a>
      <a href="#/app/settings/outcome">
        Ou
      </a>
      <a href="#/app/settings/absent-feature">
        Ab
      </a>
      <a href="#/app/settings/allow-self-create">
        Allo
      </a>
      <ArrowBackIcon style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        } }>
        Log Out
      </ArrowBackIcon>
    </div>
  </MobileView>
  </div>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
