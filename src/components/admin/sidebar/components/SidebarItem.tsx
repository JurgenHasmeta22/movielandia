"use client";

import { ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface ISidebarItemProps {
    index: number;
    item: any;
    selectedLabel: string;
    handleItemClick: (title: string, to: string, label?: any) => void;
}

export const SidebarItem = ({ index, item, selectedLabel, handleItemClick }: ISidebarItemProps) => {
    const theme = useTheme();

    return (
        <ListItem key={index} value={item.label}>
            <ListItemButton
                sx={{
                    color: theme.vars.palette.greyAccent.main,
                    "&.Mui-selected": {
                        backgroundColor: theme.vars.palette.secondary.light,
                        color: theme.vars.palette.greyAccent.main,
                        "&:hover": {
                            backgroundColor: theme.vars.palette.secondary.light,
                        },
                    },
                    "&:hover": {
                        backgroundColor: theme.vars.palette.secondary.light,
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
    );
};
