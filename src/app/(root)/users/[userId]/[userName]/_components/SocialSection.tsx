"use client";

import { useState } from "react";
import {
    Box,
    Button,
    IconButton,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useTheme,
    Stack,
} from "@mui/material";
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
    const theme = useTheme();

    const [followersExpanded, setFollowersExpanded] = useState<boolean>(
        userInPage.followers?.filter((userFollow: any) => userFollow.state === "pending").length > 0,
    );

    const handleFollowUser = async () => {
        if (!userLoggedIn || !userInPage) return;

        try {
            await follow(Number(userLoggedIn.id), Number(userInPage.id));
            showToast("success", "Follow request sent successfully!");
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
            {userLoggedIn && userLoggedIn.id !== userInPage.id && (
                <Button
                    variant={userInPage.isFollowed ? "outlined" : "contained"}
                    startIcon={userInPage.isFollowed ? <PersonRemoveIcon /> : <PersonAddIcon />}
                    size="large"
                    onClick={handleFollowAction}
                    sx={{
                        minWidth: 140,
                        height: 45,
                        textTransform: "none",
                        borderRadius: 2,
                        fontSize: "1rem",
                        fontWeight: 500,
                        boxShadow: 1,
                        transition: "all 0.2s ease-in-out",
                        ...(userInPage.isFollowed
                            ? {
                                  borderColor: "primary.light",
                                  color: "primary.main",
                                  borderWidth: 2,
                                  bgcolor: "transparent",
                                  "&:hover": {
                                      bgcolor: "grey.200",
                                      borderColor: "primary.main",
                                      color: "primary.main",
                                      transform: "translateY(-2px)",
                                      boxShadow: 2,
                                  },
                              }
                            : {
                                  bgcolor: "primary.main",
                                  "&:hover": {
                                      bgcolor: "primary.600",
                                      transform: "translateY(-2px)",
                                      boxShadow: 3,
                                  },
                              }),
                    }}
                >
                    {userInPage.isFollowed ? "Following" : "Follow"}
                </Button>
            )}

            {/* Only show pending follow requests accordion when viewing own profile */}
            {userLoggedIn &&
                userLoggedIn.id === userInPage.id &&
                userInPage.followers?.filter((userFollow: any) => userFollow.state === "pending").length > 0 && (
                    <Box sx={{ mt: 2, maxWidth: "300px" }}>
                        <Accordion
                            expanded={followersExpanded}
                            onChange={() => setFollowersExpanded(!followersExpanded)}
                            sx={{
                                bgcolor: "background.paper",
                                borderRadius: 2,
                                boxShadow: 1,
                                width: "100%",
                                "& .MuiAccordionSummary-root": {
                                    borderRadius: 2,
                                },
                                "& .MuiAccordionDetails-root": {
                                    p: 2,
                                },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography variant="subtitle1" fontWeight={500}>
                                    Followers Requests (
                                    {
                                        userInPage.followers?.filter(
                                            (userFollow: any) => userFollow.state === "pending",
                                        ).length
                                    }
                                    )
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack spacing={2}>
                                    {userInPage.followers
                                        ?.filter((userFollow: any) => userFollow.state === "pending")
                                        .map((userFollow: any) => (
                                            <Box
                                                key={userFollow.follower.id}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    bgcolor: "background.default",
                                                    boxShadow: 1,
                                                }}
                                            >
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    {userFollow.follower.userName}
                                                </Typography>
                                                <Box>
                                                    <IconButton
                                                        onClick={() => handleAcceptFollow(userFollow.follower.id)}
                                                        sx={{
                                                            color: "success.main",
                                                            "&:hover": {
                                                                color: "success.dark",
                                                                transform: "scale(1.1)",
                                                            },
                                                        }}
                                                    >
                                                        <CheckIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleRefuseFollow(userFollow.follower.id)}
                                                        sx={{
                                                            color: "error.main",
                                                            "&:hover": {
                                                                color: "error.dark",
                                                                transform: "scale(1.1)",
                                                            },
                                                        }}
                                                    >
                                                        <CloseIcon />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        ))}
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                )}
        </Box>
    );
}
