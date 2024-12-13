"use client";

import { Avatar, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { follow, unfollow } from "@/actions/user/userFollow.actions";
import { showToast } from "@/utils/helpers/toast";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

interface UserListItemProps {
    user: {
        id: number;
        userName: string;
        bio: string;
        avatar?: { photoSrc: string } | null;
        isFollowed?: boolean;
        isFollowedStatus?: string | null;
    };
    userLoggedIn: {
        id: number;
        userName: string;
    } | null;
    onActionComplete?: () => void;
}

export default function UserListItem({ user, userLoggedIn, onActionComplete }: UserListItemProps) {
    const router = useRouter();

    const handleFollowAction = async () => {
        if (!userLoggedIn) return;

        try {
            if (!user.isFollowed) {
                await follow(userLoggedIn.id, user.id);
                showToast("success", "Follow request sent successfully!");
            } else {
                await unfollow(userLoggedIn.id, user.id);
                showToast("success", "Unfollowed successfully!");
            }

            if (onActionComplete) onActionComplete();
            router.refresh();
        } catch (error: any) {
            showToast("error", error.message || "Error performing follow action");
        }
    };

    return (
        <Paper
            elevation={1}
            sx={{
                p: 2,
                borderRadius: 2,
                transition: "all 0.2s",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 2,
                },
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center">
                <Link href={`/users/${user.id}/${user.userName}`} style={{ textDecoration: "none" }}>
                    <Avatar
                        src={user.avatar?.photoSrc || "/images/default-avatar.png"}
                        alt={user.userName}
                        sx={{
                            width: 50,
                            height: 50,
                            cursor: "pointer",
                            border: "2px solid",
                            borderColor: "background.paper",
                            transition: "transform 0.2s",
                            "&:hover": {
                                transform: "scale(1.05)",
                            },
                        }}
                    />
                </Link>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Link
                        href={`/users/${user.id}/${user.userName}`}
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 500,
                                cursor: "pointer",
                                display: "inline-block",
                                "&:hover": {
                                    color: "primary.main",
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            {user.userName}
                        </Typography>
                    </Link>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {user.bio || "No bio yet"}
                    </Typography>
                </Box>
                {userLoggedIn && userLoggedIn.id !== user.id && (
                    <Button
                        variant={user.isFollowed ? "outlined" : "contained"}
                        startIcon={user.isFollowed ? <PersonRemoveIcon /> : <PersonAddIcon />}
                        onClick={handleFollowAction}
                        sx={{
                            minWidth: 100,
                            height: 32,
                            textTransform: "none",
                            borderRadius: 1,
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            bgcolor: user.isFollowed ? "background.paper" : "primary.main",
                            color: user.isFollowed ? "primary.main" : "secondary",
                            border: "1px solid",
                            borderColor: user.isFollowed ? "grey.300" : "primary.main",
                            boxShadow: user.isFollowed ? "none" : 1,
                            "&:hover": {
                                color: user.isFollowed ? "primary.main" : "primary.main",
                                bgcolor: user.isFollowed ? "grey.100" : "primary.dark",
                                borderColor: user.isFollowed ? "grey.400" : "primary.dark",
                                boxShadow: user.isFollowed ? "none" : 2,
                            },
                            "&:active": {
                                bgcolor: user.isFollowed ? "grey.200" : "primary.dark",
                                borderColor: user.isFollowed ? "grey.500" : "primary.dark",
                            },
                        }}
                    >
                        {user.isFollowed ? (user.isFollowedStatus === "pending" ? "Requested" : "Following") : "Follow"}
                    </Button>
                )}
            </Stack>
        </Paper>
    );
}
