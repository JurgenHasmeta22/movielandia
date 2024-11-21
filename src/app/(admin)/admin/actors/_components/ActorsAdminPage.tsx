"use client";

import { Box } from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import TableAdmin from "@/components/admin/tableAdmin/TableAdmin";

const ActorsAdminPage = () => {
    const router = useRouter();

    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            { accessorKey: "id", header: "Id", enableHiding: true },
            {
                header: "Name",
                accessorKey: "name",
            },
            {
                header: "Biography",
                accessorKey: "biography",
            },
            {
                header: "Birth Date",
                accessorKey: "birthDate",
            },
            {
                header: "Birth Place",
                accessorKey: "birthPlace",
            },
            {
                header: "Image URL",
                accessorKey: "imageUrl",
            },
        ],
        [],
    );

    function handleAddActor() {
        router.push("/admin/actors/create");
    }

    const { table } = TableAdmin({
        columns,
        page: "actors",
        handleAddItem: handleAddActor,
    });

    return (
        <Box m="20px">
            <HeaderDashboard title="Actors" subtitle="List of actors" />
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default ActorsAdminPage;
