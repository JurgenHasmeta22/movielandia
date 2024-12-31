"use client";

import React from "react";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import { useQueryState } from "nuqs";

interface MessagedSidebarProps {
    navigateToSection: (section: string) => void;
}

const MessagedSidebar: React.FC<MessagedSidebarProps> = ({ navigateToSection }) => {
    const [section, setSection] = useQueryState("section", {
        defaultValue: "inbox",
        parse: (value) => value || "inbox",
        history: "push",
        shallow: false,
    });

    const theme = useTheme();

    return (
        <Box sx={{ width: 250, display: "flex", flexDirection: "column" }}>
            <List sx={{ flexGrow: 1 }}>
                <ListItemButton
                    onClick={() => navigateToSection("inbox")}
                    sx={{
                        backgroundColor: section === "inbox" ? theme.palette.secondary.light : "transparent",
                        "&:hover": {
                            backgroundColor: theme.palette.secondary.light,
                        },
                    }}
                >
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Inbox" />
                </ListItemButton>
                <ListItemButton
                    onClick={() => navigateToSection("sent")}
                    sx={{
                        backgroundColor: section === "sent" ? theme.palette.secondary.light : "transparent",
                        "&:hover": {
                            backgroundColor: theme.palette.secondary.light,
                        },
                    }}
                >
                    <ListItemIcon>
                        <SendIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sent Messages" />
                </ListItemButton>
                <ListItemButton
                    onClick={() => navigateToSection("compose")}
                    sx={{
                        backgroundColor: section === "compose" ? theme.palette.secondary.light : "transparent",
                        "&:hover": {
                            backgroundColor: theme.palette.secondary.light,
                        },
                    }}
                >
                    <ListItemIcon>
                        <EditIcon />
                    </ListItemIcon>
                    <ListItemText primary="Compose New Message" />
                </ListItemButton>
            </List>
        </Box>
    );
};

export default MessagedSidebar;
