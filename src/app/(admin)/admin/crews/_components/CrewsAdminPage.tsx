"use client";

import { Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import { useRouter } from "next/navigation";
import TableAdmin from "@/components/admin/tableAdmin/TableAdmin";

const CrewsAdminPage = () => {
    const router = useRouter();

    function handleAddCrew() {
        router.push("/admin/crews/create");
    }

    const { table } = TableAdmin({
        page: "crews",
        handleAddItem: handleAddCrew,
    });

    return (
        <>
            <Box m="20px" component={"main"}>
                <HeaderDashboard title="Crews" subtitle="List of crews" />
                <MaterialReactTable table={table} />
            </Box>
        </>
    );
};

export default CrewsAdminPage;
