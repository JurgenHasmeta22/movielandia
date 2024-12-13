"use client";

import { Avatar, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { follow, unfollow } from "@/actions/user/userFollow.actions";
import { showToast } from "@/utils/helpers/toast";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { useTransition } from "react";
import CircularProgress from "@mui/material/CircularProgress";

interface UserListItemProps {
    user: {
        id: number;
        userName: string;
        bio: string;
        avatar?: { photoSrc: string } | null;
        followStatus?: {
            isFollowing: boolean;
            state: string | null;
        } | null;
    };
    userLoggedIn: {
        id: number;
        userName: string;
    } | null;
}

interface ButtonColors {
    main: string;
    hover: string;
}

const getButtonColors = (type: "follow" | "unfollow" | "pending"): ButtonColors => {
    switch (type) {
        case "follow":
            return {
                main: "#4cceac",
                hover: "#3da58a",
            };
        case "unfollow":
            return {
                main: "#db4f4a",
                hover: "#af3f3b",
            };
        case "pending":
            return {
                main: "#6870fa",
                hover: "#535ac8",
            };
    }
};

export default function UserListItem({ user, userLoggedIn }: UserListItemProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const getButtonConfig = () => {
        if (!user.followStatus) {
            return {
                text: "Follow",
                icon: <PersonAddIcon />,
                variant: "contained",
                action: "follow",
                colorType: "follow" as const,
            };
        }

        if (user.followStatus.state === "pending") {
            return {
                text: "Cancel Request",
                icon: <PersonRemoveIcon />,
                variant: "outlined",
                action: "unfollow",
                colorType: "pending" as const,
            };
        }

        if (user.followStatus.isFollowing) {
            return {
                text: "Unfollow",
                icon: <PersonRemoveIcon />,
                variant: "outlined",
                action: "unfollow",
                colorType: "unfollow" as const,
            };
        }

        return {
            text: "Follow",
            icon: <PersonAddIcon />,
            variant: "contained",
            action: "follow",
            colorType: "follow" as const,
        };
    };

    const handleFollowAction = async () => {
        if (!userLoggedIn) return;

        const config = getButtonConfig();

        startTransition(async () => {
            try {
                if (config.action === "unfollow") {
                    await unfollow(userLoggedIn.id, user.id);
                    showToast("success", "Unfollowed successfully!");
                } else {
                    await follow(userLoggedIn.id, user.id);
                    showToast("success", "Follow request sent successfully!");
                }

                router.refresh();
            } catch (error: any) {
                showToast("error", error.message || "Error performing follow action");
            }
        });
    };

    const buttonConfig = getButtonConfig();
    const buttonColors = getButtonColors(buttonConfig.colorType);

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
                        variant={buttonConfig.variant as "contained" | "outlined"}
                        startIcon={!isPending && buttonConfig.icon}
                        onClick={handleFollowAction}
                        disabled={isPending}
                        sx={{
                            minWidth: 100,
                            height: 32,
                            textTransform: "none",
                            borderRadius: 1,
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            ...(buttonConfig.variant === "contained"
                                ? {
                                      bgcolor: buttonColors.main,
                                      color: "#ffffff",
                                      border: "1px solid",
                                      borderColor: buttonColors.main,
                                      "&:hover": {
                                          bgcolor: buttonColors.hover,
                                          borderColor: buttonColors.hover,
                                      },
                                  }
                                : {
                                      bgcolor: "transparent",
                                      color: buttonColors.main,
                                      border: "1px solid",
                                      borderColor: buttonColors.main,
                                      "&:hover": {
                                          bgcolor: buttonColors.main,
                                          color: "#ffffff",
                                      },
                                  }),
                            transition: "all 0.2s ease-in-out",
                            "&:active": {
                                transform: "translateY(1px)",
                            },
                            "&:disabled": {
                                bgcolor:
                                    buttonConfig.variant === "contained" ? `${buttonColors.main}80` : "transparent",
                                borderColor: `${buttonColors.main}80`,
                                color: buttonConfig.variant === "contained" ? "#ffffff" : `${buttonColors.main}80`,
                            },
                        }}
                    >
                        {isPending ? (
                            <CircularProgress
                                size={20}
                                sx={{
                                    color: buttonConfig.variant === "contained" ? "#ffffff" : buttonColors.main,
                                }}
                            />
                        ) : (
                            buttonConfig.text
                        )}
                    </Button>
                )}
            </Stack>
        </Paper>
    );
}
