"use client";

import { Box } from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import TableAdmin from "@/utils/componentHelpers/TableAdmin";
import HeaderDashboard from "@/components/admin/ui/headerDashboard/HeaderDashboard";

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
        <Box m="20px">
            <HeaderDashboard title="Genres" subtitle="List of Genres" />
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default GenresAdminPage;
