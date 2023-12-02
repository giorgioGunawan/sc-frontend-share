import React, { useState } from 'react'
import { Button, makeStyles, Modal } from '@material-ui/core'
import { createTheme } from '@material-ui/core/styles'
import { SERVER_URL } from '../../common/config';

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
      width: 400,
      maxHeight: 700,
      overflowY: 'scroll',
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    }
  }));

const ScheduleModal = (props) => {
    const {
        open,
        onClose,
        schedule,
        isLoading
    } = props
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
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
                    <h2 style={{ color: '#000' }}>Visit Information</h2>
                    <div style={{
                        marginBottom: '12px'
                    }}>
                        <div style={{
                            fontWeight: 'bold'
                        }}>Klien: </div>
                        <div>{schedule?.client_entity_name}</div>
                    </div>
                    {
                        schedule?.custom_field
                        ?
                        <div style={{
                            marginBottom: '12px'
                        }}>
                            <div style={{
                                fontWeight: 'bold'
                            }}>Client Detail: </div>
                            <div>{schedule?.custom_field || '-'}</div>
                        </div>
                        : null
                    }
                    {
                        schedule.signature
                        ?
                        <div style={{
                            marginBottom: '12px'
                        }}>
                            <div style={{
                                fontWeight: 'bold'
                            }}>Signature: </div>
                            <a href={`${SERVER_URL}signature/${schedule.signature}`} target="_blank">
                                <img
                                    style={{
                                        height: '40px',
                                        border: '1px solid black'
                                    }}
                                    src={`${SERVER_URL}signature/${schedule.signature}`}
                                />
                            </a>
                        </div>
                        : null
                    }
                    {
                        schedule.upload_picture
                        ?
                        <div style={{
                            marginBottom: '12px'
                        }}>
                            <div style={{
                                fontWeight: 'bold'
                            }}>Uploaded Picture: </div>
                            <a href={`${SERVER_URL}upload/${schedule.upload_picture}`} target="_blank">
                                <img
                                    style={{
                                        height: '40px',
                                    }}
                                    src={`${SERVER_URL}upload/${schedule.upload_picture}`}
                                />
                            </a>
                        </div>
                        : null
                    }
                    <div style={{
                        marginBottom: '12px'
                    }}>
                        <div style={{
                            fontWeight: 'bold'
                        }}>Lokasi: </div>
                        <div>{schedule?.address}</div>
                    </div>
                    <div style={{
                        marginBottom: '12px'
                    }}>
                        <div style={{
                            fontWeight: 'bold'
                        }}>Checkin: </div>
                        <div>{
                            schedule?.check_in_datetime === '0000-00-00 00:00:00' || !schedule?.check_in_datetime ? '-' : schedule?.check_in_datetime
                        }</div>
                    </div>
                    <div style={{
                        marginBottom: '12px'
                    }}>
                        <div style={{
                            fontWeight: 'bold'
                        }}>Checkout: </div>
                        <div>{
                            schedule?.check_out_datetime === '0000-00-00 00:00:00' || !schedule?.check_out_datetime ? '-' : schedule?.check_out_datetime
                        }</div>
                    </div>
                    {
                        schedule?.notes
                        ?
                        <div style={{
                            marginBottom: '12px'
                        }}>
                            <div style={{
                                fontWeight: 'bold'
                            }}>Notes: </div>
                            <div>{schedule?.notes || '-'}</div>
                        </div>
                        : null
                    }
                    <div style={{
                        marginBottom: '12px'
                    }}>
                        <div style={{
                            fontWeight: 'bold'
                        }}>Outcome: </div>
                        <div>{schedule?.outcome_name || '-'}</div>
                    </div>
                    <div style={{
                        marginBottom: '12px'
                    }}>
                        <div style={{
                            fontWeight: 'bold'
                        }}>Visiting Reason: </div>
                        <div>{schedule?.visiting_reason?.name || '-'}</div>
                    </div>
                    {
                        schedule?.visiting_reason?.products?.length
                        ?
                        <div style={{
                            marginBottom: '12px'
                        }}>
                            <div style={{
                                fontWeight: 'bold'
                            }}>Products: </div>
                            <div>{schedule?.visiting_reason?.products?.map(item => item.name)?.join?.(', ') || '-'}</div>
                        </div>
                        : null
                    }
                    <div style={{
                        marginTop: '12px',
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}>
                        <Button onClick={onClose} variant="contained">
                            Back
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ScheduleModal