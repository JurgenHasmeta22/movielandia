import { MRT_ColumnDef } from "material-react-table";
import { Crew } from "@prisma/client";

export const crewColumns: MRT_ColumnDef<Crew>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "fullname",
        header: "Full Name",
    },
    {
        accessorKey: "photoSrc",
        header: "Photo Source",
    },
    {
        accessorKey: "photoSrcProd",
        header: "Production Photo",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "debut",
        header: "Debut",
    },
];
