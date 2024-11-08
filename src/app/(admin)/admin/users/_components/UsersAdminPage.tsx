"use client";

import { Box } from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import HeaderDashboard from "@/components/admin/ui/headerDashboard/HeaderDashboard";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import TableAdmin from "@/components/admin/ui/tableAdmin/TableAdmin";

const UsersAdminPage = () => {
    const router = useRouter();
    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            { accessorKey: "id", header: "Id", enableHiding: true },
            {
                header: "Username",
                accessorKey: "userName",
            },
            {
                accessorKey: "email",
                header: "Email",
            },
            {
                accessorKey: "password",
                header: "Password",
                enableSorting: false,
                enableColumnFilter: false,
            },
        ],
        [],
    );

    function handleAddUser() {
        router.push("/admin/users/add");
    }

    const { table } = TableAdmin({
        columns,
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
