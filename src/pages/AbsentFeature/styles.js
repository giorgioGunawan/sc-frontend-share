import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
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
  formControl: {
    marginBottom: '14px',
    maxWidth: '400px'
  },
  label: {
    fontWeight: '600'
  }
}));
