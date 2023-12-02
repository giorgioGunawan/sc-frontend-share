import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  dashedBorder: {
    border: "1px dashed",
    borderColor: theme.palette.primary.main,
    padding: theme.spacing(2),
    // paddingTop: theme.spacing(4),
    // paddingBottom: theme.spacing(4),
    // marginTop: theme.spacing(1),
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
  },
  modal: {
    padding: 150,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'auto'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    margin: 'auto',
    padding: theme.spacing(2, 4, 3),
  },
  //End Client Edit
}));
