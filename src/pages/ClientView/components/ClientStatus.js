import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import SettingsIcon from '@material-ui/icons/Settings';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import StepConnector from '@material-ui/core/StepConnector';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import * as Icons from '@material-ui/icons';
import { StepContent } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  line: {
    width: 3,
    height: 60,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

const StyledStepContent = withStyles({
  root: {
    borderLeft: '3px solid #eaeaf0',
    borderRadius: 1,
  }
})(StepContent);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(255, 255, 255) 0%, rgb(0, 163, 238) 50%, rgb(11, 26, 45) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(255, 255, 255) 0%, rgb(0, 163, 238) 50%, rgb(11, 26, 45) 100%)',
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <Icons.Add />,
    2: <Icons.MailOutline />,
    3: <Icons.Money />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ['Select campaign settings', 'Create an ad group', 'Create an ad'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return 'Select campaign settings...';
    case 1:
      return 'What is an ad group anyways?';
    case 2:
      return 'This is the bit I really care about!';
    default:
      return 'Unknown step';
  }
}

export default function ClientStatus() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const history = useHistory();
  const {client} = useParams();

  useEffect(() => {
    
  }, [])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleEdit = () => {
    history.push("/app/client/" + client + "/edit");
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleMarkSent = () => { 

  }

  const handleSendEmail = () => {

  }

  const handleMarkPaid = () => {

  }

  const handleAddPayment = () => {

  }

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} connector={<ColorlibConnector />} orientation="vertical">
        <Step active={true}>
          <StepLabel StepIconComponent={ColorlibStepIcon}>Create Client</StepLabel>
          <StyledStepContent>
            <Typography >Status: Created on 22 May 2020</Typography>
            <div className={classes.actionsContainer}>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                  className={classes.button}
                >
                  Edit
                </Button>
              </div>
            </div>
          </StyledStepContent>
        </Step>
        <Step active={true}>
          <StepLabel StepIconComponent={ColorlibStepIcon}>Receive Client</StepLabel>
          <StyledStepContent>
            <Typography >Status: Not sent</Typography>
            <div className={classes.actionsContainer}>
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleMarkSent}
                  className={classes.button}
                >
                  Mark Sent
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSendEmail}
                  className={classes.button}
                >
                  Send Email
                </Button>
              </div>
            </div>
          </StyledStepContent>
        </Step>
        <Step active={true}>
          <StepLabel StepIconComponent={ColorlibStepIcon}>Get Paid</StepLabel>
          <StyledStepContent>
            <Typography >Status: Awaiting payment</Typography>
            <div className={classes.actionsContainer}>
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleMarkPaid}
                  className={classes.button}
                >
                  Mark Paid
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPayment}
                  className={classes.button}
                >
                  Add Payment
                </Button>
              </div>
            </div>
          </StyledStepContent>
        </Step>
      </Stepper>
    </div>
  );
}
