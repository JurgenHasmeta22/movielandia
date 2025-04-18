"use client";

import { useState, useEffect } from "react";
import { Box, Chip, Stack, TextField, Typography } from "@mui/material";
import { getAllTags } from "@/actions/forum/forumTag.actions";

interface TagSelectorProps {
    selectedTags: number[];
    onChange: (tagIds: number[]) => void;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
}

interface TagOption {
    id: number;
    name: string;
    color?: string | null;
}

export default function TagSelector({
    selectedTags,
    onChange,
    label = "Tags",
    placeholder = "Select tags",
    disabled = false,
}: TagSelectorProps) {
    const [tags, setTags] = useState<TagOption[]>([]);
    const [selectedTagObjects, setSelectedTagObjects] = useState<TagOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);

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

    const handleTagSelect = (tagId: number) => {
        if (!selectedTagObjects.some((tag) => tag.id === tagId)) {
            const tagToAdd = tags.find((tag) => tag.id === tagId);

            if (tagToAdd) {
                const newSelectedTags = [...selectedTagObjects, tagToAdd];

                setSelectedTagObjects(newSelectedTags);
                onChange(newSelectedTags.map((tag) => tag.id));
            }
        }

        setInputValue("");
        setIsOpen(false);
    };

    const handleDelete = (tagToDelete: TagOption) => {
        const newSelectedTags = selectedTagObjects.filter((tag) => tag.id !== tagToDelete.id);
        setSelectedTagObjects(newSelectedTags);
        onChange(newSelectedTags.map((tag) => tag.id));
    };

    const filteredTags = tags.filter(
        (tag) =>
            tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
            !selectedTagObjects.some((selected) => selected.id === tag.id),
    );

    return (
        <Box sx={{ mb: 2 }}>
            <Box sx={{ position: "relative" }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label={label}
                    placeholder={placeholder}
                    disabled={disabled || loading}
                    size="small"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                />

                {isOpen && filteredTags.length > 0 && (
                    <Box
                        sx={{
                            position: "absolute",
                            zIndex: 1300,
                            width: "100%",
                            mt: 0.5,
                            maxHeight: "300px",
                            overflowY: "auto",
                            bgcolor: (theme) => theme.vars.palette.background.paper,
                            borderRadius: 1,
                            boxShadow: 3,
                            border: (theme) => `1px solid ${theme.vars.palette.divider}`,
                        }}
                    >
                        <Stack>
                            {filteredTags.map((tag) => (
                                <Box
                                    key={tag.id}
                                    sx={{
                                        p: 1.5,
                                        cursor: "pointer",
                                        "&:hover": { bgcolor: "action.hover" },
                                        display: "flex",
                                        alignItems: "center",
                                        borderBottom: (theme) => `1px solid ${theme.vars.palette.divider}`,
                                        "&:last-child": {
                                            borderBottom: "none",
                                        },
                                    }}
                                    onClick={() => handleTagSelect(tag.id)}
                                >
                                    <Chip
                                        label={tag.name}
                                        size="small"
                                        sx={{
                                            backgroundColor: tag.color || undefined,
                                            color: tag.color ? "white" : undefined,
                                            mr: 1,
                                        }}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                )}
            </Box>

            {selectedTagObjects.length > 0 && (
                <Box sx={{ mt: 1.5, mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Selected tags:
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
                        {selectedTagObjects.map((tag) => (
                            <Chip
                                key={tag.id}
                                label={tag.name}
                                size="small"
                                onDelete={() => handleDelete(tag)}
                                sx={{
                                    backgroundColor: tag.color || undefined,
                                    color: tag.color ? "white" : undefined,
                                    margin: "2px",
                                    fontWeight: 500,
                                }}
                            />
                        ))}
                    </Stack>
                </Box>
            )}
        </Box>
    );
}
