"use client";

import { Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import { useRouter } from "next/navigation";
import TableAdmin from "@/components/admin/tableAdmin/TableAdmin";

const SeriesAdminPage = () => {
    const router = useRouter();

    function handleAddSerie() {
        router.push("/admin/series/create");
    }

    const { table } = TableAdmin({
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
