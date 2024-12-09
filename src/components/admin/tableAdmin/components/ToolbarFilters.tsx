"use client";

import { Box, IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
    MRT_GlobalFilterTextField,
    MRT_ShowHideColumnsButton,
    MRT_ToggleDensePaddingButton,
    MRT_ToggleFiltersButton,
    MRT_ToggleFullScreenButton,
    MRT_TableInstance,
} from "material-react-table";

interface ToolbarFiltersProps {
    table: MRT_TableInstance<any>;
    handleFetchData: () => Promise<void>;
}

export const ToolbarFilters = ({ table, handleFetchData }: ToolbarFiltersProps) => (
    <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Tooltip arrow title="Refresh Data">
            <IconButton onClick={handleFetchData}>
                <RefreshIcon />
            </IconButton>
        </Tooltip>
        <MRT_GlobalFilterTextField table={table} />
        <MRT_ToggleFiltersButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
    </Box>
);
