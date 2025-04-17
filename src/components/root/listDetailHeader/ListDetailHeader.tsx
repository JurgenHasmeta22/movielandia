"use client";

import { Box, Button, Typography, Stack, Chip } from "@mui/material";
import { DeleteForever, DeleteSweep } from "@mui/icons-material";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/helpers/toast";
import { deleteList, getListContentType } from "@/actions/list/list.actions";
import ContentTypeLabel from "../contentTypeLabel/ContentTypeLabel";
import { useEffect, useState } from "react";

interface ListDetailHeaderProps {
    listId: number;
    userId: number;
    listTitle: string;
}

export default function ListDetailHeader({ listId, userId, listTitle }: ListDetailHeaderProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [contentType, setContentType] = useState<any>(null);

    useEffect(() => {
        const fetchContentType = async () => {
            try {
                const type = await getListContentType(listId);
                setContentType(type);
            } catch (error) {
                console.error("Failed to fetch content type:", error);
            }
        };

        fetchContentType();
    }, [listId]);

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
            <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="h1" sx={{ fontSize: "1.5rem", fontWeight: 500 }}>
                    {listTitle}
                </Typography>
                {contentType && (
                    <ContentTypeLabel contentType={contentType} size="medium" />
                )}
            </Stack>
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
