import React, { useState, useEffect } from "react";
import { Drawer, IconButton, List } from "@material-ui/core";
import {BrowserView, MobileView} from 'react-device-detect';
import {
  ArrowBack as ArrowBackIcon,
  AssessmentOutlined,
  AccountCircleOutlined,
  PeopleAltOutlined,
  TransferWithinAStationOutlined,
  TimerOutlined,
} from "@material-ui/icons";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useTheme } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import HistoryOutlinedIcon from '@material-ui/icons/HistoryOutlined';
import StorageOutlinedIcon from '@material-ui/icons/StorageOutlined';
import TrendingUpOutlinedIcon from '@material-ui/icons/TrendingUpOutlined';
import SpellcheckOutlinedIcon from '@material-ui/icons/SpellcheckOutlined';
import BusinessOutlinedIcon from '@material-ui/icons/BusinessOutlined';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import MapIcon from '@material-ui/icons/Map';
import GearIcon from '@material-ui/icons/Settings';
import PlaceIcon from '@material-ui/icons/Place';

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

const structure = localStorage.getItem('allow_so') != 0 ? [
  {
    id: 0,
    label: "Schedule",
    link: "/app/scheduleview",
    icon: <TimerOutlined fontSize="small" />,
  },
  {
    id: 1,
    label: "Live Tracking",
    link: "/app/live-tracking",
    icon: <MapIcon fontSize="small" />,
  },
  {
    id: 2,
    label: "Employees",
    link: "/app/userview",
    icon: <AccountCircleOutlined fontSize="small" />,
  },
  /*
  {
    id: 2,
    label: "Inventory",
    link: "/app/salesorder/group",
    icon: <BusinessOutlinedIcon fontSize="small" />,
    children: [
      {
        label: "Category",
        link: "/app/salesorder/group",
        icon: <SpellcheckOutlinedIcon fontSize="small" />,
      },
      {
        label: "Items Database",
        link: "/app/salesorder/item",
        icon: <StorageOutlinedIcon fontSize="small" />,
      },
    ]
  },
  {
    id: 7,
    label: "Promotions",
    link: "/app/salesorder/promotion",
    icon: <LocalOfferOutlinedIcon fontSize="small" />,
  },
  {
    id: 3,
    label: "Sales Target",
    link: "/app/salesorder/itemcategory",
    icon: <TrendingUpOutlinedIcon fontSize="small" />,
    children: [
      {
        label: "Item Categories",
        link: "/app/salesorder/itemcategory",
        icon: <SpellcheckOutlinedIcon fontSize="small" />,
      },
      {
        label: "Company Users",
        link: "/app/salesorder/companyusers",
        icon: <StorageOutlinedIcon fontSize="small" />,
      }
    ]
  },
  */
  
  /*
  {
    id: 6,
    label: "Sales Order",
    link: "/app/salesorder/review",
    icon: <ShoppingCartOutlinedIcon fontSize="small" />,
    children: [
      {
        label: "Review Orders",
        link: "/app/salesorder/review",
        icon: <VisibilityOutlinedIcon fontSize="small" />,
      },
      {
        label: "Orders History",
        link: "/app/salesorder/history",
        icon: <HistoryOutlinedIcon fontSize="small" />,
      },
    ],
  },*/
  {
    id: 4,
    label: "CRM",
    link: "/app/clientview",
    icon: <PeopleAltOutlined fontSize="small" />,
    children: [
      {
        label: "Clients",
        link: "/app/clientview",
      },
      {
        label: "Relationships",
        link: "/app/salesview",
      },
    ]
  },
  {
    id: 5,
    label: "Report",
    link: "/app/reportview",
    icon: <VisibilityOutlinedIcon fontSize="small" />,
  },
  /*{
    id: 6,
    label: "Daily View",
    link: "/app/calendarview",
    icon: <CalendarMonthIcon fontSize="small" />,
  },*/
  {
    id: 11,
    label: "Settings",
    icon: <GearIcon fontSize="small" />,
    children: [
      {
        label: "Visit",
        link: "/app/visit",
        icon: <PlaceIcon fontSize="small" />,
      },
      {
        label: "Outcome",
        link: "/app/outcome",
        icon: <PlaceIcon fontSize="small" />,
      },
      {
        label: "Absent",
        link: "/app/settings/absent-feature",
        icon: <PlaceIcon fontSize="small" />,
      },
    ]
  },

] : [
    {
      id: 0,
      label: "Schedule",
      link: "/app/scheduleview",
      icon: <TimerOutlined fontSize="small" />,
    },
    {
      id: 1,
      label: "Live Tracking",
      link: "/app/live-tracking",
      icon: <MapIcon fontSize="small" />,
    },
    {
      id: 2,
      label: "Employees",
      link: "/app/userview",
      icon: <AccountCircleOutlined fontSize="small" />,
    },
    // {
    //   id: 2,
    //   label: "Inventory",
    //   link: "/app/salesorder/group",
    //   icon: <BusinessOutlinedIcon fontSize="small" />,
    //   children: [
    //     {
    //       label: "Category",
    //       link: "/app/salesorder/group",
    //       icon: <SpellcheckOutlinedIcon fontSize="small" />,
    //     },
    //     {
    //       label: "Items Database",
    //       link: "/app/salesorder/item",
    //       icon: <StorageOutlinedIcon fontSize="small" />,
    //     },
    //   ]
    // },
    // {
    //   id: 6,
    //   label: "Promotions",
    //   link: "/app/salesorder/promotion",
    //   icon: <LocalOfferOutlinedIcon fontSize="small" />,
    // },
    // {
    //   id: 3,
    //   label: "Sales Target",
    //   link: "/app/salesorder/itemcategory",
    //   icon: <TrendingUpOutlinedIcon fontSize="small" />,
    //   children: [
    //     {
    //       label: "Item Categories",
    //       link: "/app/salesorder/itemcategory",
    //       icon: <SpellcheckOutlinedIcon fontSize="small" />,
    //     },
    //     {
    //       label: "Company Users",
    //       link: "/app/salesorder/companyusers",
    //       icon: <StorageOutlinedIcon fontSize="small" />,
    //     }
    //   ]
    // },
    {
      id: 4,
      label: "CRM",
      link: "/app/clientview",
      icon: <PeopleAltOutlined fontSize="small" />,
      children: [
        {
          label: "Clients",
          link: "/app/clientview",
        },
        {
          label: "Relationships",
          link: "/app/salesview",
        },
      ]
    },
    {
      id: 5,
      label: "Report",
      link: "/app/reportview",
      icon: <VisibilityOutlinedIcon fontSize="small" />,
    },
    /*{
      id: 6,
      label: "Daily View",
      link: "/app/calendarview",
      icon: <CalendarMonthIcon fontSize="small" />,
    },*/
    {
      id: 11,
      label: "Settings",
      icon: <GearIcon fontSize="small" />,
      children: [
        {
          label: "Visit",
          link: "/app/visit",
          icon: <PlaceIcon fontSize="small" />,
        },
        {
          label: "Outcome",
          link: "/app/outcome",
          icon: <PlaceIcon fontSize="small" />,
        },
        {
          label: "Absent",
          link: "/app/settings/absent-feature",
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
          ScoutHippo
        </Typography>
        <div className={classes.mobileBackButton}>
          <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
            <ArrowBackIcon
              style={{ color: 'white' }}
              classes={{
                root: classNames(classes.headerIcon, classes.headerIconCollapse),
              }} />
          </IconButton>
        </div>
        <List className={classes.sidebarList}>
          {structure.map(link => (
            <SidebarLink
              key={link.id}
              location={location}
              isSidebarOpened={isSidebarOpened}
              {...link} />
          ))}
        </List>
        <div style={{ justifyContent: 'center', alignSelf: 'center', marginTop: 20 }}>
          <IconButton style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            } }>
            <ArrowBackIcon
              style={{ marginRight: 5 }} />
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
          <a href="#/app/live-tracking">
            <MapIcon fontSize="small" />
          </a>
          <a href="#/app/clientview">
            <PeopleAltOutlined fontSize="small" />
          </a>
          <a href="#/app/userview">
            <AccountCircleOutlined fontSize="small" />
          </a>
          <a href="#/app/scheduleview">
            <TimerOutlined fontSize="small" />
          </a>
          <a href="#/app/reportview">
            <VisibilityOutlinedIcon fontSize="small" />
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
    var isSmallScreen = windowWidth < '500px';

    if (isSmallScreen && isPermanent) {
      // this does the ugly window overlap thing
      // setPermanent(false);

    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
