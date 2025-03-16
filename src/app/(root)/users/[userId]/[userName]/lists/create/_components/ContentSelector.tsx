"use client";

import { useState, useEffect } from "react";
import { Box, Tabs, Tab, Typography, Button } from "@mui/material";
import { getUserFavorites } from "@/actions/user/userProfile.actions";
import {
    addMovieToPlaylist,
    addSerieToPlaylist,
    addSeasonToPlaylist,
    addEpisodeToPlaylist,
    addActorToPlaylist,
    addCrewToPlaylist,
} from "@/actions/playlist/playlistItems.actions";

interface ContentSelectorProps {
    playlistId: number;
    userId: number;
    onComplete: () => void;
}

export default function ContentSelector({ playlistId, userId, onComplete }: ContentSelectorProps) {
    const [tab, setTab] = useState(0);
    const [content, setContent] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const tabs = ["Movies", "Series", "Seasons", "Episodes", "Actors", "Crew"] as const;
    type TabType = (typeof tabs)[number];
    type TabIndex = 0 | 1 | 2 | 3 | 4 | 5;

    const getContentType = (index: TabIndex): "movies" | "series" | "seasons" | "episodes" | "actors" | "crew" => {
        return tabs[index].toLowerCase() as "movies" | "series" | "seasons" | "episodes" | "actors" | "crew";
    };

    useEffect(() => {
        loadContent();
    }, [tab, userId]);

    const loadContent = async () => {
        try {
            setLoading(true);
            const contentType = getContentType(tab as TabIndex);
            const result = await getUserFavorites(userId, contentType, 1);
            setContent(result?.items || []);
        } catch (error) {
            console.error("Failed to load content:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToPlaylist = async () => {
        try {
            setLoading(true);

            const addPromises = selectedItems.map(async (itemId) => {
                switch (tab) {
                    case 0:
                        return addMovieToPlaylist(itemId, { playlistId, userId });
                    case 1:
                        return addSerieToPlaylist(itemId, { playlistId, userId });
                    case 2:
                        return addSeasonToPlaylist(itemId, { playlistId, userId });
                    case 3:
                        return addEpisodeToPlaylist(itemId, { playlistId, userId });
                    case 4:
                        return addActorToPlaylist(itemId, { playlistId, userId });
                    case 5:
                        return addCrewToPlaylist(itemId, { playlistId, userId });
                }
            });

            await Promise.all(addPromises);
            onComplete();
        } catch (error) {
            console.error("Failed to add items to playlist:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Select Content from Your Favorites
            </Typography>
            <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} variant="scrollable" scrollButtons="auto">
                {tabs.map((label) => (
                    <Tab key={label} label={label} />
                ))}
            </Tabs>
            <Box sx={{ mt: 2 }}>
                {loading ? (
                    <Typography>Loading...</Typography>
                ) : content.length === 0 ? (
                    <Typography>No favorites found in this category</Typography>
                ) : (
                    content.map((item) => (
                        <Box
                            key={item.id}
                            onClick={() => {
                                if (selectedItems.includes(item.id)) {
                                    setSelectedItems(selectedItems.filter((id) => id !== item.id));
                                } else {
                                    setSelectedItems([...selectedItems, item.id]);
                                }
                            }}
                            sx={{
                                p: 2,
                                border: 1,
                                borderColor: selectedItems.includes(item.id) ? "primary.main" : "grey.300",
                                borderRadius: 1,
                                mb: 1,
                                cursor: "pointer",
                                "&:hover": {
                                    bgcolor: "action.hover",
                                },
                            }}
                        >
                            <Typography>{item.title || item.name || item.fullname}</Typography>
                        </Box>
                    ))
                )}
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddToPlaylist}
                disabled={selectedItems.length === 0 || loading}
                sx={{ mt: 2 }}
            >
                Add Selected Items to Playlist
            </Button>
        </Box>
    );
}
