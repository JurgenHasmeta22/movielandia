"use client";

import { useTransition } from "react";
import { Box, Button, IconButton, useTheme, Stack, CircularProgress, Tooltip } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { showToast } from "@/utils/helpers/toast";
import { useRouter } from "next/navigation";
import { follow, unfollow } from "@/actions/user/userFollow.actions";
import MessageIcon from "@mui/icons-material/Message";
import Link from "next/link";
import { socket } from "@/socket";

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
    userLoggedInId?: number;
}

export default function SocialSection({
    userLoggedIn,
    userInPage,
    userPendingFollowers,
    userLoggedInId,
}: SocialSectionProps) {
    const theme = useTheme();
    const router = useRouter();

    const [isPending, startTransition] = useTransition();

    const handleFollowUser = async () => {
        if (!userLoggedIn || !userInPage || isPending) return;

        startTransition(async () => {
            try {
                await follow(Number(userLoggedIn.id), Number(userInPage.id));
                showToast("success", "Follow request sent successfully!");

                socket.emit("sendNotification", {
                    type: "follow_request",
                    receiverId: Number(userInPage.id),
                    senderId: Number(userLoggedIn.id),
                    content: `${userLoggedIn.userName} sent you a follow request`,
                });

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

    const handleMessageUser = () => {
        if (!userLoggedInId || !userInPage.isFollowed || userInPage.isFollowedStatus !== "accepted") return;
        router.push(`/messages?section=compose&selectedUser=${userInPage.id}`);
    };

    return (
        <Box>
            {userLoggedIn && userLoggedIn.id !== userInPage.id && (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                        variant={userInPage.isFollowed ? "outlined" : "contained"}
                        startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : getFollowButtonIcon()}
                        size="small"
                        onClick={handleFollowAction}
                        disabled={isPending}
                        sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            fontSize: "0.9rem",
                            fontWeight: 500,
                            boxShadow: 1,
                            bgcolor: "background.paper",
                            color: theme.vars.palette.greyAccent.main,
                            borderWidth: 2,
                            height: 35,
                            minWidth: 100,
                            "&.Mui-disabled": {
                                bgcolor: "background.paper",
                                opacity: 0.7,
                            },
                        }}
                    >
                        {isPending ? "Processing..." : getFollowButtonText()}
                    </Button>
                    {userInPage.isFollowed && userInPage.isFollowedStatus === "accepted" && (
                        <Tooltip title="Send Message" placement="top">
                            <IconButton
                                onClick={handleMessageUser}
                                disabled={isPending}
                                size="small"
                                sx={{
                                    color: theme.vars.palette.greyAccent.main,
                                    "&:hover": {
                                        color: theme.vars.palette.primary.main,
                                        transform: "scale(1.1)",
                                    },
                                }}
                            >
                                <MessageIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>
            )}
            {userLoggedIn && userLoggedIn.id === userInPage.id && userPendingFollowers.items.length > 0 && (
                <Box sx={{ mt: 2, maxWidth: "100%" }}>
                    <Link href={`/users/${userInPage.id}/${userInPage.userName}/followersRequests`}>
                        <Button
                            variant="outlined"
                            sx={{
                                textTransform: "none",
                                borderRadius: 2,
                                fontSize: "0.9rem",
                                fontWeight: 500,
                                boxShadow: 1,
                                bgcolor: "background.paper",
                                color: theme.vars.palette.greyAccent.main,
                                borderWidth: 2,
                                height: 35,
                                minWidth: 100,
                                "&:hover": {
                                    bgcolor: "background.default",
                                },
                            }}
                        >
                            Follow Requests ({userPendingFollowers.items.length})
                        </Button>
                    </Link>
                </Box>
            )}
        </Box>
    );
}
