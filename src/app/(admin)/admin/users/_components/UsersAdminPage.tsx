"use client";

import { Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import { useRouter } from "next/navigation";
import TableAdmin from "@/components/admin/tableAdmin/TableAdmin";

const UsersAdminPage = () => {
    const router = useRouter();

    function handleAddUser() {
        router.push("/admin/users/create");
    }

    const { table } = TableAdmin({
        page: "users",
        handleAddItem: handleAddUser,
    });

    return (
        <Box m="20px" component={"main"}>
            <HeaderDashboard title="Users" subtitle="List of Users" />
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default UsersAdminPage;
