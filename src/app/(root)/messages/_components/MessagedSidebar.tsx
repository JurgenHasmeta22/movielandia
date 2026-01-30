"use client";

import React from "react";
import {
	Box,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	useTheme,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import { useQueryState } from "nuqs";

interface MessagedSidebarProps {
	navigateToSection: (section: string) => void;
}

const MessagedSidebar: React.FC<MessagedSidebarProps> = ({
	navigateToSection,
}) => {
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
						backgroundColor:
							section === "inbox"
								? theme.vars.palette.primary.dark
								: "transparent",
						color:
							section === "inbox"
								? theme.vars.palette.common.white
								: theme.vars.palette.text.primary,
						"&:hover": {
							backgroundColor: theme.vars.palette.primary.main,
							color: theme.vars.palette.common.white,
						},
						"& .MuiListItemIcon-root": {
							color:
								section === "inbox"
									? theme.vars.palette.common.white
									: theme.vars.palette.text.primary,
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
							section === "sent"
								? theme.vars.palette.primary.dark
								: "transparent",
						color:
							section === "sent"
								? theme.vars.palette.common.white
								: theme.vars.palette.text.primary,
						"&:hover": {
							backgroundColor: theme.vars.palette.primary.main,
							color: theme.vars.palette.common.white,
						},
						"& .MuiListItemIcon-root": {
							color:
								section === "sent"
									? theme.vars.palette.common.white
									: theme.vars.palette.text.primary,
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
							section === "compose"
								? theme.vars.palette.primary.dark
								: "transparent",
						color:
							section === "compose"
								? theme.vars.palette.common.white
								: theme.vars.palette.text.primary,
						"&:hover": {
							backgroundColor: theme.vars.palette.primary.main,
							color: theme.vars.palette.common.white,
						},
						"& .MuiListItemIcon-root": {
							color:
								section === "compose"
									? theme.vars.palette.common.white
									: theme.vars.palette.text.primary,
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
