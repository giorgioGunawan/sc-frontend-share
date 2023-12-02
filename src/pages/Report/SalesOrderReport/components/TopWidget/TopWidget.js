import React, { useState, useEffect } from "react";
import { Grid, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Paper } from "@material-ui/core";

// styles
import useStyles from "./styles";

// components
import { useHistory, useParams } from "react-router-dom";
import Widget from "../../../../../components/Widget/Widget";

export default function TopWidget({
    data,
    title,
    type,
    ...props
}) {
    var classes = useStyles();
    let history = useHistory();

    useEffect(() => {
    }, [])

    return (
        <Widget title={title} disableWidgetMenu={true}>
            <div>
                <TableContainer>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Ranking</TableCell>
                                <TableCell>{type=="Unit"?'Category Name': 'Name'}</TableCell>
                                <TableCell align="right">Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>{type=="Unit"?row.full_name:row.full_name}</TableCell>
                                    <TableCell align="right">{type=="Unit"?row.net_total+" Units":"Rp " + row.net_total}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Widget>
    );
}
