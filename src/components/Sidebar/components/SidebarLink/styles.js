import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  link: {
    textDecoration: "none",
    borderRadius: "10px",
    "&:hover": {
      // backgroundColor: theme.palette.favorite.main + "55",
      backgroundColor: theme.palette.myprimary.light,
    },
    "&:focus": {
      // backgroundColor: theme.palette.favorite.main
      backgroundColor: "inherit"
    },
  },
  linkActive: {
    // backgroundColor: theme.palette.favorite.main,
    backgroundColor: theme.palette.myprimary.bright,
    "&:focus": {
      // backgroundColor: theme.palette.favorite.main
      backgroundColor: theme.palette.myprimary.bright
    },
  },
  linkNestedActive: {
    // backgroundColor: theme.palette.favorite.main
    backgroundColor: theme.palette.myprimary.bright,
  },
  linkNested: {
    paddingLeft: 0,
    borderRadius: "10px",
    "&:hover": {
      // backgroundColor: theme.palette.favorite.main + "55"
      backgroundColor: theme.palette.myprimary.light
    },
    "&:focus": {
      // backgroundColor: theme.palette.favorite.main,
      backgroundColor: theme.palette.myprimary.bright
    },
  },
  linkIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary + "99",
    transition: theme.transitions.create("color"),
    width: 24,
    display: "flex",
    justifyContent: "center",
    color: theme.palette.primary.white,
  },
  linkIconActive: {
    color: theme.palette.primary.white,
  },
  linkText: {
    padding: 0,
    color: theme.palette.text.white + "",
    transition: theme.transitions.create(["opacity", "color"]),
    fontSize: 14,
  },
  largeText: {
    fontSize: 14,
  },
  smallText: {
    fontSize: 13,
  },
  linkTextActive: {
    // color: theme.palette.text.primary,
    color: theme.palette.text.white,
    fontWeight: "550",
  },
  linkTextHidden: {
    opacity: 0,
  },
  nestedList: {
    paddingLeft: theme.spacing(3),
    fontSize: '12px!important',
  },
  sectionTitle: {
    marginLeft: theme.spacing(4.5),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    height: 1,
    backgroundColor: "#D8D8D880",
  },
  listItem: {
    padding: 5
  }
}));
