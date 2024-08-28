"use client";

import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import HeaderDashboard from "@/components/admin/layout/headerDashboard/HeaderDashboard";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import TableAdmin from "@/utils/componentHelpers/TableAdmin";
import Box from "@mui/material-pigment-css/Box";

const GenresAdminPage = () => {
    const router = useRouter();
    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            { accessorKey: "id", header: "Id", enableHiding: true },
            {
                header: "Name",
                accessorKey: "name",
            },
        ],
        [],
    );

    function handleAddGenre() {
        router.push("/admin/genres/add");
    }

    const { table } = TableAdmin({
        columns,
        page: "genres",
        handleAddItem: handleAddGenre,
    });

    return (
        <Box
            sx={{
                margin: "20px",
            }}
        >
            <HeaderDashboard title="Genres" subtitle="List of Genres" />
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default GenresAdminPage;
