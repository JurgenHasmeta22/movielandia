"use client";

// #region "Imports"
import { Box, IconButton, Stack, Tab, Tabs, TextField, Typography, Avatar, Paper, Button } from "@mui/material";
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
import EmailIcon from "@mui/icons-material/Email";
import PeopleIcon from "@mui/icons-material/People";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import type {} from "@mui/material/themeCssVarsAugmentation";
import TabContent from "./TabContent";
import SocialSection from "./SocialSection";
import LockIcon from "@mui/icons-material/Lock";
// #endregion

// #region "Iterfaces and types"
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
        followers?: any[];
        following?: any[];
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
// #endregion

export default function UserPageContent({ userLoggedIn, userInPage, tabValue }: UserPageProps) {
    // #region "State, hooks"
    const [bio, setBio] = useState<string>(userInPage.bio);
    const [isBioEditing, setIsBioEditing] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>(userInPage.userName);
    const [isUserNameEditing, setIsUserNameEditing] = useState<boolean>(false);
    const [email, setEmail] = useState<string>(userInPage.email);
    const [isEmailEditing, setIsEmailEditing] = useState<boolean>(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    // #endregion

    // #region "Profile follow view logic"
    // Check if the logged-in user can view the profile
    const canViewProfile = useMemo(() => {
        if (!userLoggedIn) return false;
        if (userLoggedIn.id === userInPage.id) return true;
        return userInPage.isFollowed && userInPage.isFollowedStatus === "accepted";
    }, [userLoggedIn, userInPage]);
    // #endregion

    // #region "Tabs and Subtabs logic"
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
    // #endregion

    // #region "Edit information profile"
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
    // #endregion

    return (
        <Stack spacing={4} width="100%" alignItems="center" sx={{ mt: 4, py: 4 }}>
            {/* Profile Card Container */}
            <Paper
                elevation={3}
                sx={{
                    width: "100%",
                    p: { xs: 3, sm: 4 },
                    borderRadius: 2,
                    bgcolor: (theme) => (theme.palette.mode === "dark" ? "background.paper" : "grey.50"),
                }}
            >
                {/* Profile Layout: Avatar and Info side by side (column on mobile) */}
                <Stack direction={["column", "row"]} spacing={{ xs: 3, sm: 4 }} alignItems="center">
                    {/* Avatar Container with fixed dimensions and styling */}
                    <Box
                        sx={{
                            position: "relative",
                            width: { xs: 120, sm: 150 },
                            height: { xs: 120, sm: 150 },
                            flexShrink: 0,
                        }}
                    >
                        <Avatar
                            src={userInPage.avatar?.photoSrc || "/images/default-avatar.png"}
                            alt={userInPage.userName}
                            sx={{
                                width: "100%",
                                height: "100%",
                                border: "4px solid",
                                borderColor: "background.paper",
                                boxShadow: 2,
                            }}
                        />
                    </Box>

                    {/* Profile Information Section */}
                    <Box flex={1}>
                        <Stack spacing={2.5}>
                            {/* Username Section with Follow Button */}
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%" }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
                                    <PersonOutlineIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                                    <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
                                        {isUserNameEditing && userLoggedIn?.id === userInPage.id ? (
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                                sx={{ width: "100%" }}
                                            >
                                                <TextField
                                                    value={userName}
                                                    onChange={handleUserNameChange}
                                                    size="small"
                                                    fullWidth
                                                    placeholder="Enter username"
                                                />
                                                <IconButton
                                                    onClick={() =>
                                                        handleSaveEdit("userName", userName, setIsUserNameEditing)
                                                    }
                                                    color="primary"
                                                    size="small"
                                                >
                                                    <SaveIcon />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => setIsUserNameEditing(false)}
                                                    color="error"
                                                    size="small"
                                                >
                                                    <CancelIcon />
                                                </IconButton>
                                            </Stack>
                                        ) : (
                                            <>
                                                <Typography variant="h4" sx={{ fontWeight: 500 }}>
                                                    {userName}
                                                </Typography>
                                                {userLoggedIn?.id === userInPage.id && (
                                                    <IconButton
                                                        onClick={() => setIsUserNameEditing(true)}
                                                        size="small"
                                                        sx={{ ml: 1 }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </>
                                        )}
                                    </Box>
                                </Stack>
                                {/* Follow Button */}
                                {userLoggedIn && userLoggedIn.id !== userInPage.id && (
                                    <Button
                                        variant={userInPage.isFollowed ? "outlined" : "contained"}
                                        startIcon={userInPage.isFollowed ? <PersonRemoveIcon /> : <PersonAddIcon />}
                                        size="large"
                                        sx={{
                                            minWidth: 140,
                                            height: 45,
                                            textTransform: "none",
                                            borderRadius: 2,
                                            fontSize: "1rem",
                                            fontWeight: 500,
                                            boxShadow: 1,
                                            ...(userInPage.isFollowed
                                                ? {
                                                      borderColor: "primary.main",
                                                      color: "primary.main",
                                                      borderWidth: 1.5,
                                                      "&:hover": {
                                                          backgroundColor: "primary.main",
                                                          color: "primary.contrastText",
                                                          borderColor: "primary.main",
                                                          borderWidth: 1.5,
                                                      },
                                                  }
                                                : {
                                                      backgroundColor: "primary.main",
                                                      "&:hover": {
                                                          backgroundColor: "primary.dark",
                                                          boxShadow: 2,
                                                      },
                                                  }),
                                        }}
                                    >
                                        {userInPage.isFollowed ? "Following" : "Follow"}
                                    </Button>
                                )}
                            </Stack>

                            {/* Email Section */}
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%" }}>
                                <EmailIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                                <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
                                    {isEmailEditing && userLoggedIn?.id === userInPage.id ? (
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%" }}>
                                            <TextField
                                                value={email}
                                                onChange={handleEmailChange}
                                                size="small"
                                                fullWidth
                                                type="email"
                                                placeholder="Enter email"
                                            />
                                            <IconButton
                                                onClick={() => handleSaveEdit("email", email, setIsEmailEditing)}
                                                color="primary"
                                                size="small"
                                            >
                                                <SaveIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => setIsEmailEditing(false)}
                                                color="error"
                                                size="small"
                                            >
                                                <CancelIcon />
                                            </IconButton>
                                        </Stack>
                                    ) : (
                                        <>
                                            <Typography variant="body2" color="text.secondary">
                                                {email}
                                            </Typography>
                                            {userLoggedIn?.id === userInPage.id && (
                                                <IconButton
                                                    onClick={() => setIsEmailEditing(true)}
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </>
                                    )}
                                </Box>
                            </Stack>

                            {/* Bio Section */}
                            <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
                                <DescriptionIcon sx={{ fontSize: 20, color: "text.secondary", mt: 0.5 }} />
                                <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
                                    {isBioEditing && userLoggedIn?.id === userInPage.id ? (
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="flex-start"
                                            sx={{ width: "100%" }}
                                        >
                                            <TextField
                                                value={bio}
                                                onChange={handleBioChange}
                                                multiline
                                                rows={3}
                                                fullWidth
                                                placeholder="Write something about yourself..."
                                                size="small"
                                            />
                                            <Stack direction="row" spacing={0.5}>
                                                <IconButton
                                                    onClick={() => handleSaveEdit("bio", bio, setIsBioEditing)}
                                                    color="primary"
                                                    size="small"
                                                >
                                                    <SaveIcon />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => setIsBioEditing(false)}
                                                    color="error"
                                                    size="small"
                                                >
                                                    <CancelIcon />
                                                </IconButton>
                                            </Stack>
                                        </Stack>
                                    ) : (
                                        <>
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
                                            {userLoggedIn?.id === userInPage.id && (
                                                <IconButton
                                                    onClick={() => setIsBioEditing(true)}
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </>
                                    )}
                                </Box>
                            </Stack>

                            {/* Profile Stats - Always visible to everyone */}
                            <Stack
                                direction="row"
                                spacing={3}
                                sx={{
                                    mt: 1,
                                    pt: 2,
                                    borderTop: 1,
                                    borderColor: "divider",
                                }}
                            >
                                <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
                                    <PeopleIcon sx={{ fontSize: 18, mr: 0.5 }} />
                                    <strong>Followers:</strong>&nbsp;{userInPage.followers?.length || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
                                    <PersonIcon sx={{ fontSize: 18, mr: 0.5 }} />
                                    <strong>Following:</strong>&nbsp;{userInPage.following?.length || 0}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Paper>

            {/* Private Content Notice - Show when profile is private and not followed */}
            {!canViewProfile && userLoggedIn && userLoggedIn.id !== userInPage.id && (
                <Paper
                    elevation={3}
                    sx={{
                        width: "100%",
                        p: 4,
                        mt: 3,
                        textAlign: "center",
                        bgcolor: (theme) => (theme.palette.mode === "dark" ? "background.paper" : "grey.50"),
                    }}
                >
                    <Stack spacing={3} alignItems="center">
                        <LockIcon sx={{ fontSize: 48, color: "text.secondary" }} />
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                This Profile is Private
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Follow this user and wait for them to accept your request to see their content.
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>
            )}

            {/* Profile Content Tabs - Only visible if user has access */}
            {canViewProfile && (
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
            )}

            {/* Sub Tabs */}
            {canViewProfile && (
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
            )}

            {/* Content */}
            {canViewProfile && (
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
            )}
        </Stack>
    );
}
