import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";

// styles
import useStyles from "./styles";

// components
import { useHistory, useParams } from "react-router-dom";
import Widget from "../../../../../components/Widget/Widget";
import { Line } from 'react-chartjs-2';

export default function CashFlow({
    title,
    data,
    ...props
}) {
    var classes = useStyles();
    let history = useHistory();

    useEffect(() => {
    }, [])

    return (
        <Widget title={title} disableWidgetMenu={true}>
            <div>
                <Line data={data} />
            </div>
        </Widget>
    );
}
