"use client";

import { Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useRouter } from "next/navigation";
import TableAdmin from "@/components/admin/tableAdmin/TableAdmin";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";

const GenresAdminPage = () => {
    const router = useRouter();

    function handleAddGenre() {
        router.push("/admin/genres/create");
    }

    const { table } = TableAdmin({
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
