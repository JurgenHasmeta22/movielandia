"use client";

import { Avatar, Box } from "@mui/material";

interface ProfileHeaderProps {
    avatar?: { photoSrc: string } | null;
    userName: string;
}

export default function ProfileHeader({ avatar, userName }: ProfileHeaderProps) {
    return (
        <Box
            sx={{
                position: "relative",
                width: { xs: 120, sm: 150 },
                height: { xs: 120, sm: 150 },
                flexShrink: 0,
            }}
        >
            <Avatar
                src={avatar?.photoSrc || "/images/default-avatar.png"}
                alt={userName}
                sx={{
                    width: "100%",
                    height: "100%",
                    border: "4px solid",
                    borderColor: "background.paper",
                    boxShadow: 2,
                }}
            />
        </Box>
    );
}
