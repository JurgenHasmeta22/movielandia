"use client";

import { Box, CircularProgress, IconButton, Stack, TextField, Typography } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateUserById } from "@/actions/user/user.actions";
import { showToast } from "@/utils/helpers/toast";

interface ProfileInfoProps {
    userInPage: {
        id: number;
        userName: string;
        bio: string;
    };
    userLoggedIn: {
        id: number;
    } | null;
}

interface EditSectionProps {
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
    onChange: (value: string) => void;
    onSave: () => void;
    canEdit: boolean;
    isPending: boolean;
}

function UserNameSection({
    userName,
    isEditing,
    setIsEditing,
    onChange,
    onSave,
    canEdit,
    isPending,
}: EditSectionProps & { userName: string }) {
    return (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%" }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
                <PersonOutlineIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                <Typography sx={{ fontSize: 16, color: "text.secondary" }}>Username: </Typography>
                <Box sx={{ flex: 1, display: "flex", alignItems: "center", minHeight: "56px" }}>
                    <AnimatePresence mode="wait">
                        {isEditing ? (
                            <motion.div
                                key="editing"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                style={{ width: "100%" }}
                            >
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%" }}>
                                    <TextField
                                        value={userName}
                                        onChange={(e) => onChange(e.target.value)}
                                        size="small"
                                        fullWidth
                                        placeholder="Enter username"
                                        disabled={isPending}
                                    />
                                    <IconButton onClick={onSave} color="primary" size="small" disabled={isPending}>
                                        {isPending ? <CircularProgress size={20} /> : <SaveIcon />}
                                    </IconButton>
                                    <IconButton
                                        onClick={() => setIsEditing(false)}
                                        color="error"
                                        size="small"
                                        disabled={isPending}
                                    >
                                        <CancelIcon />
                                    </IconButton>
                                </Stack>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="display"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                style={{ display: "flex", alignItems: "center", width: "100%" }}
                            >
                                <Typography variant="h4" sx={{ fontWeight: 500 }}>
                                    {userName}
                                </Typography>
                                {canEdit && (
                                    <IconButton
                                        onClick={() => setIsEditing(true)}
                                        size="small"
                                        sx={{
                                            ml: 1,
                                            color: "text.secondary",
                                            "&:hover": {
                                                color: "primary.main",
                                                bgcolor: "primary.lighter",
                                            },
                                        }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Box>
            </Stack>
        </Stack>
    );
}

function BioSection({
    bio,
    isEditing,
    setIsEditing,
    onChange,
    onSave,
    canEdit,
    isPending,
}: EditSectionProps & { bio: string }) {
    return (
        <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
            <DescriptionIcon sx={{ fontSize: 20, color: "text.secondary", mt: 0.5 }} />
            <Typography sx={{ fontSize: 16, color: "text.secondary" }}>Bio: </Typography>
            <Box sx={{ flex: 1, display: "flex", alignItems: "flex-start", minHeight: "72px" }}>
                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.div
                            key="editing"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            style={{ width: "100%" }}
                        >
                            <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ width: "100%" }}>
                                <TextField
                                    value={bio}
                                    onChange={(e) => onChange(e.target.value)}
                                    multiline
                                    rows={3}
                                    fullWidth
                                    placeholder="Write something about yourself..."
                                    size="small"
                                    disabled={isPending}
                                />
                                <Stack direction="row" spacing={0.5}>
                                    <IconButton onClick={onSave} color="primary" size="small" disabled={isPending}>
                                        {isPending ? <CircularProgress size={20} /> : <SaveIcon />}
                                    </IconButton>
                                    <IconButton
                                        onClick={() => setIsEditing(false)}
                                        color="error"
                                        size="small"
                                        disabled={isPending}
                                    >
                                        <CancelIcon />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="display"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            style={{ display: "flex", alignItems: "flex-start", width: "100%" }}
                        >
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{
                                    minHeight: "1.5em",
                                    whiteSpace: "pre-wrap",
                                }}
                            >
                                {bio || "No bio yet"}
                            </Typography>
                            {canEdit && (
                                <IconButton
                                    onClick={() => setIsEditing(true)}
                                    size="small"
                                    sx={{
                                        ml: 1,
                                        color: "text.secondary",
                                        "&:hover": {
                                            color: "primary.main",
                                            bgcolor: "primary.lighter",
                                        },
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>
        </Stack>
    );
}

export default function ProfileInfo({ userInPage, userLoggedIn }: ProfileInfoProps) {
    const [bio, setBio] = useState<string>(userInPage.bio);
    const [isBioEditing, setIsBioEditing] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>(userInPage.userName);
    const [isUserNameEditing, setIsUserNameEditing] = useState<boolean>(false);

    // Separate transitions for each field
    const [isUserNamePending, startUserNameTransition] = useTransition();
    const [isBioPending, startBioTransition] = useTransition();

    const handleSaveEdit = async (field: "bio" | "userName", value: string, setEditing: (value: boolean) => void) => {
        const transition = field === "bio" ? startBioTransition : startUserNameTransition;

        transition(async () => {
            try {
                await updateUserById({ [field]: value }, userInPage.id);
                setEditing(false);
                showToast("success", `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
                showToast("error", `Error updating ${field}: ${errorMessage}`);
            }
        });
    };

    return (
        <Stack
            spacing={2.5}
            sx={{
                minHeight: "180px", // This will prevent layout shifts
                width: "100%",
            }}
        >
            <UserNameSection
                userName={userName}
                isEditing={isUserNameEditing}
                setIsEditing={setIsUserNameEditing}
                onChange={setUserName}
                onSave={() => handleSaveEdit("userName", userName, setIsUserNameEditing)}
                canEdit={userLoggedIn?.id === userInPage.id}
                isPending={isUserNamePending}
            />
            <BioSection
                bio={bio}
                isEditing={isBioEditing}
                setIsEditing={setIsBioEditing}
                onChange={setBio}
                onSave={() => handleSaveEdit("bio", bio, setIsBioEditing)}
                canEdit={userLoggedIn?.id === userInPage.id}
                isPending={isBioPending}
            />
        </Stack>
    );
}
