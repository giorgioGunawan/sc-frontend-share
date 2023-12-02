import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import {isMobile} from 'react-device-detect';

const useStyles = makeStyles(theme => {
    return {
        container: {
            display: 'flex'
        },
        tab: {
            padding: '12px 22px',
            border: '1.5px solid #cacbcd',
            borderRadius: '6px 6px 0 0',
            margin: '0 8px',
            zIndex: '10',
            fontWeight: '700',
            color: '#aeaeaf',
            background: '#eeeff3',
            cursor: 'pointer'
        },
        isActive: {
            borderBottom: '1.5px solid white',
            color: 'black',
            background: 'white'
        },
        content: {
            borderTop: '1.5px solid #cacbcd',
            padding: !isMobile ? '24px 12px' : '10px 10px',
            position: 'relative',
            top: '-1px'
        }
    }});

const Tabs = (props) => {
    const [activeTab, setActiveTab] = useState(0)
    const [renderedComponents, setRenderedComponents] = useState([])
    const items = props.items || []
    const classes = useStyles()

    useEffect(() => {
        if (items.length) {
            const temp = [...renderedComponents]
            temp[activeTab] = items[activeTab].component
            setRenderedComponents(temp)
        }
    }, [activeTab])
    
    return (
        <div>
            <div className={classes.container}>
                {
                    items.map((item, i) => (
                        <div onClick={() => setActiveTab(i)} className={`${classes.tab} ${activeTab === i ? classes.isActive : ''}`}>{item.title}</div>
                    ))
                }
            </div>

            {
                renderedComponents.length && renderedComponents.map((Component, i) => (
                    <div className={classes.content} style={{display: i === activeTab ? 'block' : 'none'}}>
                        {Component}
                    </div>
                ))
            }
        </div>
    )
}

export default Tabs