"use client";

import { Box } from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import TableAdmin from "@/components/admin/tableAdmin/TableAdmin";

const SeasonsAdminPage = () => {
    const router = useRouter();

    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            { accessorKey: "id", header: "Id", enableHiding: true },
            {
                header: "Title",
                accessorKey: "title",
            },
            {
                header: "Season Number",
                accessorKey: "seasonNumber",
            },
            {
                header: "Series ID",
                accessorKey: "serieId",
            },
            {
                accessorKey: "description",
                header: "Description",
            },
            {
                accessorKey: "dateAired",
                header: "Date Aired",
            },
        ],
        [],
    );

    function handleAddSeason() {
        router.push("/admin/seasons/create");
    }

    const { table } = TableAdmin({
        columns,
        page: "seasons",
        handleAddItem: handleAddSeason,
    });

    return (
        <Box m="20px">
            <HeaderDashboard title="Seasons" subtitle="Managing seasons" />
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default SeasonsAdminPage;
