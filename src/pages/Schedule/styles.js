import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
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
  }
  //End Client Edit
}));
