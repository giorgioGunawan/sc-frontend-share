import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";

// styles
import useStyles from "./styles";

// components
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Widget from "../../../../components/Widget/Widget";
import { Doughnut } from 'react-chartjs-2';

const data = {
  labels: [
    'Red',
    'Green',
    'Yellow'
  ],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: [
      '#F03434',
      '#0198C9',
      '#70A456'
    ],
    hoverBackgroundColor: [
      '#FF6384',
      '#00A3EE',
      '#5BA437'
    ],
    borderWidth: 0.8,
    weight: 0.5,
  }]
};

const options = {
  cutoutPercentage: 80,
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 4,
}

export default function DoughnutWidget(props) {
  var classes = useStyles();
  let history = useHistory();
  const invoiceData = useSelector(state => state.invoice);
  const { invoice } = useParams();

  useEffect(() => {
    //console.log(invoiceData.data[invoice]);
  }, [])

  return (
    <Widget title="Income By Category" menuItems={["View", "Edit"]}>
      <Doughnut data={data} options={options}/>
    </Widget>
  );
}
