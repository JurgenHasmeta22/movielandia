"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, FormControl, InputLabel, Select, MenuItem, Button, Stack, Container, Typography } from "@mui/material";
import { SaveOutlined } from "@mui/icons-material";
import { useQueryState } from "nuqs";
import { showToast } from "@/utils/helpers/toast";
import { addItemsToList } from "@/actions/list/listItems.actions";
import SelectableListCard from "@/components/root/selectableListCard/SelectableListCard";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import { updateList } from "@/actions/list/list.actions";

interface AddItemsFormProps {
    items: any[];
    totalPages: number;
    currentPage: number;
    listId: number;
    userId: number;
    listName: string;
}

const CONTENT_TYPES = [
    { label: "Movie", value: "movies" },
    { label: "Serie", value: "series" },
    { label: "Actor", value: "actors" },
    { label: "Crew", value: "crew" },
    { label: "Season", value: "seasons" },
    { label: "Episode", value: "episodes" },
];

export default function AddItemsForm({ items, totalPages, currentPage, listId, userId, listName }: AddItemsFormProps) {
    const router = useRouter();

    const [type, setType] = useQueryState("type", {
        defaultValue: "",
        parse: (value) => value || "",
        history: "push",
        shallow: false,
    });

    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

    const getItemId = (item: any, type: string): number | null => {
        switch (type) {
            case "movies":
                return item?.movie?.id;
            case "series":
                return item?.serie?.id;
            case "seasons":
                return item?.season?.id;
            case "episodes":
                return item?.episode?.id;
            case "actors":
                return item?.actor?.id;
            case "crew":
                return item?.crew?.id;
            default:
                return null;
        }
    };

    const handleTypeChange = async (event: any) => {
        setType(event.target.value);
    };

    const toggleItem = (itemId: number) => {
        const newSelected = new Set(selectedItems);

        if (selectedItems.has(itemId)) {
            newSelected.delete(itemId);
        } else {
            newSelected.add(itemId);
        }

        setSelectedItems(newSelected);
    };

    async function onSave() {
        try {
            await updateList(listId, userId, {
                contentType: type.slice(0, -1) as any,
            });

            await addItemsToList({
                listId,
                userId,
                type: type,
                itemIds: Array.from(selectedItems),
            });

            showToast("success", "Items added successfully");
            router.push(`/users/${userId}/lists/${listId}/${listName}`);
        } catch (error) {
            showToast("error", "Failed to add items to list");
        }
    }

    return (
        <Container maxWidth="md" sx={{ py: 2 }}>
            <Stack spacing={4} alignItems="center">
                <FormControl sx={{ width: { xs: "100%", sm: "400px" } }}>
                    <InputLabel>Content Type</InputLabel>
                    <Select value={type} onChange={handleTypeChange} label="Content Type">
                        {CONTENT_TYPES.map(({ label, value }) => (
                            <MenuItem key={value} value={value}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        width: "100%",
                        justifyContent: "flex-start",
                    }}
                >
                    {items && items.length > 0 ? (
                        items.map((item) => (
                            <SelectableListCard
                                key={item.id}
                                item={item}
                                type={type}
                                isSelected={
                                    (selectedItems.size > 0 && selectedItems.has(getItemId(item, type)!)) ?? false
                                }
                                onToggle={toggleItem}
                            />
                        ))
                    ) : (
                        <Typography
                            variant="body1"
                            sx={{ textAlign: "center", width: "100%", py: 4, color: "text.secondary" }}
                        >
                            No items found for the selected content type
                        </Typography>
                    )}
                </Box>
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 2 }}>
                    <PaginationControl currentPage={currentPage} pageCount={Math.max(1, totalPages)} />
                </Box>
                <Button
                    variant="contained"
                    onClick={onSave}
                    disabled={selectedItems.size === 0}
                    startIcon={<SaveOutlined />}
                    sx={{
                        fontSize: "0.85rem",
                        py: 1,
                        fontWeight: 600,
                        textTransform: "none",
                        minWidth: { xs: "100%", sm: "300px" },
                    }}
                >
                    Save Selected Items
                </Button>
            </Stack>
        </Container>
    );
}
