import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  dashedBorder: {
    border: "1px dashed",
    borderColor: theme.palette.primary.main,
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    marginTop: theme.spacing(1),
  },
  text: {
    marginBottom: theme.spacing(2),
  },
  addContainer: {
    display: 'flex',
    paddingRight: '20px',
    paddingLeft: '20px',
  },
  /**
   * Edit Client
   */
  table: {
    minWidth: 650,
  },
  difference: {
    backgroundColor: theme.palette.success.main,
    color: 'red!important',
  },
  divider: {
    marginTop: 20,
    marginBottom: theme.spacing(1),
  },
  buttonContainer: {
    paddingTop: 10,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  inputContainer: {
    marginBottom: '18px'
  }
}));
