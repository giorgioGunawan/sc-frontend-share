import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';
import loadingImage from '../../assets/images/loading.gif';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 5,
    color: '#fff',
    backgroundColor: '#ffffff44',
  },
}));

export default function BackdropLoading(props) {
  
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div>
      <Backdrop className={classes.backdrop} open={props.open} onClick={handleClose}>
        <img src={loadingImage} alt="Loading ..."/>
      </Backdrop>
    </div>
  );
}
