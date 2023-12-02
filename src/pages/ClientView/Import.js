import { makeStyles } from '@material-ui/styles';
import React, { useRef, useState } from 'react'
import ExampleData from '../../assets/csv/example_clientview.csv'
import { SERVER_URL } from '../../common/config';
import FileSaver from "file-saver";
import { toast, ToastContainer } from 'react-toastify';
import { Button, ButtonGroup, CircularProgress, Switch } from '@material-ui/core';
import CSVReader from 'react-csv-reader';
import { CenterFocusStrong } from '@material-ui/icons';

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
        },
        languageOption: {
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          padding: '12px 18px',
          borderRadius: '9px',
          marginBottom: '18px'
      },
      button: {
        fontSize: 11,
        alignItems: 'center',
      }
    }
});

const Import = () => {
    const csvRef = useRef(null)
    const classes = useStyles()
    const [isImportLoading, setIsImportLoading] = useState(false)
    const [state, setState] = useState({
      checked: false,
      language: "bahasa", // default language
   })

    const addWithCSV = (data) => {
        const temp = []
        for (let i = 1; i < data.length; i++) {
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

    const handleChange = (e, field) => {
      setState({ checked: !state.checked });
    }

    const handleClick = (e) => {
      e.preventDefault();
      setState({language: e.currentTarget.value});
    }

    
    return (
        <>
            <ToastContainer />
            <div className={classes.container}>
               <div className={classes.languageOption}>
                  <ButtonGroup>
                      <Button onClick={handleClick} value={"bahasa"}>Bahasa Indonesia</Button>
                      <Button onClick={handleClick} value={"english"}>English</Button>
                  </ButtonGroup>
                </div>
                <div className={classes.item}>
                    <h4>{state.language === "bahasa" ? "1. Unduh data contoh" : "1. Download example data as template"}</h4>
                    <Button className={classes.button} href={ExampleData} download="example_data" variant="outlined" color="primary">
                      {state.language === "bahasa" ? "Unduh Contoh" : "Download Example"}
                    </Button>
                </div>
                <div className={classes.item} style={{display: 'flex', flexDirection: 'column'}}>
                    <h4>{state.language === "bahasa" ? "2. Isi data dengan informasi klien, dan tonton video tutorial jika perlu" : "2. Fill in with client's information, and watch our tutorial if needed"}</h4>
                    <div>
                      {
                        state.language === "bahasa" ? 
                        <div 
                          style={{height: '100%', width: '100%', flexGrow: '1'}}
                          dangerouslySetInnerHTML={{ __html:"<iframe src='https://www.loom.com/embed/91c68d747d04473b8108ea055f2f114f' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen style={{position: 'absolute', width: '100%', height: '100%'}};/>"}}
                        />
                        :
                        
                        <div 
                          style={{height: '100%', width: '100%', flexGrow: '1'}}
                          dangerouslySetInnerHTML={{ __html:"<iframe src='https://www.loom.com/embed/de884a836c9741f3a67ef7cdd5b981bb' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen style={{position: 'absolute', width: '100%', height: '100%'}};/>"}}
                        />

                      }
                    </div>                    
                </div>
                <div className={classes.item}>
                    <h4>{state.language === "bahasa" ? "3. Lalu import file dengan format CSV" : "3. Then import file with CSV format"}</h4>
                    <Button className={classes.button} variant="contained" color="primary" component="label" disabled={isImportLoading}>
                    {
                        isImportLoading
                        ?
                        <CircularProgress size="23px" style={{color: 'white'}} />
                        :
                        state.language === "bahasa" ? "Unggah File (.csv)" : "Upload File (.csv)"
                    }
                    <CSVReader inputRef={csvRef} inputStyle={{display: 'none'}} onFileLoaded={(data) => addWithCSV(data)} />
                </Button>
                </div>
            </div>
        </>
    )
}

export default Import