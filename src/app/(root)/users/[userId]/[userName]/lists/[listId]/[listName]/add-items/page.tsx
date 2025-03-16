import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Box } from "@mui/material";
import { notFound } from "next/navigation";
import AddItemsForm from "./_components/AddItemsForm";
import { getListForAddItems } from "@/actions/list/list.actions";

export const metadata: Metadata = {
    title: "Add Items to List | MovieLandia24",
    description: "Add items to your list",
};

export default async function AddListItemsPage({ params }: { params: { listId: string; userId: string } }) {
    const session = await getServerSession(authOptions);
    const result = await getListForAddItems(parseInt(params.listId));

    if (!result) {
        notFound();
    }

    const { list, existingType } = result;

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                pt: { xs: 8, sm: 10 },
                px: { xs: 2, sm: 4 },
                pb: 4,
                bgcolor: "background.default",
            }}
        >
            <AddItemsForm
                listId={parseInt(params.listId)}
                userId={parseInt(params.userId)}
                existingType={existingType}
            />
        </Box>
    );
}
