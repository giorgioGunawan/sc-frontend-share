import tinycolor from "tinycolor2";

const primary = "#536DFE";//#6200ee
const secondary = "#FF5C93";
const myprimary = "#0B1A2D"; //0B1A2D 07112C
const mysecondary = "#00A3EE";
const warning = "#FFC260";
const success = "#3CD4A0";
const info = "#9013FE";
const blue = "#2196f3";
const green = "#4caf50";
const white = "#FFF";
const favorite = "#4302a0";

const lightenRate = 7.5;
const brightenRate = 15;
const darkenRate = 15;

export default {
  palette: {
    primary: {
      main: primary,
      light: tinycolor(primary)
        .lighten(lightenRate)
        .toHexString(),
      dark: tinycolor(primary)
        .darken(darkenRate)
        .toHexString(),
      white: white,
    },
    myprimary: {
      main: myprimary,
      bright: tinycolor(myprimary)
        .lighten(brightenRate)
        .toHexString(),
      light: tinycolor(myprimary)
        .lighten(lightenRate)
        .toHexString(),
      dark: tinycolor(myprimary)
        .darken(darkenRate)
        .toHexString(),
      white: white,
    },
    favorite: {
      main: favorite,
      light: tinycolor(primary)
        .lighten(lightenRate)
        .toHexString(),
      dark: tinycolor(primary)
        .darken(darkenRate)
        .toHexString(),
      white: white,
    },
    secondary: {
      main: secondary,
      light: tinycolor(secondary)
        .lighten(lightenRate)
        .toHexString(),
      dark: tinycolor(secondary)
        .darken(darkenRate)
        .toHexString(),
      contrastText: "#FFFFFF",
    },
    mysecondary: {
      main: mysecondary,
      bright: tinycolor(mysecondary)
        .lighten(brightenRate)
        .toHexString(),
      light: tinycolor(mysecondary)
        .lighten(lightenRate)
        .toHexString(),
      dark: tinycolor(mysecondary)
        .darken(darkenRate)
        .toHexString(),
      contrastText: "#FFFFFF",
    },
    warning: {
      main: warning,
      light: tinycolor(warning)
        .lighten(lightenRate)
        .toHexString(),
      dark: tinycolor(warning)
        .darken(darkenRate)
        .toHexString(),
    },
    success: {
      main: success,
      light: tinycolor(success)
        .lighten(lightenRate)
        .toHexString(),
      dark: tinycolor(success)
        .darken(darkenRate)
        .toHexString(),
    },
    info: {
      main: info,
      light: tinycolor(info)
        .lighten(lightenRate)
        .toHexString(),
      dark: tinycolor(info)
        .darken(darkenRate)
        .toHexString(),
    },
    text: {
      primary: "#4A4A4A",
      secondary: "#6E6E6E",
      hint: "#B9B9B9",
      white: "#FFF"
    },
    background: {
      default: "#F6F7FF",
      light: "#F3F5FF",
    },
    blue: {
      main: blue,
      light: tinycolor(blue)
        .lighten(lightenRate)
        .toHexString(),
      dark: tinycolor(blue)
        .darken(darkenRate)
        .toHexString(),
    },
    green: {
      main: green,
      light: tinycolor(green)
        .lighten(lightenRate)
        .toHexString(),
      dark: tinycolor(green)
        .darken(darkenRate)
        .toHexString(),
    },
  },
  customShadows: {
    widget:
      "0px 3px 11px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
    widgetDark:
      "0px 3px 18px 0px #4558A3B3, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
    widgetWide:
      "0px 12px 33px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
  },
  overrides: {
    MuiBackdrop: {
      root: {
        backgroundColor: "#4A4A4A1A",
      },
    },
    MuiMenu: {
      paper: {
        boxShadow:
          "0px 3px 11px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
      },
    },
    MuiSelect: {
      icon: {
        color: "#B9B9B9",
      },
    },
    MuiListItem: {
      root: {
        "&$selected": {
          backgroundColor: "#F3F5FF !important",
          "&:focus": {
            backgroundColor: "#F3F5FF",
          },
        },
      },
      button: {
        "&:hover, &:focus": {
          backgroundColor: "#F3F5FF",
        },
      },
    },
    MuiTouchRipple: {
      child: {
        backgroundColor: "white",
      },
    },
    MuiTable: {
      root: {
        border: "1px solid rgba(224, 224, 224, .5)",
      }
    },
    MUIDataTableBodyCell: {
      root: {
        paddingTop: "5px",
        paddingBottom: "5px",
      },
    },
    MuiTableCell: {
      root: {
        borderColor: '#d3d3d3',
        fontSize: '.8125rem',
      },
      head: {
        paddingTop: "0px",
        paddingBottom: "0px",
        height: 50,
      },
    },
    MuiTableRow: {
      root: {
        height: 75,
      },
    },
    MUIDataTableHeadCell: {
      fixedHeaderCommon: {
        backgroundColor: '#00a3ee5c',
      }
    },
    MUIDataTableSelectCell: {
      headerCell: {
        backgroundColor: '#00a3ee5c',
      }
    },
    MuiTypography: {
      body1: {
        fontSize: '0.8125rem',
      }
    },    
    MuiMenuItem: {
      root: {
        fontSize: '0.8125rem',
        padding: 36,
        paddingTop: 12,
        paddingBottom: 12,
      }
    },    
  },
};
