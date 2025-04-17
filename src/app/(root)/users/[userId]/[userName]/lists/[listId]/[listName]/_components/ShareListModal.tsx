"use client";

import { useState, useEffect, useTransition } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Paper,
    Divider,
    CircularProgress,
    InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDebounce } from "@/hooks/useDebounce";
import { searchUsers } from "@/actions/user/userMessages.actions";
import { shareList, unshareList, updateSharePermission } from "@/actions/list/listShare.actions";
import { showToast } from "@/utils/helpers/toast";
import { useRouter } from "next/navigation";

interface User {
    id: number;
    userName: string;
    email: string;
    avatar?: {
        photoSrc: string;
    };
}

interface SharedUser {
    id: number;
    userName: string;
    email?: string;
    avatar?: {
        photoSrc: string;
    } | null;
    canEdit: boolean;
    sharedAt: Date;
}

interface ShareListModalProps {
    open: boolean;
    onClose: () => void;
    listId: number;
    userId: number;
    sharedUsers: SharedUser[];
}

export default function ShareListModal({ open, onClose, listId, userId, sharedUsers }: ShareListModalProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [permissionLevel, setPermissionLevel] = useState<boolean>(false);
    const [isSearching, setIsSearching] = useState(false);
    const [currentSharedUsers, setCurrentSharedUsers] = useState<SharedUser[]>(sharedUsers || []);

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    useEffect(() => {
        if (debouncedSearchQuery.length > 2) {
            setIsSearching(true);
            searchUsers(debouncedSearchQuery, userId)
                .then((results) => {
                    const filteredResults = results.filter(
                        (user: { id: number; avatar: { id: number; photoSrc: string; userId: number; } | null; userName: string; email: string; }) => !currentSharedUsers.some((sharedUser) => sharedUser.id === user.id)
                    );

                    setSearchResults(filteredResults.map(user => ({
                        id: user.id,
                        userName: user.userName,
                        email: user.email,
                        avatar: user.avatar ? { photoSrc: user.avatar.photoSrc } : undefined
                    })));
                })
                .catch((error) => {
                    console.error("Error searching users:", error);
                    setSearchResults([]);
                })
                .finally(() => {
                    setIsSearching(false);
                });
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchQuery, userId, currentSharedUsers]);

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleClearSelection = () => {
        setSelectedUser(null);
        setPermissionLevel(false);
    };

    const handleShareList = () => {
        if (!selectedUser) return;

        startTransition(async () => {
            try {
                await shareList(listId, userId, selectedUser.id, permissionLevel);

                // Add the newly shared user to the current shared users list
                setCurrentSharedUsers([
                    ...currentSharedUsers,
                    {
                        ...selectedUser,
                        canEdit: permissionLevel,
                        sharedAt: new Date(),
                    },
                ]);

                showToast("success", `List shared with ${selectedUser.userName} successfully!`);
                handleClearSelection();
                router.refresh();
            } catch (error) {
                showToast("error", error instanceof Error ? error.message : "Failed to share list");
            }
        });
    };

    const handleUnshareList = (targetUserId: number, userName: string) => {
        startTransition(async () => {
            try {
                await unshareList(listId, userId, targetUserId);

                // Remove the unshared user from the current shared users list
                setCurrentSharedUsers(currentSharedUsers.filter((user) => user.id !== targetUserId));

                showToast("success", `List unshared with ${userName} successfully!`);
                router.refresh();
            } catch (error) {
                showToast("error", error instanceof Error ? error.message : "Failed to unshare list");
            }
        });
    };

    const handleUpdatePermission = (targetUserId: number, canEdit: boolean, userName: string) => {
        startTransition(async () => {
            try {
                await updateSharePermission(listId, userId, targetUserId, canEdit);

                // Update the permission level for the user in the current shared users list
                setCurrentSharedUsers(
                    currentSharedUsers.map((user) =>
                        user.id === targetUserId ? { ...user, canEdit } : user
                    )
                );

                showToast("success", `Permission updated for ${userName} successfully!`);
                router.refresh();
            } catch (error) {
                showToast("error", error instanceof Error ? error.message : "Failed to update permission");
            }
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: 10,
                },
            }}
        >
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
                <Typography variant="h6" component="div">
                    Share List
                </Typography>
                <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Share with a user
                    </Typography>
                    {selectedUser ? (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Chip
                                    avatar={
                                        <Avatar
                                            src={selectedUser.avatar?.photoSrc}
                                            alt={selectedUser.userName}
                                        />
                                    }
                                    label={selectedUser.userName}
                                    onDelete={handleClearSelection}
                                    variant="outlined"
                                />
                            </Box>
                            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                                <InputLabel id="permission-level-label">Permission Level</InputLabel>
                                <Select
                                    labelId="permission-level-label"
                                    value={permissionLevel ? "edit" : "view"}
                                    onChange={(e) => setPermissionLevel(e.target.value === "edit")}
                                    label="Permission Level"
                                >
                                    <MenuItem value="view">View only</MenuItem>
                                    <MenuItem value="edit">Can edit</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleShareList}
                                disabled={isPending}
                                sx={{ mt: 1, alignSelf: "flex-start" }}
                            >
                                {isPending ? <CircularProgress size={24} /> : "Share"}
                            </Button>
                        </Box>
                    ) : (
                        <TextField
                            fullWidth
                            placeholder="Search for a user..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: isSearching ? (
                                    <InputAdornment position="end">
                                        <CircularProgress size={20} />
                                    </InputAdornment>
                                ) : null,
                            }}
                            sx={{ mb: 1 }}
                        />
                    )}
                    {!selectedUser && searchResults.length > 0 && (
                        <Paper elevation={3} sx={{ mt: 1, maxHeight: 200, overflow: "auto" }}>
                            <List dense>
                                {searchResults.map((user) => (
                                    <ListItem
                                        key={user.id}
                                        onClick={() => handleSelectUser(user)}
                                        sx={{
                                            "&:hover": {
                                                bgcolor: "action.hover",
                                            },
                                            cursor: "pointer",
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={user.avatar?.photoSrc} alt={user.userName} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={user.userName}
                                            secondary={user.email}
                                            primaryTypographyProps={{
                                                fontWeight: 500,
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom>
                    Currently shared with
                </Typography>
                {currentSharedUsers.length > 0 ? (
                    <List>
                        {currentSharedUsers.map((user) => (
                            <ListItem
                                key={user.id}
                                secondaryAction={
                                    <Box>
                                        <IconButton
                                            edge="end"
                                            aria-label="edit"
                                            onClick={() =>
                                                handleUpdatePermission(user.id, !user.canEdit, user.userName)
                                            }
                                            sx={{ mr: 1 }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => handleUnshareList(user.id, user.userName)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                }
                                sx={{ pr: 10 }}
                            >
                                <ListItemAvatar>
                                    <Avatar src={user.avatar?.photoSrc} alt={user.userName} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Typography variant="body1">{user.userName}</Typography>
                                            <Chip
                                                label={user.canEdit ? "Can edit" : "View only"}
                                                size="small"
                                                color={user.canEdit ? "primary" : "default"}
                                                variant="outlined"
                                            />
                                        </Box>
                                    }
                                    secondary={`Shared ${new Date(user.sharedAt).toLocaleDateString()}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        This list is not shared with anyone yet.
                    </Typography>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} variant="outlined">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
