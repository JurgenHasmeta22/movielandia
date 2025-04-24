"use client";

import { Button, Menu, MenuItem, ListItemIcon, Theme } from "@mui/material";
import { SaveAlt, PictureAsPdf, TableChart } from "@mui/icons-material";

interface ExportMenuProps {
	anchorEl: HTMLElement | null;
	setAnchorEl: (anchor: HTMLElement | null) => void;
	handleExport: (format: "pdf" | "csv" | "excel") => void;
	theme: Theme;
}

export const ExportMenu = ({
	anchorEl,
	setAnchorEl,
	handleExport,
	theme,
}: ExportMenuProps) => (
	<>
		<Button
			variant="contained"
			color="primary"
			onClick={(e) => setAnchorEl(e.currentTarget)}
			startIcon={<SaveAlt />}
			sx={{
				height: "36px",
				backgroundColor: theme.vars.palette.secondary.main,
				color: theme.vars.palette.common.white,
				"&:hover": {
					backgroundColor: theme.vars.palette.primary.dark,
				},
			}}
		>
			Export
		</Button>
		<Menu
			anchorEl={anchorEl}
			open={Boolean(anchorEl)}
			onClose={() => setAnchorEl(null)}
			sx={{
				"& .MuiPaper-root": {
					backgroundColor: theme.vars.palette.background.paper,
					boxShadow: theme.shadows[3],
				},
			}}
		>
			{[
				{ format: "pdf", label: "PDF", Icon: PictureAsPdf },
				{ format: "csv", label: "CSV", Icon: TableChart },
				{ format: "excel", label: "Excel", Icon: SaveAlt },
			].map(({ format, label, Icon }) => (
				<MenuItem
					key={format}
					onClick={() =>
						handleExport(format as "pdf" | "csv" | "excel")
					}
					sx={{
						"&:hover": {
							backgroundColor: theme.vars.palette.action.hover,
						},
					}}
				>
					<ListItemIcon>
						<Icon sx={{ color: theme.vars.palette.primary.main }} />
					</ListItemIcon>
					Export to {label}
				</MenuItem>
			))}
		</Menu>
	</>
);
