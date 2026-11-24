"use client";

import {
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	useTheme,
} from "@mui/material";
import type { JSX } from "react";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface ISidebarItemProps {
	item: { label: string; to: string; icon: JSX.Element };
	selected: boolean;
	handleItemClick: (to: string) => void;
}

export const SidebarItem = ({
	item,
	selected,
	handleItemClick,
}: ISidebarItemProps) => {
	const theme = useTheme();
	const accentTint = `rgba(${theme.vars.palette.accent.mainChannel} / 0.12)`;

	return (
		<ListItem disablePadding sx={{ mb: 0.5 }}>
			<ListItemButton
				selected={selected}
				onClick={() => handleItemClick(item.to)}
				sx={{
					position: "relative",
					color: "text.secondary",
					"&::before": {
						content: '""',
						position: "absolute",
						left: -12,
						top: "20%",
						bottom: "20%",
						width: 4,
						borderRadius: "0 4px 4px 0",
						backgroundColor: theme.vars.palette.accent.main,
						opacity: selected ? 1 : 0,
						transition: "opacity 200ms ease",
					},
					"&.Mui-selected, &.Mui-selected:hover": {
						backgroundColor: accentTint,
						color: theme.vars.palette.accent.main,
					},
					"&:hover": {
						backgroundColor: accentTint,
						color: "text.primary",
					},
				}}
			>
				<ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
					{item.icon}
				</ListItemIcon>
				<ListItemText
					primary={item.label}
					slotProps={{ primary: { sx: { fontWeight: 600 } } }}
				/>
			</ListItemButton>
		</ListItem>
	);
};
