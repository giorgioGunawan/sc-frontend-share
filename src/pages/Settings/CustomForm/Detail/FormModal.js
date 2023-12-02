import React, { useState } from 'react'
import { Box, Button, Grid, makeStyles, Modal, Switch } from '@material-ui/core'
import { SERVER_URL } from '../../../../common/config';
import { useEffect } from 'react';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    borderRadius: `20px`,
  };
}

const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 360,
      maxHeight: 700,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    }
  }));

const FormModal = (props) => {
    const {
        open,
        onClose,
        onSave,
        data,
    } = props

    const [form, setForm] = useState({
        id: null,
        form_name: '',
        enable: false,
        required: false
    })

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const handleSwitch = (e) => {
        const { name, checked } = e.target;
        if (name === 'enable' && checked === false) {
            setForm((prev) => ({
                ...prev,
                enable: false,
                required: false
            }))
            return null
        }
        setForm((prev) => ({...prev, [name]: checked}))
    }
    
    useEffect(() => {
      setForm(data)
    }, [data])
    
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div
                style={modalStyle}
                className={classes.paper}
            >
                <div>
                    <h2 style={{ color: '#000' }}>Update Field</h2>
                    <Grid container alignItems="center" >
                        <Grid xs={4}>
                            <div style={{
                                fontWeight: 'bold'
                            }}>Form Name</div>
                        </Grid>
                        <Grid style={{ marginRight: '6px' }}>
                            : 
                        </Grid>
                        <Grid xs="auto">
                            <div>{form?.form_name}</div>
                        </Grid>
                    </Grid>
                    <Grid container alignItems="center" >
                        <Grid xs={4}>
                            <div style={{
                                fontWeight: 'bold'
                            }}>Enable</div>
                        </Grid>
                        <Grid style={{ marginRight: '6px' }}>
                            : 
                        </Grid>
                        <Grid xs="auto">
                            <Switch checked={form?.enable} name="enable" onChange={handleSwitch} />
                        </Grid>
                    </Grid>
                    <Grid container alignItems="center" >
                        <Grid xs={4}>
                            <div style={{
                                fontWeight: 'bold'
                            }}>Required</div>
                        </Grid>
                        <Grid style={{ marginRight: '6px' }}>
                            : 
                        </Grid>
                        <Grid xs="auto">
                            <Switch disabled={!form?.enable} checked={form?.required} name="required" onChange={handleSwitch} />
                        </Grid>
                    </Grid>
                    <div style={{
                        marginTop: '12px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '8px'
                    }}>
                        <Button onClick={onClose} variant="contained">
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => onSave(form)}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default FormModal