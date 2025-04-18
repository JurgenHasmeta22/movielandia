"use client";

import { Box, Chip, Stack, Typography } from "@mui/material";
import Link from "next/link";

interface Tag {
    id: number;
    name: string;
    color?: string | null;
}

interface TagDisplayProps {
    tags: Tag[];
    size?: "small" | "medium";
    clickable?: boolean;
    wrap?: boolean;
    label?: string;
}

export default function TagDisplay({ tags, size = "small", clickable = true, wrap = true, label }: TagDisplayProps) {
    if (!tags || tags.length === 0) {
        return null;
    }

    return (
        <Box sx={{ mt: 1, mb: 1 }}>
            {label && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {label}:
                </Typography>
            )}
            <Stack
                direction="row"
                spacing={0.5}
                sx={{
                    flexWrap: wrap ? "wrap" : "nowrap",
                    overflow: wrap ? "visible" : "auto",
                }}
            >
                {tags.map((tag) =>
                    clickable ? (
                        <Link key={tag.id} href={`/forum/tags/${tag.id}`} passHref style={{ textDecoration: "none" }}>
                            <Chip
                                label={tag.name}
                                size={size}
                                sx={{
                                    backgroundColor: tag.color || undefined,
                                    color: tag.color ? "white" : undefined,
                                    cursor: "pointer",
                                    mb: wrap ? 0.5 : 0,
                                    "&:hover": {
                                        opacity: 0.9,
                                    },
                                }}
                            />
                        </Link>
                    ) : (
                        <Chip
                            key={tag.id}
                            label={tag.name}
                            size={size}
                            sx={{
                                backgroundColor: tag.color || undefined,
                                color: tag.color ? "white" : undefined,
                                mb: wrap ? 0.5 : 0,
                            }}
                        />
                    ),
                )}
            </Stack>
        </Box>
    );
}
