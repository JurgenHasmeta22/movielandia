"use client";

import { Box, IconButton, Stack, Tab, Tabs, TextField, Typography, Avatar, Paper } from "@mui/material";
import { useState, useMemo } from "react";
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
import TabContent from "./TabContent";

interface UserPageProps {
    userLoggedIn: {
        id: number;
        userName: string;
        email: string;
        password: string | null;
        role: string;
        bio: string;
        active: boolean;
        canResetPassword: boolean;
    } | null;
    userInPage: {
        id: number;
        userName: string;
        email: string;
        password: string | null;
        role: string;
        bio: string;
        active: boolean;
        canResetPassword: boolean;
        avatar?: { photoSrc: string } | null;
        isFollowed?: boolean;
        isFollowedStatus?: string | null;
    };
    tabValue: string;
}

type TabConfig = {
    label: string;
    icon: JSX.Element;
    param: string;
};

type SubTabsConfig = {
    [key: string]: string[];
};

export default function UserPageContent({ userLoggedIn, userInPage, tabValue }: UserPageProps) {
    const [bio, setBio] = useState<string>(userInPage.bio);
    const [isBioEditing, setIsBioEditing] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>(userInPage.userName);
    const [isUserNameEditing, setIsUserNameEditing] = useState<boolean>(false);
    const [email, setEmail] = useState<string>(userInPage.email);
    const [isEmailEditing, setIsEmailEditing] = useState<boolean>(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    // Main tab options with their corresponding search param values
    const mainTabs = useMemo<TabConfig[]>(
        () => [
            { label: "Bookmarks", icon: <BookmarkIcon />, param: "bookmarks" },
            { label: "Upvotes", icon: <ThumbUpIcon />, param: "upvotes" },
            { label: "Downvotes", icon: <ThumbDownIcon />, param: "downvotes" },
            { label: "Reviews", icon: <RateReviewIcon />, param: "reviews" },
        ],
        [],
    );

    // Sub tab options based on main tab
    const subTabs = useMemo<SubTabsConfig>(
        () => ({
            bookmarks: ["Movies", "Series", "Actors", "Crew", "Seasons", "Episodes"],
            upvotes: [
                "Movie Reviews",
                "Series Reviews",
                "Season Reviews",
                "Episode Reviews",
                "Actor Reviews",
                "Crew Reviews",
            ],
            downvotes: [
                "Movie Reviews",
                "Series Reviews",
                "Season Reviews",
                "Episode Reviews",
                "Actor Reviews",
                "Crew Reviews",
            ],
            reviews: ["Movies", "Series", "Seasons", "Episodes", "Actors", "Crew"],
        }),
        [],
    );

    // Get current tab values from URL
    const currentMainTab = useMemo(() => {
        const mainTabParam = searchParams.get("maintab");
        return mainTabParam ? mainTabs.findIndex((tab) => tab.param === mainTabParam) : 0;
    }, [searchParams, mainTabs]);

    const currentSubTab = useMemo(() => {
        const mainTabParam = searchParams.get("maintab") || mainTabs[0].param;
        const subTabParam = searchParams.get("subtab");
        const currentSubTabs = subTabs[mainTabParam as keyof typeof subTabs];

        if (!subTabParam) return 0;

        const subTabIndex = currentSubTabs.findIndex(
            (tab) => tab.toLowerCase().replace(/\s+/g, "") === subTabParam.toLowerCase().replace(/\s+/g, ""),
        );

        return subTabIndex === -1 ? 0 : subTabIndex;
    }, [searchParams, subTabs, mainTabs]);

    const updateURL = (mainTabValue: string, subTabValue: string) => {
        const cleanSubTabValue = subTabValue.toLowerCase().replace(/\s+/g, "");
        const newSearchParams = new URLSearchParams(searchParams.toString());

        newSearchParams.set("maintab", mainTabValue);
        newSearchParams.set("subtab", cleanSubTabValue);

        router.push(`?${newSearchParams.toString()}`);
    };

    const handleMainTabChange = (_: React.SyntheticEvent, newValue: number) => {
        const mainTabParam = mainTabs[newValue].param;
        const firstSubTab = subTabs[mainTabParam as keyof typeof subTabs][0];
        updateURL(mainTabParam, firstSubTab);
    };

    const handleSubTabChange = (_: React.SyntheticEvent, newValue: number) => {
        const mainTabParam = mainTabs[currentMainTab].param;
        const selectedSubTab = subTabs[mainTabParam as keyof typeof subTabs][newValue];
        updateURL(mainTabParam, selectedSubTab);
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

    const handleSaveEdit = async (
        field: "bio" | "userName" | "email",
        value: string,
        setEditing: (value: boolean) => void,
    ) => {
        try {
            await updateUserById({ [field]: value }, userInPage.id);
            setEditing(false);
            showToast("success", `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            showToast("error", `Error updating ${field}: ${errorMessage}`);
        }
    };

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
                        {/* Username Field */}
                        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                            {isUserNameEditing ? (
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <TextField
                                        value={userName}
                                        onChange={handleUserNameChange}
                                        size="small"
                                        fullWidth
                                    />
                                    <IconButton
                                        onClick={() => handleSaveEdit("userName", userName, setIsUserNameEditing)}
                                        color="primary"
                                    >
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

                        {/* Bio Field */}
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
                                <IconButton onClick={() => handleSaveEdit("bio", bio, setIsBioEditing)} color="primary">
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

                        {/* Email Field */}
                        {isEmailEditing ? (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <TextField
                                    value={email}
                                    onChange={handleEmailChange}
                                    size="small"
                                    fullWidth
                                    type="email"
                                />
                                <IconButton
                                    onClick={() => handleSaveEdit("email", email, setIsEmailEditing)}
                                    color="primary"
                                >
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
                    value={currentMainTab}
                    onChange={handleMainTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                >
                    {mainTabs.map((tab) => (
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
                    value={currentSubTab}
                    onChange={handleSubTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                >
                    {subTabs[mainTabs[currentMainTab].param as keyof typeof subTabs].map((label) => (
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
                    key={`${currentMainTab}-${currentSubTab}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    <Box sx={{ minHeight: "50vh" }}>
                        <TabContent
                            type={subTabs[mainTabs[currentMainTab].param as keyof typeof subTabs][currentSubTab]}
                            userLoggedIn={userLoggedIn}
                            userInPage={userInPage}
                        />
                    </Box>
                </motion.div>
            </AnimatePresence>
        </Box>
    );
}
