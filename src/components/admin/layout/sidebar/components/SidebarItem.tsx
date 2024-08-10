"use client";

import { CssVarsTheme, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import React from "react";

export const SidebarItem = ({ index, item, selectedLabel, handleItemClick, isEmployee }: any) => {
    const theme: CssVarsTheme = useTheme();

    return (
        <React.Fragment key={index}>
            <ListItem value={item.label}>
                <ListItemButton
                    disabled={isEmployee && item.label === "Perdoruesit"}
                    sx={{
                        color: theme.vars.palette.greyAccent.main,
                        "&.Mui-selected": {
                            backgroundColor: theme.vars.palette.primary.dark,
                            color: theme.vars.palette.greyAccent.main,
                            "&:hover": {
                                backgroundColor: theme.vars.palette.primary.dark,
                            },
                        },
                        "&:hover": {
                            backgroundColor: theme.vars.palette.primary.dark,
                            "& .MuiListItemIcon-root": {
                                color: theme.vars.palette.greyAccent.main,
                            },
                            "& .MuiListItemText-primary": {
                                color: theme.vars.palette.greyAccent.main,
                            },
                        },
                    }}
                    selected={selectedLabel === item.label}
                    onClick={() => {
                        handleItemClick(item.label, item.to, { label: item.label, index });
                    }}
                >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                </ListItemButton>
            </ListItem>
        </React.Fragment>
    );
};
