"use client";

import { Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import { useRouter } from "next/navigation";
import TableAdmin from "@/components/admin/tableAdmin/TableAdmin";

const PersonsAdminPage = () => {
    const router = useRouter();

    function handleAddPerson() {
        router.push("/admin/persons/create");
    }

    const { table } = TableAdmin({
        page: "persons",
        handleAddItem: handleAddPerson,
    });

    return (
        <Box m="20px">
            <HeaderDashboard title="Persons" subtitle="List of persons" />
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default PersonsAdminPage;
