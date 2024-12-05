import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
    MRT_GlobalFilterTextField,
    MRT_ShowHideColumnsButton,
    MRT_ToggleDensePaddingButton,
    MRT_ToggleFiltersButton,
    MRT_ToggleFullScreenButton,
} from "material-react-table";

interface RenderTopToolbarProps {
    table: any;
    handleFetchData: () => Promise<void>;
    handleAddItem: () => void;
    handleMassiveDelete: () => void;
}

export const renderTopToolbar = ({
    table,
    handleFetchData,
    handleAddItem,
    handleMassiveDelete,
}: RenderTopToolbarProps) => {
    return (
        <Box
            sx={() => ({
                display: "flex",
                gap: "1rem",
                p: "10px",
                justifyContent: "space-between",
            })}
        >
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
            <Box
                sx={{
                    display: "flex",
                    placeItems: "center",
                    placeContent: "center",
                    gap: "1rem",
                }}
            >
                <Button color="success" onClick={handleAddItem} variant="contained">
                    <Add />
                    <Typography sx={{ textTransform: "capitalize" }}>Add</Typography>
                </Button>
                <Button
                    color="error"
                    disabled={!table.getIsSomeRowsSelected()}
                    onClick={handleMassiveDelete}
                    variant="contained"
                >
                    <Delete />
                    <Typography sx={{ textTransform: "capitalize" }}>Delete</Typography>
                </Button>
            </Box>
        </Box>
    );
};
