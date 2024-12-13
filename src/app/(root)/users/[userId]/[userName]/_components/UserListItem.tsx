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
    };
    userLoggedIn: {
        id: number;
        userName: string;
    } | null;
    isFollowingList?: boolean;
}

export default function UserListItem({ user, userLoggedIn, isFollowingList }: UserListItemProps) {
    const router = useRouter();

    const handleFollowAction = async () => {
        if (!userLoggedIn) return;

        try {
            if (isFollowingList) {
                await unfollow(userLoggedIn.id, user.id);
                showToast("success", "Unfollowed successfully!");
                router.push(`/users/${user.id}/${user.userName}`);
            } else {
                await follow(userLoggedIn.id, user.id);
                showToast("success", "Follow request sent successfully!");
                router.push(`/users/${user.id}/${user.userName}`);
            }
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
                        variant={isFollowingList ? "outlined" : "contained"}
                        startIcon={isFollowingList ? <PersonRemoveIcon /> : <PersonAddIcon />}
                        onClick={handleFollowAction}
                        sx={{
                            minWidth: 100,
                            height: 32,
                            textTransform: "none",
                            borderRadius: 1,
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            ...(isFollowingList
                                ? {
                                      bgcolor: "transparent",
                                      color: "#1976d2",
                                      border: "1px solid",
                                      borderColor: "#1976d2",
                                      "&:hover": {
                                          bgcolor: "#1976d2",
                                          color: "#ffffff",
                                          borderColor: "#1976d2",
                                      },
                                  }
                                : {
                                      bgcolor: "#1976d2",
                                      color: "#ffffff",
                                      border: "1px solid",
                                      borderColor: "#1976d2",
                                      "&:hover": {
                                          bgcolor: "#1565c0",
                                          borderColor: "#1565c0",
                                      },
                                  }),
                            transition: "all 0.2s ease-in-out",
                            "&:active": {
                                transform: "translateY(1px)",
                            },
                        }}
                    >
                        {isFollowingList ? "Unfollow" : "Follow"}
                    </Button>
                )}
            </Stack>
        </Paper>
    );
}
