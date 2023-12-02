import { makeStyles } from '@material-ui/styles';
import React, { useRef, useState } from 'react'
import ExampleData from '../../assets/csv/example_clientview.csv'
import { SERVER_URL } from '../../common/config';
import FileSaver from "file-saver";
import { toast, ToastContainer } from 'react-toastify';
import { Button, CircularProgress } from '@material-ui/core';
import CSVReader from 'react-csv-reader';

const useStyles = makeStyles(theme => {
    return {
        container: {
            display: 'flex',
            flexDirection: 'column'
        },
        item: {
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            padding: '12px 18px',
            border: '1px solid black',
            borderRadius: '9px',
            marginBottom: '18px'
        }
    }
});

const Import = () => {
    const csvRef = useRef(null)
    const classes = useStyles()
    const [isImportLoading, setIsImportLoading] = useState(false)

    const addWithCSV = (data) => {
        const temp = []
        for (let i = 1; i < data.length - 1; i++) {
          const row = data[i];
          if (
              data[0][0] !== 'client_entity_name' ||
              data[0][1] !== 'address' ||
              data[0][2] !== 'phone_number'
            ) {
            toast('format is not valid')
            return false
          }
          if (!row[0]) {
            toast(`client_entity_name cannot be empty`)
            return false
          }
          if (!row[1]) {
            toast(`address cannot be empty`)
            return false
          }
          if (!row[2]) {
            toast(`phone_number cannot be empty`)
            return false
          }
          let saveData = {
            client_entity_name: row[0],
            address: row[1],
            phone_number: row[2],
            approved: 1,
            company_id: row[3] ? parseInt(row[3]) : parseInt(localStorage.getItem('company_id')),
            created_by: parseInt(localStorage.getItem('user_id')),
          }
          // toast(`${data[i]} pada row ${i} tidak boleh kosong`)
          temp.push(saveData)
        }
        const reqOption = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(temp)
        }
        setIsImportLoading(true)
        fetch(`${SERVER_URL}importClient`, reqOption)
          .then(async response => {
            const data = await response.json();
            console.log("Response Data=============>", data)
            // check for error response
            toast('Success import file')
          })
          .catch(error => {
            toast('Something went wrong!\n' + error)
            console.error('There was an error!', error);
          })
          .finally(()=> {
            setIsImportLoading(false)
        });
        csvRef.current.value = ''
    }
    return (
        <>
            <ToastContainer />
            <div className={classes.container}>
                <div className={classes.item}>
                    <h3>Download example data as template</h3>
                    <Button href={ExampleData} download="example_data" variant="outlined" color="primary">
                        Example Data
                    </Button>
                </div>
                <div className={classes.item}>
                    <h3>Import CSV</h3>
                    <Button variant="contained" color="primary" component="label" disabled={isImportLoading}>
                    {
                        isImportLoading
                        ?
                        <CircularProgress size="23px" style={{color: 'white'}} />
                        :
                        'Choose File'
                    }
                    <CSVReader inputRef={csvRef} inputStyle={{display: 'none'}} onFileLoaded={(data) => addWithCSV(data)} />
                </Button>
                </div>
            </div>
        </>
    )
}

export default Import