"use client";

import { Box, Button, IconButton, Tooltip, Typography, Menu, MenuItem, ListItemIcon } from "@mui/material";
import { Add, Delete, SaveAlt, PictureAsPdf, TableChart } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
    MRT_GlobalFilterTextField,
    MRT_ShowHideColumnsButton,
    MRT_ToggleDensePaddingButton,
    MRT_ToggleFiltersButton,
    MRT_ToggleFullScreenButton,
    MRT_TableInstance,
    MRT_Row,
} from "material-react-table";
import { useState, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { utils, writeFile } from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface TableToolbarProps {
    table: MRT_TableInstance<any>;
    handleFetchData: () => Promise<void>;
    handleAddItem: () => void;
    handleMassiveDelete: () => void;
}

export const TableToolbar = ({ table, handleFetchData, handleAddItem, handleMassiveDelete }: TableToolbarProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const theme = useTheme();
    const exportData = useMemo(() => table.getRowModel().rows.map((row: MRT_Row<any>) => row.original), [table]);

    const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleExport = (format: string) => {
        switch (format) {
            case "csv":
                const csvContent = exportData.map((row) => Object.values(row).join(",")).join("\n");
                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "export.csv";
                a.click();
                break;
            case "pdf":
                const doc = new jsPDF();
                const columns = table.getAllColumns().map((col) => ({ header: col.columnDef.header, dataKey: col.id }));
                const rows = exportData.map((row) => {
                    const rowData: any = {};
                    columns.forEach((col) => {
                        rowData[col.dataKey] = row[col.dataKey];
                    });

                    return rowData;
                });

                autoTable(doc, {
                    columns,
                    body: rows,
                });

                doc.save("export.pdf");
                break;
            case "excel":
                const worksheet = utils.json_to_sheet(exportData);
                const workbook = utils.book_new();
                utils.book_append_sheet(workbook, worksheet, "Sheet1");
                writeFile(workbook, "export.xlsx");
                break;
            default:
                break;
        }

        handleClose();
    };

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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleExportClick}
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
                    open={open}
                    onClose={handleClose}
                    sx={{
                        "& .MuiPaper-root": {
                            backgroundColor: theme.vars.palette.background.paper,
                            boxShadow: theme.shadows[3],
                        },
                    }}
                >
                    <MenuItem
                        onClick={() => handleExport("csv")}
                        sx={{
                            "&:hover": {
                                backgroundColor: theme.vars.palette.action.hover,
                            },
                        }}
                    >
                        <ListItemIcon>
                            <TableChart sx={{ color: theme.vars.palette.primary.main }} />
                        </ListItemIcon>
                        Export to CSV
                    </MenuItem>
                    <MenuItem
                        onClick={() => handleExport("pdf")}
                        sx={{
                            "&:hover": {
                                backgroundColor: theme.vars.palette.action.hover,
                            },
                        }}
                    >
                        <ListItemIcon>
                            <PictureAsPdf sx={{ color: theme.vars.palette.primary.main }} />
                        </ListItemIcon>
                        Export to PDF
                    </MenuItem>
                    <MenuItem
                        onClick={() => handleExport("excel")}
                        sx={{
                            "&:hover": {
                                backgroundColor: theme.vars.palette.action.hover,
                            },
                        }}
                    >
                        <ListItemIcon>
                            <SaveAlt sx={{ color: theme.vars.palette.primary.main }} />
                        </ListItemIcon>
                        Export to Excel
                    </MenuItem>
                </Menu>
                <Button color="success" onClick={handleAddItem} variant="contained" startIcon={<Add />}>
                    <Typography sx={{ textTransform: "capitalize" }}>Add</Typography>
                </Button>
                <Button
                    color="error"
                    disabled={Object.keys(table.getState().rowSelection).length === 0}
                    onClick={handleMassiveDelete}
                    variant="contained"
                    startIcon={<Delete />}
                >
                    <Typography sx={{ textTransform: "capitalize" }}>Delete</Typography>
                </Button>
            </Box>
        </Box>
    );
};
