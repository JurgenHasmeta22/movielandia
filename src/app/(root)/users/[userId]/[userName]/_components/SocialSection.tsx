"use client";

import { useState } from "react";
import { Box, Button, IconButton, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { follow, unfollow, acceptFollowRequest, refuseFollowRequest } from "@/actions/user.actions";
import { showToast } from "@/utils/helpers/toast";

interface SocialSectionProps {
    userLoggedIn: {
        id: number;
        userName: string;
        email: string;
        role: string;
        bio: string;
        active: boolean;
        canResetPassword: boolean;
    } | null;
    userInPage: {
        id: number;
        userName: string;
        email: string;
        role: string;
        bio: string;
        active: boolean;
        canResetPassword: boolean;
        followers: any[];
        following: any[];
        isFollowed?: boolean;
        isFollowedStatus?: string | null;
    };
}

export default function SocialSection({ userLoggedIn, userInPage }: SocialSectionProps) {
    const [followersExpanded, setFollowersExpanded] = useState<boolean>(
        userInPage.followers?.filter((userFollow: any) => userFollow.state === "pending").length > 0,
    );

    const handleFollowUser = async () => {
        if (!userLoggedIn || !userInPage) return;

        try {
            await follow(Number(userLoggedIn.id), Number(userInPage.id));
            showToast("success", "Follow request sent successfully!");
            window.location.reload();
        } catch (error: any) {
            console.error(`Error following user: ${error.message}`);
            showToast("error", error.message || "Error following user");
        }
    };

    const handleUnfollowUser = async () => {
        if (!userLoggedIn || !userInPage) return;

        try {
            await unfollow(Number(userLoggedIn.id), Number(userInPage.id));
            showToast("success", "Unfollowed successfully!");
            window.location.reload();
        } catch (error: any) {
            console.error(`Error unfollowing user: ${error.message}`);
            showToast("error", error.message || "Error unfollowing user");
        }
    };

    const handleAcceptFollow = async (followerId: number) => {
        if (!userLoggedIn) return;

        try {
            await acceptFollowRequest(followerId, Number(userLoggedIn.id));
            showToast("success", "Follow request accepted!");
            setFollowersExpanded(false);
            window.location.reload();
        } catch (error: any) {
            console.error(`Error accepting follow request: ${error.message}`);
            showToast("error", error.message || "Error accepting follow request");
        }
    };

    const handleRefuseFollow = async (followerId: number) => {
        if (!userLoggedIn) return;

        try {
            await refuseFollowRequest(followerId, Number(userLoggedIn.id));
            showToast("success", "Follow request refused!");
            setFollowersExpanded(false);
            window.location.reload();
        } catch (error: any) {
            console.error(`Error refusing follow request: ${error.message}`);
            showToast("error", error.message || "Error refusing follow request");
        }
    };

    const handleFollowAction = async () => {
        if (!userInPage.isFollowed) {
            await handleFollowUser();
        } else {
            await handleUnfollowUser();
        }
    };

    const getButtonText = () => {
        if (!userInPage.isFollowed) {
            return "Follow";
        } else if (userInPage.isFollowedStatus === "pending") {
            return "Requested";
        } else {
            return "Unfollow";
        }
    };

    return (
        <Box>
            {/* Follow/Unfollow Button */}
            {userLoggedIn && (
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    {!userInPage.isFollowed ? (
                        <Button
                            variant="contained"
                            onClick={handleFollowUser}
                            startIcon={<PersonAddIcon />}
                            sx={{
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                                "&:hover": {
                                    bgcolor: "primary.dark",
                                },
                                textTransform: "none",
                                borderRadius: 2,
                                px: 3,
                                py: 1,
                            }}
                        >
                            Follow
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            onClick={handleUnfollowUser}
                            startIcon={<PersonRemoveIcon />}
                            sx={{
                                borderColor: "error.main",
                                color: "error.main",
                                "&:hover": {
                                    bgcolor: "error.main",
                                    color: "error.contrastText",
                                    borderColor: "error.main",
                                },
                                textTransform: "none",
                                borderRadius: 2,
                                px: 3,
                                py: 1,
                            }}
                        >
                            Unfollow
                        </Button>
                    )}
                </Box>
            )}

            {/* Followers Accordion */}
            {userLoggedIn?.id === userInPage.id && userInPage.followers.length > 0 && (
                <Accordion
                    expanded={followersExpanded}
                    onChange={() => setFollowersExpanded(!followersExpanded)}
                    sx={{
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        "&:before": { display: "none" },
                        boxShadow: (theme) => theme.shadows[2],
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            borderRadius: 2,
                            "&:hover": { bgcolor: "action.hover" },
                        }}
                    >
                        <Typography>
                            Followers Requests (
                            {userInPage.followers.filter((userFollow: any) => userFollow.state === "pending").length})
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {userInPage.followers
                            .filter((userFollow: any) => userFollow.state === "pending")
                            .map((userFollow: any) => (
                                <Box
                                    key={userFollow.follower.id}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        p: 1,
                                        mb: 1,
                                        borderRadius: 1,
                                        bgcolor: "action.hover",
                                    }}
                                >
                                    <Typography>{userFollow.follower.userName}</Typography>
                                    <Box>
                                        <IconButton
                                            onClick={() => handleAcceptFollow(userFollow.follower.id)}
                                            color="success"
                                            size="small"
                                            sx={{
                                                mr: 1,
                                                "&:hover": {
                                                    bgcolor: "success.main",
                                                    color: "success.contrastText",
                                                },
                                            }}
                                        >
                                            <CheckIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleRefuseFollow(userFollow.follower.id)}
                                            color="error"
                                            size="small"
                                            sx={{
                                                "&:hover": {
                                                    bgcolor: "error.main",
                                                    color: "error.contrastText",
                                                },
                                            }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))}
                    </AccordionDetails>
                </Accordion>
            )}
        </Box>
    );
}
