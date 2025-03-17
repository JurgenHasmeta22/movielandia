"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, FormControl, InputLabel, Select, MenuItem, Button, Stack } from "@mui/material";
import { SaveOutlined } from "@mui/icons-material";
import { useQueryState } from "nuqs";
import { showToast } from "@/utils/helpers/toast";
import { addItemsToList } from "@/actions/list/listItems.actions";
import SelectableListCard from "@/components/root/selectableListCard/SelectableListCard";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";

interface AddItemsFormProps {
    items: any[];
    totalPages: number;
    currentPage: number;
    listId: number;
    userId: number;
}

const CONTENT_TYPES = [
    { label: "Movie", value: "movies" },
    { label: "Serie", value: "series" },
    { label: "Actor", value: "actors" },
    { label: "Crew", value: "crew" },
    { label: "Season", value: "seasons" },
    { label: "Episode", value: "episodes" },
];

export default function AddItemsForm({ items, totalPages, currentPage, listId, userId }: AddItemsFormProps) {
    const router = useRouter();
    const [type, setType] = useQueryState("type", { defaultValue: "movies" });
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);

    const getItemId = (item: any, type: string): number => {
        switch (type) {
            case "movies":
                return item.movie?.id;
            case "series":
                return item.serie?.id;
            case "seasons":
                return item.season?.id;
            case "episodes":
                return item.episode?.id;
            case "actors":
                return item.actor?.id;
            case "crew":
                return item.crew?.id;
            default:
                return item.id;
        }
    };

    const handleTypeChange = async (event: any) => {
        await setType(event.target.value);
        setSelectedItems(new Set());
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
        if (selectedItems.size === 0) {
            showToast("error", "Please select at least one item");
            return;
        }

        setLoading(true);

        try {
            await addItemsToList({
                listId,
                userId,
                type: type,
                itemIds: Array.from(selectedItems),
            });

            showToast("success", "Items added successfully");
            router.push(`/users/${userId}/lists/${listId}`);
        } catch (error) {
            showToast("error", "Failed to add items to list");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box>
            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Content Type</InputLabel>
                <Select value={type} onChange={handleTypeChange} label="Content Type">
                    {CONTENT_TYPES.map(({ label, value }) => (
                        <MenuItem key={value} value={value}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Stack spacing={2} sx={{ mb: 3 }}>
                {items.map((item) => (
                    <SelectableListCard
                        key={item.id}
                        item={item}
                        type={type}
                        isSelected={selectedItems.has(getItemId(item, type))}
                        onToggle={toggleItem}
                    />
                ))}
            </Stack>
            {totalPages > 1 && (
                <Box sx={{ mb: 3 }}>
                    <PaginationControl currentPage={currentPage} pageCount={totalPages} />
                </Box>
            )}
            <Button
                fullWidth
                variant="contained"
                onClick={onSave}
                disabled={loading || selectedItems.size === 0}
                startIcon={<SaveOutlined />}
            >
                Save Selected Items
            </Button>
        </Box>
    );
}
