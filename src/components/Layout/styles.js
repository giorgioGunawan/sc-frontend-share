import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  root: {
    display: "flex",
    maxWidth: "100vw",
    overflowX: "hidden",
    background: '#fff',
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(2),
    width: `calc(100vw - 240px)`,
    minHeight: "100vh",
  },
  contentShift: {
    width: `calc(100vw - ${240 + theme.spacing(6)}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  fakeToolbar: {
    ...theme.mixins.toolbar,
  },
  mainContainer: {
    // paddingTop: 20,
    // paddingLeft: 40,
    // paddingRight: 40,
    // paddingLeft: `calc(100vw - 240px) * 0.2`,
  },
  padding1600: {
    paddingLeft: 80,
    paddingRight: 80,
  },
  padding1800: {
    paddingLeft: 120,
    paddingRight: 120,
  },

}));
