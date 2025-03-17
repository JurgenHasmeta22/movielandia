"use client";

import { Box, Button, Typography, Stack } from "@mui/material";
import { DeleteForever, DeleteSweep } from "@mui/icons-material";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/helpers/toast";
import { deleteList } from "@/actions/list/list.actions";

interface ListDetailHeaderProps {
    listId: number;
    userId: number;
    listTitle: string;
}

export default function ListDetailHeader({ listId, userId, listTitle }: ListDetailHeaderProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleDeleteAllItems = () => {
        startTransition(async () => {
            try {
                showToast("success", "All items removed from list");
                router.refresh();
            } catch (error) {
                showToast("error", error instanceof Error ? error.message : "Failed to remove items");
            }
        });
    };

    const handleDeleteList = () => {
        startTransition(async () => {
            try {
                await deleteList(listId, userId);
                showToast("success", "List deleted successfully");
                router.back();
                router.refresh();
            } catch (error) {
                showToast("error", error instanceof Error ? error.message : "Failed to delete list");
            }
        });
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
            }}
        >
            <Typography variant="h1" sx={{ fontSize: "1.5rem", fontWeight: 500 }}>
                {listTitle}
            </Typography>
            <Stack direction="row" spacing={1}>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteSweep />}
                    onClick={handleDeleteAllItems}
                    disabled={isPending}
                    sx={{ textTransform: "none" }}
                >
                    Delete All Items
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteForever />}
                    onClick={handleDeleteList}
                    disabled={isPending}
                    sx={{ textTransform: "none" }}
                >
                    Delete List
                </Button>
            </Stack>
        </Box>
    );
}
