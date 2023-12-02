import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  pageTitleContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(3),
    // marginTop: theme.spacing(5),
  },
  typo: {
    color: theme.palette.text.hint,
  },
  button: {
    padding: '8px 8px',
    fontSize: 12,
    width: '100%',
    boxShadow: theme.customShadows.widget,
    textTransform: "none",
    "&:active": {
      boxShadow: theme.customShadows.widgetWide,
    },
  },
  buttonContainer: {
    padding: 5,
    display: 'flex',
    justifyContent: 'flex-end',
    width: 'max-content',
  },
  buttonGroup: {
    display: "flex",
    justifyContent: 'flex-end',
    padding: "5px 0 5px 0"
  }
}));
