import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
    widgetWrapper: {
        display: "flex",
        color: '#fff',
        // minHeight: "100%",
    },
    incomeWidget: {
        backgroundImage:
            'linear-gradient( 90deg, #00A3EE 0%, rgb(255,255,255) 150%)',
    },
    expenseWidget: {
        backgroundImage:
            'linear-gradient( 90deg, #F03434 0%, rgb(255,255,255) 150%)',
    },
    profitWidget: {
        backgroundImage:
            'linear-gradient( 90deg, #70A456 0%, rgb(255,255,255) 150%)',
    },
    widgetHeader: {
        padding: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        color: '#fff',
        /* display: "flex",
        justifyContent: "space-between",
        alignItems: "center", */
    },
    widgetRoot: {
        boxShadow: theme.customShadows.widget,
        position: 'relative',
    },
    widgetBody: {
        paddingBottom: theme.spacing(3),
        paddingRight: theme.spacing(3),
        paddingLeft: theme.spacing(3),
    },
    noPadding: {
        padding: 0,
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        overflow: "scroll",
    },
    moreButton: {
        // margin: -theme.spacing(1),
        position: 'absolute',
        right: 0,
        padding: 0,
        width: 40,
        height: 40,
        // color: theme.palette.text.hint,
        color: '#fff',
        /* "&:hover": {
            backgroundColor: theme.palette.primary.main,
            color: "rgba(255, 255, 255, 0.35)",
        }, */
    },
    iconArea: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: 10,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 60,
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    incomeIcon: {
        color: '#00A3EE',
    },
    expenseIcon: {
        color: '#F03434',
    },
    profitIcon: {
        color: '#70A456',
    },
    totalRight: {
        display: 'flex',
        justifyContent: 'flex-end',
    }
}));
