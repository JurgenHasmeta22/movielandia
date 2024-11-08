"use client";

import { Box } from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import HeaderDashboard from "@/components/admin/ui/headerDashboard/HeaderDashboard";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import TableAdmin from "@/utils/componentHelpers/TableAdmin";

const MoviesAdminPage = () => {
    const router = useRouter();
    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            { accessorKey: "id", header: "Id", enableHiding: true },
            {
                header: "Title",
                accessorKey: "title",
            },
            {
                header: "TrailerSrc",
                accessorKey: "trailerSrc",
            },
            {
                header: "Duration",
                accessorKey: "duration",
            },
            {
                accessorKey: "ratingImdb",
                header: "RatingImdb",
            },
            {
                accessorKey: "dateAired",
                header: "Date aired",
            },
            {
                accessorKey: "description",
                header: "Description",
            },
        ],
        [],
    );

    function handleAddMovie() {
        router.push("/admin/movies/create");
    }

    const { table } = TableAdmin({
        columns,
        page: "movies",
        handleAddItem: handleAddMovie,
    });

    return (
        <>
            <Box m="20px" component={"main"}>
                <HeaderDashboard title="Movies" subtitle="List of Movies" />
                <MaterialReactTable table={table} />
            </Box>
        </>
    );
};

export default MoviesAdminPage;
