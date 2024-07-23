"use client";

import { Box } from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import HeaderDashboard from "@/components/admin/layout/headerDashboard/HeaderDashboard";
import { useMemo } from "react";
import TableAdmin from "@/utils/other/TableAdmin";
import { useRouter } from "next/navigation";

const GenresAdmin = () => {
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
        <Box m="20px">
            <HeaderDashboard title="Genres" subtitle="List of Genres" />
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default GenresAdmin;
