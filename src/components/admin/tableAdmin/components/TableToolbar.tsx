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

    const getColumns = (columnVisibility: any) => {
        return Object.keys(columnVisibility)
            .filter((key) => columnVisibility[key])
            .map((key) => {
                return {
                    accessorKey: key,
                    header: table.getColumn(key).header,
                };
            });
    };

    const getFormattedDate = () => {
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };

    const handleExportPDF = () => {
        console.log("Export Data before PDF:", exportData);
        const doc = new jsPDF();

        const rows = exportData.map((row) => {
            return Object.keys(row).map((key) => row[key] ?? "");
        });

        console.log("Rows for PDF:", rows);

        autoTable(doc, {
            head: [Object.keys(exportData[0] || {}).map((key) => key)],
            body: rows,
            styles: {
                cellPadding: 5,
                fontSize: 10,
                overflow: "linebreak",
                halign: "left",
                valign: "middle",
            },
            theme: "striped",
            headStyles: {
                fillColor: [52, 168, 83],
                textColor: 255,
                fontSize: 11,
                fontStyle: "bold",
            },
        });

        const fileName = `data_${getFormattedDate()}.pdf`;
        doc.save(fileName);
    };

    const handleExportCSV = () => {
        const headers = Object.keys(exportData[0] || {}).join(",");
        const csvContent = [headers, ...exportData.map((row) => Object.values(row).join(","))].join("\n");

        console.log("Exporting CSV with content:", csvContent);

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const fileName = `data_${getFormattedDate()}.csv`;
        a.href = url;
        a.download = fileName;
        a.click();
    };

    const handleExportExcel = () => {
        const worksheet = utils.json_to_sheet(exportData);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const fileName = `data_${getFormattedDate()}.xlsx`;
        writeFile(workbook, fileName);
    };

    const handleExport = (format: string) => {
        switch (format) {
            case "pdf":
                handleExportPDF();
                break;
            case "csv":
                handleExportCSV();
                break;
            case "excel":
                handleExportExcel();
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
