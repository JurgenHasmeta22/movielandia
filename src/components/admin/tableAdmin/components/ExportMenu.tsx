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
			variant="outlined"
			color="primary"
			onClick={(e) => setAnchorEl(e.currentTarget)}
			startIcon={<SaveAlt />}
			sx={{ height: "40px" }}
		>
			Export
		</Button>
		<Menu
			anchorEl={anchorEl}
			open={Boolean(anchorEl)}
			onClose={() => setAnchorEl(null)}
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
				>
					<ListItemIcon>
						<Icon sx={{ color: theme.vars.palette.accent.main }} />
					</ListItemIcon>
					Export to {label}
				</MenuItem>
			))}
		</Menu>
	</>
);
