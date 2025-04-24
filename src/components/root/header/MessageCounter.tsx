"use client";

import { getUnreadMessagesCount } from "@/actions/user/userMessages.actions";
import { theme } from "@/utils/theme/theme";
import { Badge, IconButton } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import MuiNextLink from "../muiNextLink/MuiNextLink";

interface IMessageCounterProps {
	session: Session | null;
}

export default function MessageCounter({ session }: IMessageCounterProps) {
	const [unreadCount, setUnreadCount] = useState(0);

	useEffect(() => {
		if (session?.user?.id) {
			const fetchUnreadCount = async () => {
				const count = await getUnreadMessagesCount(
					Number(session.user.id),
				);
				setUnreadCount(count);
			};

			fetchUnreadCount();
		}
	}, [session]);

	return (
		<IconButton
			LinkComponent={MuiNextLink}
			href="/messages?section=inbox"
			sx={{
				color: theme.vars.palette.primary.main,
				position: "relative",
			}}
		>
			<Badge badgeContent={unreadCount} color="error">
				<EmailIcon />
			</Badge>
		</IconButton>
	);
}
