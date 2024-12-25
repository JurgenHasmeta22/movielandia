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
        <Box sx={{ width: 250 }}>
            <List>
                <ListItemButton
                    onClick={() => navigateToSection("inbox")}
                    sx={{
                        backgroundColor:
                            currentSection === "inbox" ? theme.vars.palette.secondary.light : "transparent",
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
                        backgroundColor: currentSection === "sent" ? theme.vars.palette.secondary.light : "transparent",
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
                            currentSection === "compose" ? theme.vars.palette.secondary.light : "transparent",
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
