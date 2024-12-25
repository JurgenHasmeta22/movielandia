"use client";

import React from "react";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import { useSearchParams } from "next/navigation";

interface MessagedSidebarProps {
    navigateToSection: (section: string) => void;
}

const MessagedSidebar: React.FC<MessagedSidebarProps> = ({ navigateToSection }) => {
    const searchParams = useSearchParams();
    const currentSection = searchParams.get("section") || "inbox";
    const theme = useTheme();

    return (
        <Box sx={{ width: 250, display: 'flex', flexDirection: 'column'}}>
            <List sx={{ flexGrow: 1 }}>
                <ListItemButton
                    onClick={() => navigateToSection("inbox")}
                    sx={{
                        backgroundColor:
                            currentSection === "inbox" ? theme.palette.secondary.light : "transparent",
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
                        backgroundColor:
                            currentSection === "sent" ? theme.palette.secondary.light : "transparent",
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
                        backgroundColor:
                            currentSection === "compose" ? theme.palette.secondary.light : "transparent",
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
