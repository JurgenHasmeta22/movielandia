import { Box } from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import HeaderDashboard from "@/components/admin/layout/headerDashboard/HeaderDashboard";
import { useMemo } from "react";
import TableAdmin from "@/utils/TableAdmin";
import { useRouter } from "next/navigation";

const SeriesAdmin = () => {
    const router = useRouter();
    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            { accessorKey: "id", header: "Id", enableHiding: true },
            {
                header: "Title",
                accessorKey: "title",
            },
            {
                accessorKey: "ratingImdb",
                header: "RatingImdb",
            },
            {
                accessorKey: "releaseYear",
                header: "ReleaseYear",
            },
        ],
        [],
    );

    function handleAddSerie() {
        router.push("/admin/series/add");
    }

    const { table } = TableAdmin({
        columns,
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

export default SeriesAdmin;
