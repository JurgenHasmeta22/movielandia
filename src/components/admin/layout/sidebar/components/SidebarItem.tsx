"use client"

import { ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import React from "react";
import { tokens } from "@/utils/theme";

export const SidebarItem = ({ index, item, selectedLabel, handleItemClick, isEmployee }: any) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <React.Fragment key={index}>
            <ListItem value={item.label}>
                <ListItemButton
                    disabled={isEmployee && item.label === "Perdoruesit"}
                    sx={{
                        color: colors.grey[1500],
                        "&.Mui-selected": {
                            backgroundColor: colors.primary[1000],
                            color: colors.grey[1400],
                            "&:hover": {
                                backgroundColor: colors.primary[1100],
                            },
                        },
                        "&:hover": {
                            backgroundColor: colors.primary[1000],
                            "& .MuiListItemIcon-root": {
                                color: colors.grey[1400],
                            },
                            "& .MuiListItemText-primary": {
                                color: colors.grey[1400],
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
