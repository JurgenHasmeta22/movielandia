"use client";

import { useState, useTransition } from "react";
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
    CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { showToast } from "@/utils/helpers/toast";
import { useRouter } from "next/navigation";
import { follow, unfollow, acceptFollowRequest, refuseFollowRequest } from "@/actions/user/userFollow.actions";

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
    userPendingFollowers: any;
}

export default function SocialSection({ userLoggedIn, userInPage, userPendingFollowers }: SocialSectionProps) {
    const theme = useTheme();
    const router = useRouter();

    const [isPending, startTransition] = useTransition();
    const [pendingActionId, setPendingActionId] = useState<number | null>(null);
    const [followersExpanded, setFollowersExpanded] = useState<boolean>(userPendingFollowers.items.length > 0);

    const handleFollowUser = async () => {
        if (!userLoggedIn || !userInPage || isPending) return;

        startTransition(async () => {
            try {
                await follow(Number(userLoggedIn.id), Number(userInPage.id));
                showToast("success", "Follow request sent successfully!");
                router.refresh();
            } catch (error: any) {
                console.error(`Error following user: ${error.message}`);
                showToast("error", error.message || "Error following user");
            }
        });
    };

    const handleUnfollowUser = async () => {
        if (!userLoggedIn || !userInPage || isPending) return;

        startTransition(async () => {
            try {
                await unfollow(Number(userLoggedIn.id), Number(userInPage.id));
                showToast("success", "Unfollowed successfully!");
                router.refresh();
            } catch (error: any) {
                console.error(`Error unfollowing user: ${error.message}`);
                showToast("error", error.message || "Error unfollowing user");
            }
        });
    };

    const handleAcceptFollow = async (followerId: number) => {
        if (!userLoggedIn || isPending) return;

        setPendingActionId(followerId);
        startTransition(async () => {
            try {
                await acceptFollowRequest(followerId, Number(userLoggedIn.id));
                showToast("success", "Follow request accepted!");
                setFollowersExpanded(false);
                router.refresh();
            } catch (error: any) {
                console.error(`Error accepting follow request: ${error.message}`);
                showToast("error", error.message || "Error accepting follow request");
            } finally {
                setPendingActionId(null);
            }
        });
    };

    const handleRefuseFollow = async (followerId: number) => {
        if (!userLoggedIn || isPending) return;

        setPendingActionId(followerId);
        startTransition(async () => {
            try {
                await refuseFollowRequest(followerId, Number(userLoggedIn.id));
                showToast("success", "Follow request succesfully refused!");
                setFollowersExpanded(false);
                router.refresh();
            } catch (error: any) {
                console.error(`Error refusing follow request: ${error.message}`);
                showToast("error", error.message || "Error refusing follow request");
            } finally {
                setPendingActionId(null);
            }
        });
    };

    const handleFollowAction = async () => {
        if (!userInPage.isFollowed) {
            await handleFollowUser();
        } else {
            await handleUnfollowUser();
        }
    };

    const getFollowButtonText = () => {
        if (userInPage.isFollowed) {
            if (userInPage.isFollowedStatus === "pending") {
                return "Requested";
            }

            return "Following";
        }

        return "Follow";
    };

    const getFollowButtonIcon = () => {
        if (userInPage.isFollowed) {
            return <PersonRemoveIcon />;
        }

        return <PersonAddIcon />;
    };

    return (
        <Box>
            {userLoggedIn && userLoggedIn.id !== userInPage.id && (
                <Button
                    variant={userInPage.isFollowed ? "outlined" : "contained"}
                    startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : getFollowButtonIcon()}
                    size="large"
                    onClick={handleFollowAction}
                    disabled={isPending}
                    sx={{
                        minWidth: 140,
                        height: 45,
                        textTransform: "none",
                        borderRadius: 2,
                        fontSize: "1.2rem",
                        fontWeight: 500,
                        boxShadow: 1,
                        bgcolor: "background.paper",
                        color: theme.vars.palette.greyAccent.main,
                        borderWidth: 2,
                        "&.Mui-disabled": {
                            bgcolor: "background.paper",
                            opacity: 0.7,
                        },
                    }}
                >
                    {isPending ? "Processing..." : getFollowButtonText()}
                </Button>
            )}
            {userLoggedIn && userLoggedIn.id === userInPage.id && userPendingFollowers.items.length > 0 && (
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
                                Followers Requests ({userPendingFollowers.items.length})
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={2}>
                                {userPendingFollowers.items.map((follow: any) => (
                                    <Box
                                        key={follow.follower.id}
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
                                            {follow.follower.userName}
                                        </Typography>
                                        <Box>
                                            <IconButton
                                                onClick={() => handleAcceptFollow(follow.follower.id)}
                                                disabled={isPending}
                                                sx={{
                                                    color: "success.main",
                                                    "&:hover": {
                                                        color: "success.dark",
                                                        transform: "scale(1.1)",
                                                    },
                                                }}
                                            >
                                                {isPending && pendingActionId === follow.follower.id ? (
                                                    <CircularProgress size={20} color="inherit" />
                                                ) : (
                                                    <CheckIcon />
                                                )}
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleRefuseFollow(follow.follower.id)}
                                                disabled={isPending}
                                                sx={{
                                                    color: "error.main",
                                                    "&:hover": {
                                                        color: "error.dark",
                                                        transform: "scale(1.1)",
                                                    },
                                                }}
                                            >
                                                {isPending && pendingActionId === follow.follower.id ? (
                                                    <CircularProgress size={20} color="inherit" />
                                                ) : (
                                                    <CloseIcon />
                                                )}
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
