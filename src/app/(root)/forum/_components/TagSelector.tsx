"use client";

import { useState, useEffect } from "react";
import { Box, Chip, Autocomplete, TextField } from "@mui/material";
import { getAllTags } from "@/actions/forum/forumTag.actions";

interface TagSelectorProps {
    selectedTags: number[];
    onChange: (tagIds: number[]) => void;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
}

export default function TagSelector({
    selectedTags,
    onChange,
    label = "Tags",
    placeholder = "Select tags",
    disabled = false,
}: TagSelectorProps) {
    const [tags, setTags] = useState<any[]>([]);
    const [selectedTagObjects, setSelectedTagObjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const allTags = await getAllTags();
                setTags(allTags);

                const selected = allTags.filter((tag) => selectedTags.includes(tag.id));
                setSelectedTagObjects(selected);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching tags:", error);
                setLoading(false);
            }
        };

        fetchTags();
    }, [selectedTags]);

    const handleTagChange = (_event: React.SyntheticEvent, newValue: any[]) => {
        setSelectedTagObjects(newValue);
        onChange(newValue.map((tag) => tag.id));
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Autocomplete
                multiple
                id="tags-selector"
                options={tags}
                value={selectedTagObjects}
                onChange={handleTagChange}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                size="small"
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label={label}
                        placeholder={placeholder}
                        disabled={disabled || loading}
                        size="small"
                    />
                )}
                renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                        <Chip
                            // @ts-ignore
                            key={option.id}
                            label={option.name}
                            size="small"
                            {...getTagProps({ index })}
                            sx={{
                                backgroundColor: option.color || undefined,
                                color: option.color ? "white" : undefined,
                            }}
                        />
                    ))
                }
                disabled={disabled || loading}
            />
        </Box>
    );
}
