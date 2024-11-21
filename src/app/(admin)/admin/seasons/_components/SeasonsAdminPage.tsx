"use client";

import { Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import { useRouter } from "next/navigation";
import TableAdmin from "@/components/admin/tableAdmin/TableAdmin";

const SeasonsAdminPage = () => {
    const router = useRouter();

    function handleAddSeason() {
        router.push("/admin/seasons/create");
    }

    const { table } = TableAdmin({
        page: "seasons",
        handleAddItem: handleAddSeason,
    });

    return (
        <Box m="20px">
            <HeaderDashboard title="Seasons" subtitle="List of seasons" />
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default SeasonsAdminPage;
