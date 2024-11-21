"use client";

import { Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import { useRouter } from "next/navigation";
import TableAdmin from "@/components/admin/tableAdmin/TableAdmin";

const MoviesAdminPage = () => {
    const router = useRouter();

    function handleAddMovie() {
        router.push("/admin/movies/create");
    }

    const { table } = TableAdmin({
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
