import React, { useState } from "react";
import { useTheme } from "@material-ui/styles";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import { FormControl, InputLabel, Select, MenuItem, Button, Divider, TextField, Menu, IconButton, Typography, Fab, Badge } from "@material-ui/core";
import * as Icons from "@material-ui/icons";
import UserAvatar from "../UserAvatar/UserAvatar";
/**
 * 
 * @param {
 * 
 * require * value * items
 * handleChange, addItem
 * 
 * } param0 
 */

const messages = [
    {
        id: 0,
        variant: "warning",
        name: "Jane Hew",
        message: "Hey! How is it going?",
        time: "9:32",
    },
    {
        id: 1,
        variant: "success",
        name: "Lloyd Brown",
        message: "Check out my new Dashboard",
        time: "9:18",
    },
    {
        id: 2,
        variant: "primary",
        name: "Mark Winstein",
        message: "I want rearrange the appointment",
        time: "9:15",
    },
    {
        id: 3,
        variant: "secondary",
        name: "Liana Dutti",
        message: "Good news from sale department",
        time: "9:09",
    },
];
export default function TestCombo({ required = false, ...props }) {
    var classes = useStyles();
    var theme = useTheme();
    var [mailMenu, setMailMenu] = useState(null);

    return (
        <>
            {/* <IconButton
                color="inherit"
                aria-haspopup="true"
                aria-controls="mail-menu"
                onClick={e => {
                    setMailMenu(e.currentTarget);
                    // setIsMailsUnread(false);
                }}
                className={classes.headerMenuButton}
            >
                <Badge
                    color="secondary"
                >
                    <Icons.Mail classes={{ root: classes.headerIcon }} className={classNames(classes.whiteColor)} />
                </Badge>
            </IconButton> */}
            <TextField
                // error
                required
                label={props.title}
                // defaultValue="Hello World"
                // value={props.value}
                // helperText="Incorrect entry."
                // onChange={(e) => props.handleChange(e)}
                onFocus={e => {
                    setMailMenu(e.currentTarget);
                    // setIsMailsUnread(false);
                }}
                
                onClick={() => {
                    setMailMenu(null);
                }}
            />
            <Menu
                id="mail-menu"
                open={Boolean(mailMenu)}
                anchorEl={mailMenu}
                onClose={() => setMailMenu(null)}
                MenuListProps={{ className: classes.headerMenuList }}
                className={classes.headerMenu}
                classes={{ paper: classes.profileMenu }}
                disableAutoFocusItem
            >
                <div className={classes.profileMenuUser}>
                    <Typography variant="h4" weight="medium">
                        New Messages
            </Typography>
                    <Typography
                        className={classes.profileMenuLink}
                        component="a"
                        color="secondary"
                    >
                        {messages.length} New Messages
            </Typography>
                </div>
                {messages.map(message => (
                    <MenuItem key={message.id} className={classes.messageNotification}>
                        <div className={classes.messageNotificationSide}>
                            <UserAvatar color={message.variant} name={message.name} />
                            <Typography size="sm" color="text" colorBrightness="secondary">
                                {message.time}
                            </Typography>
                        </div>
                        <div
                            className={classNames(
                                classes.messageNotificationSide,
                                classes.messageNotificationBodySide,
                            )}
                        >
                            <Typography weight="medium" gutterBottom>
                                {message.name}
                            </Typography>
                            <Typography color="text" colorBrightness="secondary">
                                {message.message}
                            </Typography>
                        </div>
                    </MenuItem>
                ))}
                <Fab
                    variant="extended"
                    color="primary"
                    aria-label="Add"
                    className={classes.sendMessageButton}
                >
                    Send New Message
            <Icons.Send className={classes.sendButtonIcon} />
                </Fab>
            </Menu>

            {/* <FormControl required={required} className={classes.formControl}>
            <InputLabel id="demo-simple-select-required-label">{props.name}</InputLabel>
            <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={props.value}
                onChange={(e) => props.handleChange(e)}
                className={classes.selectEmpty}
                native={false}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {
                    props.items.map((item, i) => {
                        return (
                            <MenuItem key={i} value={item}>{item}</MenuItem>
                        )
                    })
                }
                {props.addbtn && <Divider component="li" />}
                {props.addbtn && <MenuItem button value={'button'} className={classes.addButton}>
                    <AddIcon fontSize='small' />
                        Add New
                </MenuItem>}
            </Select>
        </FormControl> */}
        </>

    );
}
