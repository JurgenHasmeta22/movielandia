"use client";

import { Box } from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import TableAdmin from "@/components/admin/tableAdmin/TableAdmin";

const SeriesAdminPage = () => {
    const router = useRouter();
    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            { accessorKey: "id", header: "Id", enableHiding: true },
            {
                header: "Title",
                accessorKey: "title",
            },
            {
                accessorKey: "ratingImdb",
                header: "RatingImdb",
            },
            {
                accessorKey: "dateAired",
                header: "Date aired",
            },
        ],
        [],
    );

    function handleAddSerie() {
        router.push("/admin/series/add");
    }

    const { table } = TableAdmin({
        columns,
        page: "series",
        handleAddItem: handleAddSerie,
    });

    return (
        <Box m="20px">
            <HeaderDashboard title="Series" subtitle="List of Series" />
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default SeriesAdminPage;
