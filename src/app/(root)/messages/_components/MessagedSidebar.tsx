"use client";

import React from "react";
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";

interface MessagedSidebarProps {
    navigateToSection: (section: string) => void;
}

const MessagedSidebar: React.FC<MessagedSidebarProps> = ({ navigateToSection }) => {
    return (
        <Box sx={{ width: 250 }}>
            <List>
                <ListItemButton onClick={() => navigateToSection("inbox")}>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Inbox" />
                </ListItemButton>
                <ListItemButton onClick={() => navigateToSection("sent")}>
                    <ListItemIcon>
                        <SendIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sent Messages" />
                </ListItemButton>
                <ListItemButton onClick={() => navigateToSection("compose")}>
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
