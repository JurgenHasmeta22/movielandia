"use client";

import { Box, Button } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { MRT_TableInstance } from "material-react-table";

interface ToolbarActionsProps {
	table: MRT_TableInstance<any>;
	handleAddItem: () => void;
	handleMassiveDelete: () => void;
}

export const ToolbarActions = ({
	table,
	handleAddItem,
	handleMassiveDelete,
}: ToolbarActionsProps) => (
	<Box sx={{ display: "flex", gap: "1rem" }}>
		<Button
			color="primary"
			onClick={handleAddItem}
			variant="contained"
			startIcon={<Add />}
		>
			Add
		</Button>
		<Button
			color="error"
			disabled={Object.keys(table.getState().rowSelection).length === 0}
			onClick={handleMassiveDelete}
			variant="outlined"
			startIcon={<Delete />}
		>
			Delete
		</Button>
	</Box>
);
