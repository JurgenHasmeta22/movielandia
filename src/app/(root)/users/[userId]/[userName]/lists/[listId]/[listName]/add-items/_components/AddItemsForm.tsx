"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
    Box, 
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    Button,
    Pagination,
} from "@mui/material";
import { SaveOutlined } from "@mui/icons-material";
import { useQueryState } from "nuqs";
import { showToast } from "@/utils/helpers/toast";
import { addItemsToList } from "@/actions/list/listItems.actions";
import ListCard from "@/components/root/listCard/ListCard";

interface AddItemsFormProps {
    items: any[];
    totalPages: number;
    currentPage: number;
    listId: number;
    userId: number;
}

const CONTENT_TYPES = ["Movie", "Serie", "Actor", "Crew", "Season", "Episode"];

export default function AddItemsForm({
    items,
    totalPages,
    currentPage,
    listId,
    userId
}: AddItemsFormProps) {
    const router = useRouter();
    
    const [type, setType] = useQueryState("type", {
        defaultValue: "movies",
        parse: (value) => value || "movies",
        history: "push",
        shallow: false,
    });

    const [page, setPage] = useQueryState("page", {
        defaultValue: 1,
        parse: (value) => value || 1,
        history: "push",
        shallow: false,
    });

    const [selectedItems, setSelectedItems] = useState(new Set<number>());
    const [loading, setLoading] = useState(false);

    const getSelectValue = (urlType: string) => {
        return urlType.slice(0, -1).charAt(0).toUpperCase() + urlType.slice(1, -1);
    };

    const handleTypeChange = (event: any) => {
        const selectedType = event.target.value;
        const urlType = selectedType.toLowerCase() + 's';
        
        setType(urlType);
        setPage(1);
        setSelectedItems(new Set());
    };

    const handlePageChange = (_: any, value: number) => {
        setPage(value.toString());
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
                type,
                itemIds: Array.from(selectedItems)
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
                <Select
                    value={getSelectValue(type)}
                    onChange={handleTypeChange}
                    label="Content Type"
                >
                    {CONTENT_TYPES.map((contentType) => (
                        <MenuItem key={contentType} value={contentType}>
                            {contentType}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    justifyContent: 'flex-start',
                }}
            >
                {items.map((item) => (
                    <Box 
                        key={item.id}
                        sx={{ 
                            position: 'relative',
                            cursor: 'pointer',
                            '&:hover .checkbox': {
                                opacity: 1,
                            },
                            flexBasis: {
                                xs: '100%',
                                sm: 'calc(50% - 16px)',
                                md: 'calc(33.333% - 16px)',
                                lg: 'calc(25% - 16px)',
                            },
                            minWidth: 0,
                        }}
                        onClick={() => toggleItem(item.id)}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                zIndex: 2,
                                bgcolor: 'background.paper',
                                borderRadius: '50%',
                                opacity: selectedItems.has(item.id) ? 1 : 0.7,
                                transition: 'opacity 0.2s',
                            }}
                            className="checkbox"
                        >
                            <Checkbox
                                checked={selectedItems.has(item.id)}
                                onClick={(e) => e.stopPropagation()}
                                sx={{ 
                                    '&.Mui-checked': {
                                        color: 'primary.main',
                                    }
                                }}
                            />
                        </Box>
                        <ListCard
                            list={item}
                            username={item.userName}
                            userId={item.userId}
                        />
                    </Box>
                ))}
            </Box>

            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                    />
                </Box>
            )}

            <Button
                fullWidth
                variant="contained"
                onClick={onSave}
                disabled={loading || selectedItems.size === 0}
                startIcon={<SaveOutlined />}
                sx={{ mt: 2 }}
            >
                Save Selected Items ({selectedItems.size})
            </Button>
        </Box>
    );
}
