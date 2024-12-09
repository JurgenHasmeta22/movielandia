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
            .filter((column) => 
                column.getIsVisible() && 
                !['mrt-row-actions', 'select', 'mrt-row-expand', 'mrt-row-select', 'Actions'].includes(column.id)
            )
            .map((column) => ({
                accessorKey: column.id,
                header: column.columnDef.header?.toString() || column.id,
            }));
    };

    const prepareExportData = () => {
        const visibleColumns = getVisibleColumns().filter(column => 
            !['mrt-row-actions', 'select', 'mrt-row-expand', 'mrt-row-select'].includes(column.accessorKey)
        );

        return table.getRowModel().rows.map((row: MRT_Row<any>) => {
            const rowData: Record<string, any> = {};
            rowData['ID'] = row.original.id;
            
            visibleColumns.forEach((column) => {
                const value = row.getValue(column.accessorKey);
                rowData[column.header] = value !== null && value !== undefined ? value : "";
            });

            return rowData;
        });
    };

    const handleExportPDF = () => {
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a3"
        });
        
        const exportData = prepareExportData();
        const visibleColumns = getVisibleColumns().filter(column => 
            !['mrt-row-actions', 'select', 'mrt-row-expand', 'mrt-row-select', 'Actions'].includes(column.accessorKey)
        );

        const headers = ['ID', ...visibleColumns.map((col) => col.header)];
        const rows = exportData.map((row) =>
            headers.map(header => {
                const value = row[header];
                return value !== null && value !== undefined ? String(value) : "";
            })
        );

        const getColumnWidths = () => {
            const widths: { [key: number]: number } = {};

            headers.forEach((header, index) => {
                const maxLength = Math.max(
                    header.length,
                    ...rows.map(row => String(row[index]).length)
                );

                widths[index] = Math.min(Math.max(maxLength * 2.5, 20), 50);
            });

            return widths;
        };

        doc.setFontSize(16);
        doc.text("Export Data", 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

        autoTable(doc, {
            head: [headers],
            body: rows,
            startY: 35,
            styles: {
                fontSize: 7,
                cellPadding: 1.5,
                lineWidth: 0.5,
                lineColor: [80, 80, 80],
                overflow: 'linebreak',
            },
            headStyles: {
                fillColor: [48, 150, 159],
                textColor: 255,
                fontSize: 8,
                fontStyle: "bold",
                halign: "left",
                cellPadding: 2,
                lineWidth: 0.5,
                lineColor: [80, 80, 80],
                minCellWidth: 15,
            },
            bodyStyles: {
                halign: "left",
                valign: "middle",
                cellPadding: 2,
                fontSize: 7,
                lineWidth: 0.5,
                lineColor: [80, 80, 80],
            },
            columnStyles: headers.reduce(
                (acc, _, index) => {
                    acc[index] = {
                        cellWidth: getColumnWidths()[index],
                        minCellWidth: 15,
                        maxCellWidth: 50,
                        cellPadding: 2,
                        overflow: 'linebreak',
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
            tableWidth: 'auto',
            didParseCell: function (data) {
                if (data.section === "head") {
                    data.cell.styles.fillColor = [48, 150, 159];
                    data.cell.styles.textColor = 255;
                    data.cell.styles.fontSize = 8;
                    data.cell.styles.fontStyle = "bold";
                }
                
                if (Array.isArray(data.cell.text)) {
                    data.cell.text = data.cell.text.map(text => 
                        text.length > 50 ? text.slice(0, 47) + '...' : text
                    );
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
