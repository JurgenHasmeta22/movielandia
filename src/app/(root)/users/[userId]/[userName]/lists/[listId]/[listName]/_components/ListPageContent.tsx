"use client";

import { useState, useEffect, useTransition } from "react";
import { Box, Stack, Typography, Tooltip, IconButton, Button, Divider } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import ArchiveIcon from "@mui/icons-material/Archive";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ListDetailCardItem from "@/components/root/listDetailCardItem/ListDetailCardItem";
import DraggableListItem from "@/components/root/draggableListItem/DraggableListItem";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import ListDetailHeader from "@/components/root/listDetailHeader/ListDetailHeader";
import { formatDate } from "@/utils/helpers/utils";
import { List } from "@prisma/client";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/helpers/toast";
import { reorderListItems } from "@/actions/list/listReorder.actions";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

interface ListPageContentProps {
    list: List;
    userName: string;
    currentUserId: number;
    content: any[];
    totalItems: number;
    currentPage: number;
}

export default function ListPageContent({
    list,
    userName,
    currentUserId,
    content,
    totalItems,
    currentPage,
}: ListPageContentProps) {
    const router = useRouter();
    const pageCount = Math.ceil(totalItems / 12);
    const [isEditMode, setIsEditMode] = useState(false);
    const [items, setItems] = useState(content);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setItems(content);
    }, [content]);

    // Configure DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Minimum drag distance before activation
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setItems((prevItems) => {
                const oldIndex = prevItems.findIndex((item) => getItemId(item) === active.id);
                const newIndex = prevItems.findIndex((item) => getItemId(item) === over.id);

                return arrayMove(prevItems, oldIndex, newIndex);
            });
        }
    };

    const getItemId = (item: any) => {
        if (!list.contentType) {
            // If the list doesn't have a content type, try to determine it from the item structure
            if (item.movie) return item.movie.id;
            if (item.serie) return item.serie.id;
            if (item.season) return item.season.id;
            if (item.episode) return item.episode.id;
            if (item.actor) return item.actor.id;
            if (item.crew) return item.crew.id;
            return item.id;
        }

        switch (list.contentType) {
            case "movie":
                return item.movie.id;
            case "serie":
                return item.serie.id;
            case "season":
                return item.season.id;
            case "episode":
                return item.episode.id;
            case "actor":
                return item.actor.id;
            case "crew":
                return item.crew.id;
            default:
                return item.id;
        }
    };

    const saveOrder = () => {
        startTransition(async () => {
            try {
                const updatedItems = items.map((item, index) => ({
                    id: getItemId(item),
                    orderIndex: index,
                }));

                await reorderListItems({
                    listId: list.id,
                    userId: currentUserId,
                    type: list.contentType!,
                    items: updatedItems,
                });

                setIsEditMode(false);
                showToast("success", "List order updated successfully");
            } catch (error) {
                showToast("error", error instanceof Error ? error.message : "Failed to update list order");
            }
        });
    };

    const toggleEditMode = () => {
        if (isEditMode) {
            saveOrder();
        } else {
            setIsEditMode(true);
        }
    };

    return (
        <Box
            component="section"
            sx={{
                maxWidth: "1200px",
                margin: "0 auto",
                width: "100%",
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 3, sm: 4 },
                mt: 6,
            }}
        >
            <Stack spacing={4}>
                <Stack direction="row" alignItems="center" spacing={3}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => {
                            router.back();
                            router.refresh();
                        }}
                        sx={{
                            textTransform: "uppercase",
                            fontWeight: 600,
                            color: "text.primary",
                            borderColor: "divider",
                            "&:hover": {
                                borderColor: "primary.main",
                            },
                        }}
                    >
                        GO BACK
                    </Button>

                </Stack>
                <ListDetailHeader listId={list.id} userId={list.userId} listTitle={list.name} />
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Stack direction="row" spacing={1}>
                            {list.isPrivate && (
                                <Tooltip title="Private list">
                                    <IconButton size="small">
                                        <LockIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {list.isArchived && (
                                <Tooltip title="Archived list">
                                    <IconButton size="small">
                                        <ArchiveIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Stack>

                        {/* Only show reorder controls if the user is the owner or has edit permissions */}
                        {(list.userId === currentUserId) && (
                            <Button
                                variant="outlined"
                                color={isEditMode ? "success" : "primary"}
                                startIcon={isEditMode ? <SaveIcon /> : <EditIcon />}
                                onClick={toggleEditMode}
                                disabled={isPending}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 600,
                                }}
                            >
                                {isEditMode ? "Save Order" : "Reorder Items"}
                            </Button>
                        )}
                    </Stack>
                    {list.description && (
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "800px" }}>
                            {list.description}
                        </Typography>
                    )}
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ color: "text.secondary" }}>
                        <Typography variant="body2">Created by {userName}</Typography>
                        <Divider orientation="vertical" flexItem />
                        <Typography variant="body2">Last updated {formatDate(list.updatedAt)}</Typography>
                        <Divider orientation="vertical" flexItem />
                        <Typography variant="body2">{totalItems} items</Typography>
                    </Stack>
                </Stack>
                {isEditMode ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "repeat(auto-fill, minmax(80px, 1fr))",
                                    sm: "repeat(auto-fill, minmax(90px, 1fr))",
                                    md: "repeat(auto-fill, minmax(100px, 1fr))",
                                    lg: "repeat(auto-fill, minmax(110px, 1fr))",
                                },
                                gap: { xs: 1, sm: 1.5, md: 2 },
                                justifyItems: "center",
                                padding: 2,
                                bgcolor: "action.hover",
                                borderRadius: 1,
                            }}
                        >
                            <SortableContext items={(items || []).map(item => getItemId(item))} strategy={rectSortingStrategy}>
                                {(items || []).map((item) => (
                                    <DraggableListItem
                                        key={getItemId(item)}
                                        id={getItemId(item)}
                                        data={item}
                                        type={list.contentType!}
                                        userId={currentUserId}
                                        listId={list.id}
                                        isEditMode={isEditMode}
                                    />
                                ))}
                            </SortableContext>
                        </Box>
                    </DndContext>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "repeat(auto-fill, minmax(80px, 1fr))",
                                sm: "repeat(auto-fill, minmax(90px, 1fr))",
                                md: "repeat(auto-fill, minmax(100px, 1fr))",
                                lg: "repeat(auto-fill, minmax(110px, 1fr))",
                            },
                            gap: { xs: 1, sm: 1.5, md: 2 },
                            justifyItems: "center",
                        }}
                    >
                        {(items || []).map((item) => (
                            <ListDetailCardItem
                                key={getItemId(item)}
                                data={item}
                                type={list.contentType!}
                                userId={currentUserId}
                                listId={list.id}
                                showActions={true}
                            />
                        ))}
                    </Box>
                )}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <PaginationControl currentPage={currentPage} pageCount={pageCount} urlParamName="page" />
                </Box>
            </Stack>
        </Box>
    );
}
