"use client";

import { Stack, Paper, Box, Typography, Divider } from "@mui/material";
import { motion } from "framer-motion";
import { JSX, useMemo } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";
import ProfileStats from "./ProfileStats";
import ProfileTabs from "./ProfileTabs";
import PrivateProfileMessage from "./PrivateProfileMessage";
import TabContent from "./TabContent";
import SocialSection from "./SocialSection";

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
    };
    additionalData: any;
    userFollowers: any;
    userFollowing: any;
    userPendingFollowers: any;
}

type TabConfig = {
    label: string;
    icon: JSX.Element;
    param: string;
};
// #endregion

export default function UserPageContent({
    userLoggedIn,
    userInPage,
    additionalData,
    userFollowers,
    userFollowing,
    userPendingFollowers,
}: UserPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // #region "Profile follow view logic"
    const canViewProfile = useMemo(() => {
        if (!userLoggedIn) return false;
        if (userLoggedIn.id === userInPage.id) return true;
        return userInPage.isFollowed && userInPage.isFollowedStatus === "accepted";
    }, [userLoggedIn, userInPage]);
    // #endregion

    // #region "Tabs and Subtabs logic"
    const mainTabs = useMemo<TabConfig[]>(
        () => [
            { label: "Bookmarks", icon: <BookmarkIcon />, param: "bookmarks" },
            { label: "Upvotes", icon: <ThumbUpIcon />, param: "upvotes" },
            { label: "Downvotes", icon: <ThumbDownIcon />, param: "downvotes" },
            { label: "Reviews", icon: <RateReviewIcon />, param: "reviews" },
        ],
        [],
    );

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
    // #endregion

    const getMainTabDescription = (mainTab: string) => {
        switch (mainTab) {
            case "bookmarks":
                return "Items saved for later viewing";
            case "upvotes":
                return "Reviews this user found helpful";
            case "downvotes":
                return "Reviews this user disagreed with";
            case "reviews":
                return "User's reviews and ratings";
            default:
                return "";
        }
    };

    return (
        <Stack spacing={4} width="100%" alignItems="center" sx={{ mt: 4, py: 4 }}>
            <Paper elevation={3} sx={{ width: "100%", p: { xs: 3, sm: 4 } }}>
                <Stack direction={["column", "row"]} spacing={{ xs: 3, sm: 4 }} alignItems="flex-start">
                    <Stack direction="row" spacing={4} sx={{ flex: 1 }}>
                        <ProfileHeader avatar={userInPage.avatar} userName={userInPage.userName} />
                        <Box sx={{ flex: 1 }}>
                            <Stack spacing={2}>
                                <ProfileInfo userInPage={userInPage} userLoggedIn={userLoggedIn} />
                                <SocialSection
                                    userLoggedIn={userLoggedIn}
                                    userInPage={{
                                        ...userInPage,
                                        followers: userFollowers.items || [],
                                        following: userFollowing.items || [],
                                    }}
                                    userPendingFollowers={userPendingFollowers}
                                />
                            </Stack>
                        </Box>
                    </Stack>
                    <ProfileStats
                        userInPage={userInPage}
                        followersCount={userFollowers.items.length}
                        followingCount={userFollowing.items.length}
                        canClickFollow={canViewProfile!}
                    />
                </Stack>
            </Paper>
            {!canViewProfile && userLoggedIn && userLoggedIn.id !== userInPage.id && <PrivateProfileMessage />}
            {canViewProfile && (
                <>
                    <Box
                        sx={{
                            width: "100%",
                            textAlign: "center",
                            mb: 2,
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 500,
                                mb: 1,
                            }}
                        >
                            {userInPage.userName}&apos;s {mainTabs[currentMainTab].label}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontSize: { xs: "0.875rem", sm: "1rem" },
                            }}
                        >
                            {getMainTabDescription(mainTabs[currentMainTab].param)}
                        </Typography>
                        <Divider sx={{ mt: 2 }} />
                    </Box>

                    <ProfileTabs
                        mainTabs={mainTabs}
                        subTabs={subTabs}
                        getSubTabIcon={getSubTabIcon}
                        currentMainTab={currentMainTab}
                        currentSubTab={currentSubTab}
                        searchParams={searchParams}
                        router={router}
                    />
                    <motion.div
                        key={`${currentMainTab}-${currentSubTab}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <TabContent
                            type={subTabs[mainTabs[currentMainTab].param as keyof typeof subTabs][currentSubTab]}
                            userLoggedIn={userLoggedIn}
                            userInPage={userInPage}
                            additionalData={additionalData}
                        />
                    </motion.div>
                </>
            )}
        </Stack>
    );
}
