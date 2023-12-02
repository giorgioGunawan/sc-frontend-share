import React, { useState, useEffect } from "react";
import { Grid, Container } from "@material-ui/core";

// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./styles";

// components
import Widget from "../../components/Widget/Widget";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { GOOGLE_MAP_API_KEY, SERVER_URL } from "../../common/config";
import { Input, Switch, Typography, Button, TimePicker } from "antd";
import Autocomplete, { usePlacesWidget } from "react-google-autocomplete";
import { useRef } from "react";
import dayjs from "dayjs";

const { Text } = Typography;

function AbsentFeatureDetailPage(props) {
  var classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({});
  const addressInputRef = useRef();

  const { ref: addressRef } = usePlacesWidget({
    apiKey: GOOGLE_MAP_API_KEY,
    onPlaceSelected: (place) => {
      setForm((prev) => ({
        ...prev,
        address: place?.formatted_address,
        latitude: place?.geometry?.location?.lat?.(),
        longitude: place?.geometry?.location?.lng?.(),
      }));
    },
    options: {
      types: ["geocode", "establishment"],
      componentRestrictions: { country: "id" },
    },
  });

  useEffect(() => {
    getCompanyDetail();
  }, []);

  //Show notification
  const notify = (message) => toast(message);

  const getCompanyDetail = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_id: localStorage.getItem("company_id"),
      }),
    };
    fetch(`${SERVER_URL}getCompanyById`, requestOptions).then(
      async (response) => {
        const data = await response.json();
        setForm({
          ...data,
          last_absent_time: dayjs(data.last_absent_time, 'HH:mm')
        });
      }
    );
  };

  const handleInputChange = (key) => (e) => {
    const { value } = e.target;
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTimePicker = (value) => {
    setForm((prev) => ({
      ...prev,
      last_absent_time: value,
    }));
  };

  const onSave = () => {
    setIsLoading(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_id: localStorage.getItem("company_id"),
        absent_feature: form.absent_feature,
        address: form.address,
        latitude: form.latitude,
        longitude: form.longitude,
        last_absent_time: dayjs(form.last_absent_time).format('HH:mm:ss'),
      }),
    };
    fetch(`${SERVER_URL}updateAbsentFeature`, requestOptions)
      .then(async (response) => {
        const data = await response.json();
        notify("Successfully Saved ");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Container>
      <PageTitle title="Absent Feature Detail" />
      <Grid container>
        <ToastContainer />
        <Grid item xs={12} md={12}>
          <Widget title="" disableWidgetMenu>
            <Grid container direction="column" spacing={1}>
              <div className={classes.formControl}>
                <Text className={classes.label}>Address</Text>
                <Input
                  ref={(c) => {
                    addressInputRef.current = c;
                    if (c) addressRef.current = c.input;
                  }}
                  type="input"
                  name="address"
                  placeholder="Address"
                  onChange={handleInputChange("address")}
                  value={form.address}
                />
              </div>
              <div className={classes.formControl}>
                <Text className={classes.label}>Latitude</Text>
                <Input
                  type="input"
                  name="latitude"
                  placeholder="Latitude"
                  onChange={handleInputChange("latitude")}
                  value={form.latitude}
                />
              </div>
              <div className={classes.formControl}>
                <Text className={classes.label}>Longitude</Text>
                <Input
                  type="input"
                  name="longitude"
                  placeholder="Longitude"
                  onChange={handleInputChange("longitude")}
                  value={form.longitude}
                />
              </div>
              <div className={classes.formControl}>
                <Text className={classes.label}>Last Absent Time</Text>
                <div>
                  <TimePicker
                    format="HH:mm"
                    style={{ width: '100%' }}
                    placeholder="Select Time"
                    value={form?.last_absent_time}
                    onChange={handleTimePicker}
                  />
                </div>
              </div>
            </Grid>
            <Grid item style={{ marginTop: "18px" }}>
              <Button
                disabled={isLoading}
                type="primary"
                className={classes.button}
                onClick={() => onSave()}
              >
                Save
              </Button>
            </Grid>
          </Widget>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AbsentFeatureDetailPage;
