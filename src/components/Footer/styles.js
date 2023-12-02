import { makeStyles } from "@material-ui/styles";
import { red, blue} from "@material-ui/core/colors";
import { fade } from "@material-ui/core/styles/colorManipulator";

export default makeStyles(theme => ({

  container: {
    paddingTop: 20
  },
  tableWrapper: {
    paddingRight: "20px",
    paddingLeft: "20px",
    position:"absolute",
    bottom:10,
  },
  version: {
    display: 'flex',
    justifyContent: 'center',
  },
}));
