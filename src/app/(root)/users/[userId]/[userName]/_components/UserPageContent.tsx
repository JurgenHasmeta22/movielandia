"use client";

import { Box, IconButton, Stack, Tab, Tabs, TextField, Typography, Avatar, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { updateUserById } from "@/actions/user.actions";
import { showToast } from "@/utils/helpers/toast";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import RateReviewIcon from "@mui/icons-material/RateReview";
import type {} from "@mui/material/themeCssVarsAugmentation";
import FavoritesTab from "./FavoritesTab";

interface IUserPageProps {
    userLoggedIn: any | null;
    userInPage: any | null;
    tabValue: string;
}

export default function UserPageContent({ tabValue, userLoggedIn, userInPage }: IUserPageProps) {
    const [bio, setBio] = useState<string>(userInPage.bio || "");
    const [isBioEditing, setIsBioEditing] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>(userInPage.userName || "");
    const [isUserNameEditing, setIsUserNameEditing] = useState<boolean>(false);
    const [email, setEmail] = useState<string>(userInPage.email || "");
    const [isEmailEditing, setIsEmailEditing] = useState<boolean>(false);
    const [mainTab, setMainTab] = useState<number>(0);
    const [subTab, setSubTab] = useState<number>(0);

    const router = useRouter();
    const searchParams = useSearchParams();

    // Main tab options with their corresponding search param values
    const mainTabs = [
        { label: "Bookmarks", icon: <BookmarkIcon />, param: "bookmarks" },
        { label: "Upvotes", icon: <ThumbUpIcon />, param: "upvotes" },
        { label: "Downvotes", icon: <ThumbDownIcon />, param: "downvotes" },
        { label: "Reviews", icon: <RateReviewIcon />, param: "reviews" },
    ];

    // Sub tab options based on main tab
    const subTabs = {
        0: ["Movies", "Series", "Actors", "Crew", "Seasons", "Episodes"], // Bookmarks
        1: ["Movies", "Series", "Actors", "Crew", "Seasons", "Episodes"], // Upvotes
        2: ["Movies", "Series", "Actors", "Crew", "Seasons", "Episodes"], // Downvotes
        3: ["Movies", "Series", "Actors", "Crew", "Seasons", "Episodes"], // Reviews
    };

    // Initialize tabs from URL params
    useEffect(() => {
        const mainTabParam = searchParams.get("maintab");
        const subTabParam = searchParams.get("subtab");

        if (mainTabParam) {
            const mainTabIndex = mainTabs.findIndex((tab) => tab.param === mainTabParam);
            if (mainTabIndex !== -1) {
                setMainTab(mainTabIndex);
            }
        }

        if (subTabParam) {
            const currentSubTabs = subTabs[mainTab as keyof typeof subTabs];
            const subTabIndex = currentSubTabs.findIndex((tab) => tab.toLowerCase() === subTabParam.toLowerCase());

            if (subTabIndex !== -1) {
                setSubTab(subTabIndex);
            }
        }
    }, []);

    const handleMainTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setMainTab(newValue);
        setSubTab(0);
        updateURL(newValue, 0);
    };

    const handleSubTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSubTab(newValue);
        updateURL(mainTab, newValue);
    };

    const updateURL = (mainTabValue: number, subTabValue: number) => {
        const currentSubTabs = subTabs[mainTabValue as keyof typeof subTabs];

        if (subTabValue >= 0 && subTabValue < currentSubTabs.length) {
            const mainTabParam = mainTabs[mainTabValue].param;
            const subTabParam = currentSubTabs[subTabValue].toLowerCase();
            router.push(`/users/${userInPage.id}/${userInPage.userName}?maintab=${mainTabParam}&subtab=${subTabParam}`);
        }
    };

    const handleBioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBio(event.target.value);
    };

    const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    async function handleSaveEditBio() {
        try {
            await updateUserById({ bio }, Number(userInPage.id));
            setIsBioEditing(false);
            showToast("success", "Bio updated successfully");
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error updating bio: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred");
            }
        }
    }

    async function handleSaveEditUserName() {
        try {
            await updateUserById({ userName }, Number(userInPage.id));
            setIsUserNameEditing(false);
            showToast("success", "Username updated successfully");
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error updating username: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred");
            }
        }
    }

    async function handleSaveEditEmail() {
        try {
            await updateUserById({ email }, Number(userInPage.id));
            setIsEmailEditing(false);
            showToast("success", "Email updated successfully");
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error updating email: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred");
            }
        }
    }

    return (
        <Box
            component="main"
            sx={{ width: "100%", maxWidth: 1200, mx: "auto", p: { xs: 2, sm: 3 }, mt: { xs: 3, sm: 4 } }}
        >
            {/* Profile Header */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    mb: 4,
                    borderRadius: 2,
                    bgcolor: "background.paper",
                }}
            >
                <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="center">
                    <Avatar
                        src={userInPage.avatar?.photoSrc || "/default-avatar.jpg"}
                        alt={userInPage.userName}
                        sx={{ width: 150, height: 150 }}
                    />
                    <Box flex={1}>
                        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                            {isUserNameEditing ? (
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <TextField
                                        value={userName}
                                        onChange={handleUserNameChange}
                                        size="small"
                                        fullWidth
                                    />
                                    <IconButton onClick={handleSaveEditUserName} color="primary">
                                        <SaveIcon />
                                    </IconButton>
                                    <IconButton onClick={() => setIsUserNameEditing(false)} color="error">
                                        <CancelIcon />
                                    </IconButton>
                                </Stack>
                            ) : (
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="h4">{userName}</Typography>
                                    {userLoggedIn?.id === userInPage.id && (
                                        <IconButton onClick={() => setIsUserNameEditing(true)} size="small">
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                </Stack>
                            )}
                        </Stack>

                        {isBioEditing ? (
                            <Stack direction="row" spacing={1} alignItems="start" mb={2}>
                                <TextField
                                    value={bio}
                                    onChange={handleBioChange}
                                    multiline
                                    rows={3}
                                    fullWidth
                                    placeholder="Write something about yourself..."
                                />
                                <IconButton onClick={handleSaveEditBio} color="primary">
                                    <SaveIcon />
                                </IconButton>
                                <IconButton onClick={() => setIsBioEditing(false)} color="error">
                                    <CancelIcon />
                                </IconButton>
                            </Stack>
                        ) : (
                            <Stack direction="row" spacing={1} alignItems="start" mb={2}>
                                <Typography variant="body1" color="text.secondary">
                                    {bio || "No bio yet"}
                                </Typography>
                                {userLoggedIn?.id === userInPage.id && (
                                    <IconButton onClick={() => setIsBioEditing(true)} size="small">
                                        <EditIcon />
                                    </IconButton>
                                )}
                            </Stack>
                        )}

                        {isEmailEditing ? (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <TextField
                                    value={email}
                                    onChange={handleEmailChange}
                                    size="small"
                                    fullWidth
                                    type="email"
                                />
                                <IconButton onClick={handleSaveEditEmail} color="primary">
                                    <SaveIcon />
                                </IconButton>
                                <IconButton onClick={() => setIsEmailEditing(false)} color="error">
                                    <CancelIcon />
                                </IconButton>
                            </Stack>
                        ) : (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body2" color="text.secondary">
                                    {email}
                                </Typography>
                                {userLoggedIn?.id === userInPage.id && (
                                    <IconButton onClick={() => setIsEmailEditing(true)} size="small">
                                        <EditIcon />
                                    </IconButton>
                                )}
                            </Stack>
                        )}
                    </Box>
                </Stack>
            </Paper>

            {/* Main Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                <Tabs
                    value={mainTab}
                    onChange={handleMainTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                >
                    {mainTabs.map((tab, index) => (
                        <Tab
                            key={tab.label}
                            icon={tab.icon}
                            label={tab.label}
                            iconPosition="start"
                            sx={{
                                minHeight: 48,
                                textTransform: "none",
                                fontSize: "1rem",
                            }}
                        />
                    ))}
                </Tabs>
            </Box>

            {/* Sub Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs
                    value={subTab}
                    onChange={handleSubTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                >
                    {subTabs[mainTab as keyof typeof subTabs].map((label, index) => (
                        <Tab
                            key={label}
                            label={label}
                            sx={{
                                minHeight: 48,
                                textTransform: "none",
                                fontSize: "1rem",
                            }}
                        />
                    ))}
                </Tabs>
            </Box>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${mainTab}-${subTab}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    <Box sx={{ minHeight: "50vh" }}>
                        <FavoritesTab
                            type={subTabs[mainTab as keyof typeof subTabs][subTab]}
                            userLoggedIn={userLoggedIn}
                            userInPage={userInPage}
                        />
                    </Box>
                </motion.div>
            </AnimatePresence>
        </Box>
    );
}
