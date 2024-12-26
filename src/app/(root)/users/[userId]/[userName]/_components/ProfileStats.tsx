"use client";

import { Stack, Typography, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";

interface ProfileStatsProps {
    userInPage: {
        id: number;
        userName: string;
    };
    followersCount: number;
    followingCount: number;
    canClickFollow: boolean;
}

export default function ProfileStats({
    userInPage,
    followersCount,
    followingCount,
    canClickFollow,
}: ProfileStatsProps) {
    const router = useRouter();

    return (
        <Stack spacing={2} alignItems="flex-end" sx={{ ml: "auto", mr: 2 }}>
            <Box
                onClick={() => {
                    if (canClickFollow) {
                        router.push(`/users/${userInPage.id}/${userInPage.userName}/followers`);
                    }
                }}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    cursor: canClickFollow ? "pointer" : "default",
                    "&:hover": canClickFollow
                        ? {
                              "& .MuiTypography-root, & .MuiSvgIcon-root": {
                                  color: "primary.main",
                              },
                          }
                        : undefined,
                }}
            >
                <PeopleIcon color="action" />
                <Typography variant="h6" color="text.primary" sx={{ fontWeight: 500 }}>
                    Followers:
                </Typography>
                <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                    {followersCount}
                </Typography>
            </Box>
            <Box
                onClick={() => {
                    if (canClickFollow) {
                        router.push(`/users/${userInPage.id}/${userInPage.userName}/following`);
                    }
                }}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    cursor: canClickFollow ? "pointer" : "default",
                    "&:hover": canClickFollow
                        ? {
                              "& .MuiTypography-root, & .MuiSvgIcon-root": {
                                  color: "primary.main",
                              },
                          }
                        : undefined,
                }}
            >
                <PersonIcon color="action" />
                <Typography variant="h6" color="text.primary" sx={{ fontWeight: 500 }}>
                    Following:
                </Typography>
                <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                    {followingCount}
                </Typography>
            </Box>
        </Stack>
    );
}
