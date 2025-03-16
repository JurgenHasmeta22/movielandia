"use client";

import { useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    TextField,
    Typography,
    Paper,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ListTypeValue } from "@/schemas/list.schema";
import {
    addMovieToList,
    addSerieToList,
    addActorToList,
    addCrewToList,
    addSeasonToList,
    addEpisodeToList,
} from "@/actions/list/listItems.actions";
import { showToast } from "@/utils/helpers/toast";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import { useDebounce } from "@/hooks/useDebounce";

interface AddItemsFormProps {
    listId: number;
    userId: number;
    existingType: ListTypeValue | null;
}

interface ItemType {
    id: number;
    title?: string;
    name?: string;
    photoSrc?: string;
}

const PLAYLIST_TYPES: ListTypeValue[] = ["Movie", "Serie", "Season", "Episode", "Actor", "Crew"];

export default function AddItemsForm({ listId, userId, existingType }: AddItemsFormProps) {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<ListTypeValue | "">("");
    const [searchTerm, setSearchTerm] = useState("");
    const [items, setItems] = useState<ItemType[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);

    const debouncedSearch = useDebounce(searchTerm, 300);

    const handleSearch = async () => {
        if (!debouncedSearch || !selectedType) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/search/${selectedType.toLowerCase()}?q=${debouncedSearch}`);
            const data = await response.json();
            setItems(data);
        } catch (error) {
            showToast("error", "Failed to search items");
        } finally {
            setLoading(false);
        }
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

    const handleSave = async () => {
        if (!selectedType) {
            showToast("error", "Please select a content type");
            return;
        }

        if (selectedItems.size === 0) {
            showToast("error", "Please select at least one item");
            return;
        }

        setLoading(true);
        try {
            const addItemPromises = Array.from(selectedItems).map(async (itemId) => {
                const params = { listId, userId };

                switch (selectedType) {
                    case "Movie":
                        return addMovieToList(itemId, params);
                    case "Serie":
                        return addSerieToList(itemId, params);
                    case "Season":
                        return addSeasonToList(itemId, params);
                    case "Episode":
                        return addEpisodeToList(itemId, params);
                    case "Actor":
                        return addActorToList(itemId, params);
                    case "Crew":
                        return addCrewToList(itemId, params);
                }
            });

            await Promise.all(addItemPromises);
            showToast("success", "Items added successfully");
            router.push(`/users/${userId}/lists/${listId}`);
        } catch (error) {
            showToast("error", "Failed to add items to list");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", width: "100%" }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Add Items to Your List
            </Typography>

            {!existingType && (
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Select Content Type</InputLabel>
                    <Select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as ListTypeValue)}
                        label="Select Content Type"
                    >
                        {PLAYLIST_TYPES.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}s
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            {(selectedType || existingType) && (
                <>
                    <TextField
                        fullWidth
                        label={`Search ${existingType || selectedType}s`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            endAdornment: <SearchIcon sx={{ cursor: "pointer" }} onClick={handleSearch} />,
                        }}
                        sx={{ mb: 3 }}
                    />

                    <Stack spacing={2} sx={{ mb: 3 }}>
                        {items.map((item) => (
                            <Paper
                                key={item.id}
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    "&:hover": { bgcolor: "action.hover" },
                                }}
                                onClick={() => toggleItem(item.id)}
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedItems.has(item.id)}
                                            onChange={() => toggleItem(item.id)}
                                        />
                                    }
                                    label={item.title || item.name || "Untitled"}
                                />
                            </Paper>
                        ))}
                    </Stack>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={loading || selectedItems.size === 0}
                        startIcon={<SaveIcon />}
                        fullWidth
                    >
                        Save Selected Items
                    </Button>
                </>
            )}
        </Box>
    );
}
