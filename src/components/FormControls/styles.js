import { makeStyles } from "@material-ui/styles";
import { red, blue} from "@material-ui/core/colors";
import { fade } from "@material-ui/core/styles/colorManipulator";

export default makeStyles(theme => ({

    /**
     * EditInvoice.js
     */
    formControl: {
      marginTop: theme.spacing(1),
      margin: theme.spacing(1),
      width: "95%"
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    formContainer: {
      padding: "0 15px 0 15px"
    },
    addButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    /**
     * Custom Combobox
     */
    comboContainer: {
      marginLeft: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      width: "95%",
    },
    comboContainer2: {
      display: 'flex',
      alignItems: 'center',
    },
    addIcon: {
      marginLeft: "5px"
    },
    autoRoot: {
      marginTop: "-8px",
      marginBottom: 0,
    },
    //Custom Combobox End
}));
