import { Button, CircularProgress, Divider, Grid } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import CustomInput from '../../../components/FormControls/CustomInput'
import PageTitle from '../../../components/PageTitle/PageTitle'
import * as Icons from "@material-ui/icons";
import { SERVER_URL } from '../../../common/config';
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';

const LiveTracking = () => {
    const {company_id} = useParams();
    const [setting, setSetting] = useState({
        company_entity_name: '',
        latitude: '',
        longitude: ''
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e, key) => {
        setSetting({
            ...setting,
            [key]: e.target.value
        })
    }

    const getLiveTrackerSetting = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({company_id})
        }
        fetch(`${SERVER_URL}getLiveTrackerSetting`, requestOptions)
            .then(async response => {
                const data = await response.json();
                setSetting({
                    company_entity_name: data.company_entity_name,
                    latitude: data.latitude,
                    longitude: data.longitude
                })
            })
    }

    const updateLiveTrackerSetting = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                company_id,
                latitude: setting.latitude,
                longitude: setting.longitude, 
            })
        }
        setIsLoading(true)
        fetch(`${SERVER_URL}updateLiveTrackerSetting`, requestOptions)
            .then(async response => {
                toast('Update Success')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    useEffect(() => {
        getLiveTrackerSetting()
    }, [])
    
    return (
        <div>
            <ToastContainer />
            <PageTitle title="Live Tracker Settings" />
            <h3>{setting.company_entity_name}</h3>
            <Grid container spacing={1}>
                <CustomInput title="Latitude" value={setting.latitude} handleChange={(e) => handleChange(e, 'latitude')} />
            </Grid>
            <Grid container spacing={1}>
                <CustomInput title="Longitude" value={setting.longitude} handleChange={(e) => handleChange(e, 'longitude')} />
            </Grid>
            <Grid container spacing={1} style={{marginTop: '12px'}}>
                <Button
                    onClick={updateLiveTrackerSetting}
                    disabled={isLoading}
                    variant="contained"
                    color="primary"
                    startIcon={<Icons.Save />}
                >
                    {
                        isLoading
                        ?
                        <CircularProgress size="23px" style={{color: 'white'}} />
                        :
                        'Save'
                    }
                </Button>
            </Grid>
        </div>
    )
}

export default LiveTracking