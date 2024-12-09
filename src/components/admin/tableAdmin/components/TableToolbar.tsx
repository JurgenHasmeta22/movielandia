"use client";

import { Box } from "@mui/material";
import { MRT_TableInstance, MRT_Row } from "material-react-table";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { utils, writeFile } from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ExportMenu } from "./ExportMenu";
import { ToolbarActions } from "./ToolbarActions";
import { ToolbarFilters } from "./ToolbarFilters";

interface TableToolbarProps {
    table: MRT_TableInstance<any>;
    handleFetchData: () => Promise<void>;
    handleAddItem: () => void;
    handleMassiveDelete: () => void;
}

export const TableToolbar = ({ table, handleFetchData, handleAddItem, handleMassiveDelete }: TableToolbarProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();

    const getVisibleColumns = () => {
        return table
            .getAllColumns()
            .filter((column) => column.getIsVisible())
            .map((column) => ({
                accessorKey: column.id,
                header: column.columnDef.header?.toString() || column.id,
            }));
    };

    const prepareExportData = () => {
        const visibleColumns = getVisibleColumns();

        return table.getRowModel().rows.map((row: MRT_Row<any>) => {
            const rowData: Record<string, any> = {};
            visibleColumns.forEach((column) => {
                const value = row.getValue(column.accessorKey);
                rowData[column.header] = value !== null && value !== undefined ? value : "";
            });

            return rowData;
        });
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const exportData = prepareExportData();
        const visibleColumns = getVisibleColumns();

        const headers = visibleColumns.map((col) => col.header);
        const rows = exportData.map((row) =>
            visibleColumns.map((col) => {
                const value = row[col.header];
                return value !== null && value !== undefined ? String(value) : "";
            }),
        );

        doc.setFontSize(16);
        doc.text("Export Data", 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

        autoTable(doc, {
            head: [headers],
            body: rows,
            startY: 35,
            styles: {
                fontSize: 8,
                cellPadding: 2,
                lineWidth: 0.5,
                lineColor: [80, 80, 80],
            },
            headStyles: {
                fillColor: [48, 150, 159],
                textColor: 255,
                fontSize: 9,
                fontStyle: "bold",
                halign: "left",
                cellPadding: 3,
                lineWidth: 0.5,
                lineColor: [80, 80, 80],
                minCellWidth: 30,
            },
            bodyStyles: {
                halign: "left",
                valign: "middle",
                cellPadding: 3,
                lineWidth: 0.5,
                lineColor: [80, 80, 80],
            },
            columnStyles: headers.reduce(
                (acc, _, index) => {
                    acc[index] = {
                        cellWidth: "auto",
                        minCellWidth: 30,
                        maxCellWidth: 100,
                        cellPadding: 3,
                    };
                    return acc;
                },
                {} as Record<number, any>,
            ),
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
            margin: { top: 35, left: 10, right: 10 },
            theme: "grid",
            tableWidth: "auto",
            didParseCell: function (data) {
                if (data.section === "head") {
                    data.cell.styles.fillColor = [48, 150, 159];
                    data.cell.styles.textColor = 255;
                    data.cell.styles.fontSize = 9;
                    data.cell.styles.fontStyle = "bold";
                }
            },
            didDrawCell: function (data) {
                if (data.cell.raw) {
                    const { x, y, width, height } = data.cell;
                    doc.setDrawColor(80, 80, 80);
                    doc.setLineWidth(0.5);
                    doc.rect(x, y, width, height);
                }
            },
        });

        const fileName = `export_${new Date().toISOString().split("T")[0]}.pdf`;
        doc.save(fileName);
    };

    const handleExportCSV = () => {
        const exportData = prepareExportData();
        const headers = Object.keys(exportData[0] || {});
        const csvContent = [
            headers.join(","),
            ...exportData.map((row) =>
                headers
                    .map((header) => {
                        const value = row[header];
                        return value !== null && value !== undefined ? `"${value}"` : '""';
                    })
                    .join(","),
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);
        link.download = `export_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
    };

    const handleExportExcel = () => {
        const exportData = prepareExportData();
        const worksheet = utils.json_to_sheet(exportData);
        const workbook = utils.book_new();

        utils.book_append_sheet(workbook, worksheet, "Data");
        writeFile(workbook, `export_${new Date().toISOString().split("T")[0]}.xlsx`);
    };

    const handleExport = (format: "pdf" | "csv" | "excel") => {
        const exportHandlers = {
            pdf: handleExportPDF,
            csv: handleExportCSV,
            excel: handleExportExcel,
        };

        exportHandlers[format]();
        setAnchorEl(null);
    };

    return (
        <Box
            sx={{
                display: "flex",
                gap: "1rem",
                p: "10px",
                justifyContent: "space-between",
            }}
        >
            <ToolbarFilters table={table} handleFetchData={handleFetchData} />
            <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <ExportMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} handleExport={handleExport} theme={theme} />
                <ToolbarActions table={table} handleAddItem={handleAddItem} handleMassiveDelete={handleMassiveDelete} />
            </Box>
        </Box>
    );
};
