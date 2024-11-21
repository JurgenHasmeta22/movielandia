"use client";

import { Box } from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import TableAdmin from "@/components/admin/tableAdmin/TableAdmin";

const EpisodesAdminPage = () => {
    const router = useRouter();

    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            { accessorKey: "id", header: "Id", enableHiding: true },
            {
                header: "Title",
                accessorKey: "title",
            },
            {
                header: "Episode Number",
                accessorKey: "episodeNumber",
            },
            {
                header: "Duration",
                accessorKey: "duration",
            },
            {
                accessorKey: "seasonId",
                header: "Season ID",
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

    function handleAddEpisode() {
        router.push("/admin/episodes/create");
    }

    const { table } = TableAdmin({
        columns,
        page: "episodes",
        handleAddItem: handleAddEpisode,
    });

    return (
        <Box m="20px">
            <HeaderDashboard title="Episodes" subtitle="List of episodes" />
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default EpisodesAdminPage;
