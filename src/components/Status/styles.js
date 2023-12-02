import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  status: {
    width: 50,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    fontSize: 10,
    color: "#FFF"
  },
  draft: {
    backgroundColor: theme.palette.primary.main
  },
  paid: {
    backgroundColor: theme.palette.success.main
  },
  pending: {
    backgroundColor: theme.palette.secondary.main
  },

}));
