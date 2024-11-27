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
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PersonIcon from "@mui/icons-material/Person";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
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
    const subTabs: Record<string, string[]> = {
        bookmarks: ["Movies", "Series", "Seasons", "Episodes", "Actors", "Crew"],
        reviews: ["Movies", "Series", "Seasons", "Episodes", "Actors", "Crew"],
        upvotes: ["Movies", "Series", "Seasons", "Episodes", "Actors", "Crew"],
        downvotes: ["Movies", "Series", "Seasons", "Episodes", "Actors", "Crew"],
    };

    const getSubTabIcon = (label: string) => {
        switch (label.toLowerCase()) {
            case "movies":
                return <LocalMoviesIcon />;
            case "series":
                return <LiveTvIcon />;
            case "seasons":
                return <PlaylistPlayIcon />;
            case "episodes":
                return <PlayCircleOutlineIcon />;
            case "actors":
                return <PersonIcon />;
            case "crew":
                return <GroupWorkIcon />;
            default:
                return <BookmarkIcon />;
        }
    };

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
            sx={{
                width: "100%",
                maxWidth: 1200,
                mx: "auto",
                p: { xs: 2, sm: 3, md: 4 },
                mt: { xs: 2, sm: 3, md: 4 },
                display: "flex",
                flexDirection: "column",
                gap: { xs: 3, sm: 4, md: 5 },
            }}
        >
            {/* Profile Header */}
            <Paper
                elevation={2}
                sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        boxShadow: (theme) => theme.shadows[4],
                    },
                }}
            >
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={{ xs: 3, md: 4 }}
                    alignItems={{ xs: "center", md: "flex-start" }}
                >
                    <Box sx={{ position: "relative" }}>
                        <Avatar
                            src={userInPage.avatar?.photoSrc || "/default-avatar.jpg"}
                            alt={userInPage.userName}
                            sx={{
                                width: { xs: 120, sm: 150 },
                                height: { xs: 120, sm: 150 },
                                border: "4px solid",
                                borderColor: "background.paper",
                                boxShadow: 2,
                            }}
                        />
                    </Box>
                    <Box flex={1} width="100%">
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
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "action.hover",
                                                color: "primary.main",
                                            },
                                        }}
                                    >
                                        <SaveIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => setIsUserNameEditing(false)}
                                        color="error"
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "action.hover",
                                                color: "error.main",
                                            },
                                        }}
                                    >
                                        <CancelIcon />
                                    </IconButton>
                                </Stack>
                            ) : (
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="h4">{userName}</Typography>
                                    {userLoggedIn?.id === userInPage.id && (
                                        <IconButton
                                            onClick={() => setIsUserNameEditing(true)}
                                            size="small"
                                            sx={{
                                                "&:hover": {
                                                    backgroundColor: "action.hover",
                                                    color: "primary.main",
                                                },
                                            }}
                                        >
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
                                <IconButton
                                    onClick={() => handleSaveEdit("bio", bio, setIsBioEditing)}
                                    color="primary"
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: "action.hover",
                                            color: "success.main",
                                        },
                                    }}
                                >
                                    <SaveIcon />
                                </IconButton>
                                <IconButton
                                    onClick={() => setIsBioEditing(false)}
                                    color="error"
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: "action.hover",
                                            color: "error.main",
                                        },
                                    }}
                                >
                                    <CancelIcon />
                                </IconButton>
                            </Stack>
                        ) : (
                            <Stack direction="row" spacing={1} alignItems="start" mb={2}>
                                <Typography variant="body1" color="text.secondary">
                                    {bio || "No bio yet"}
                                </Typography>
                                {userLoggedIn?.id === userInPage.id && (
                                    <IconButton
                                        onClick={() => setIsBioEditing(true)}
                                        size="small"
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "action.hover",
                                                color: "primary.main",
                                            },
                                        }}
                                    >
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
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: "action.hover",
                                            color: "success.main",
                                        },
                                    }}
                                >
                                    <SaveIcon />
                                </IconButton>
                                <IconButton
                                    onClick={() => setIsEmailEditing(false)}
                                    color="error"
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: "action.hover",
                                            color: "error.main",
                                        },
                                    }}
                                >
                                    <CancelIcon />
                                </IconButton>
                            </Stack>
                        ) : (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body2" color="text.secondary">
                                    {email}
                                </Typography>
                                {userLoggedIn?.id === userInPage.id && (
                                    <IconButton
                                        onClick={() => setIsEmailEditing(true)}
                                        size="small"
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "action.hover",
                                                color: "primary.main",
                                            },
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                )}
                            </Stack>
                        )}
                    </Box>
                </Stack>
            </Paper>

            {/* Main Tabs */}
            <Paper
                elevation={1}
                sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "background.paper",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        boxShadow: (theme) => theme.shadows[3],
                    },
                }}
            >
                <Tabs
                    value={currentMainTab}
                    onChange={handleMainTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                        borderBottom: 2,
                        borderColor: "divider",
                        "& .MuiTab-root": {
                            minHeight: 48,
                            textTransform: "none",
                            fontSize: { xs: "0.875rem", sm: "0.875rem" },
                            transition: "all 0.2s",
                            borderRight: "1px solid",
                            borderColor: "divider",
                            px: { xs: 2, sm: 3 },
                            py: 1.5,
                            "&:hover": {
                                bgcolor: "action.hover",
                                color: "primary.main",
                            },
                            "&:last-child": {
                                borderRight: "none",
                            },
                            "& .MuiSvgIcon-root": {
                                fontSize: "1.25rem",
                            },
                        },
                        "& .Mui-selected": {
                            fontWeight: 600,
                            bgcolor: "action.selected",
                            "&:hover": {
                                bgcolor: "action.selected",
                            },
                        },
                        "& .MuiTabs-indicator": {
                            height: 2,
                        },
                    }}
                >
                    {mainTabs.map((tab) => (
                        <Tab
                            key={tab.label}
                            icon={tab.icon}
                            label={tab.label}
                            iconPosition="start"
                            sx={{
                                gap: 1,
                            }}
                        />
                    ))}
                </Tabs>
            </Paper>

            {/* Sub Tabs */}
            <Paper
                elevation={1}
                sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "background.paper",
                    mb: { xs: 1, sm: 1.5 },
                }}
            >
                <Tabs
                    value={currentSubTab}
                    onChange={handleSubTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                        minHeight: 48,
                        borderBottom: 1,
                        borderColor: "divider",
                        "& .MuiTab-root": {
                            minHeight: 48,
                            textTransform: "none",
                            fontSize: { xs: "0.875rem", sm: "0.875rem" },
                            px: { xs: 2, sm: 3 },
                            py: 1,
                            transition: "all 0.2s",
                            "&:hover": {
                                bgcolor: "action.hover",
                                color: "primary.main",
                            },
                            "& .MuiSvgIcon-root": {
                                fontSize: "1.25rem",
                            },
                        },
                        "& .Mui-selected": {
                            fontWeight: 500,
                            bgcolor: "action.selected",
                            "&:hover": {
                                bgcolor: "action.selected",
                            },
                        },
                        "& .MuiTabs-indicator": {
                            height: 2,
                        },
                    }}
                >
                    {subTabs[mainTabs[currentMainTab].param as keyof typeof subTabs].map((label) => (
                        <Tab
                            key={label}
                            label={label}
                            icon={getSubTabIcon(label)}
                            iconPosition="start"
                            sx={{
                                gap: 1,
                            }}
                        />
                    ))}
                </Tabs>
            </Paper>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${currentMainTab}-${currentSubTab}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
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
