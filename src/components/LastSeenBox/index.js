import { makeStyles } from '@material-ui/core';
import React from 'react'
import moment from 'moment'

const useStyles = makeStyles(theme => {
    return {
        container: {
            display: 'flex',
            maxHeight: '300px'
        },
        box: {
            background: 'rgba(217, 217, 217, 0.8)',
            padding: '14px',
            overflowY: 'scroll',
            minWidth: '300px'
        },
        table: {
            borderSpacing: '0 1em',
            width: '100%'
        },
        item: {
            padding: '20px 0'
        },
        name: {
            fontWeight: 'bold',
            paddingRight: '12px'
        },
        time: {}
    }
});

const LastSeenBox = ({data}) => {
    const classes = useStyles()
    return (
        <div className={classes.container}>
            <div className={classes.box}>
                <h3>Last Seen At</h3>
                <table className={classes.table}>
                    {
                        data.map?.(item => {
                            return (
                                <tr className={classes.item}>
                                    <td className={classes.name}>
                                        {item.full_name}
                                    </td>
                                    <td>
                                        {item.lastSeen ? moment(item.lastSeen).format('MMMM Do YYYY, h:mm:ss') : 'Offline'}
                                    </td>
                                </tr>
                            )
                        })
                    }
                </table>
            </div>
        </div>
    )
}

export default LastSeenBox