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
  
    /**
   * EditBill.js
   */
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
  },
  filePicker: {
    margin: theme.spacing(1),
    minWidth: '100%',
  },
  fileInput: {
    width: "90%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  formContainer: {
    padding: "0 10px 0 10px"
  },
  typo: {
    margin: theme.spacing(1),
    minWidth: '100%',
  },
  buttonContainer: {
    marginTop: 20,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  //Edit Bill // eslint-disable-next-line

  /**
   * Show Bill
   */
  statusTextContainer: {
    backgroundColor: theme.palette.mysecondary.light,
    color: "#FFF",
    padding: theme.spacing(2),
  },
  statusText: {
    // padding: theme.spacing(1),
  },
  invoiceContainer: {
    height: 40,
    backgroundImage:
      'linear-gradient( 136deg, rgb(255, 255, 255) 0%, rgb(0, 163, 238) 50%, rgb(11, 26, 45) 100%)',
  },
  iconContainer: {
    borderRadius: 60,
    background: theme.palette.myprimary.light,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    color: '#fff',
  },
  cardTitle: {
    justifyContent: 'flex-end',
    display: 'flex',
    color: 'white',
    fontSize: 16,
    letterSpacing: 2,
    fontWeight: 'bold'
  },
  cardRoot: {
    height: 60,
  },
  displayColumn: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 2
  },
  headerContainer: {
    padding: 15,
  },
  rightAlign: {
    alignItems: 'flex-end',
  },
  cardFooterRoot: {
    padding: 20,
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    }
  },
  printButton: {
    backgroundColor: theme.palette.success.main,
    color: '#fff',
    "&:hover": {
      backgroundColor: theme.palette.success.dark,
    }
  },
  shareButton: {
    backgroundColor: theme.palette.favorite.white,
    color: '#666',
    "&:hover": {
      backgroundColor: '#ccc',
    }
  },
  actionButton: {
    backgroundColor: theme.palette.myprimary.light,
    color: '#fff',
    "&:hover": {
      backgroundColor: theme.palette.myprimary.main,
    }
  },
  //Show Bill End

}));
