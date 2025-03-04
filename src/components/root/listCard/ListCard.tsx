import { Box, Typography, IconButton, Stack, Tooltip } from "@mui/material";
import { Playlist } from "@prisma/client";
import Link from "next/link";
import LockIcon from "@mui/icons-material/Lock";
import ArchiveIcon from "@mui/icons-material/Archive";
import { formatDate } from "@/utils/helpers/utils";

interface ListCardProps {
    playlist: Playlist & {
        _count?: {
            movieItems: number;
            serieItems: number;
            seasonItems: number;
            episodeItems: number;
            actorItems: number;
            crewItems: number;
        };
    };
    username: string;
    userId: number;
}

export default function ListCard({ playlist, username, userId }: ListCardProps) {
    const totalItems = playlist._count
        ? Object.values(playlist._count).reduce((acc, curr) => acc + curr, 0)
        : playlist.itemCount;

    return (
        <Link href={`/users/${userId}/${username}/lists/${playlist.id}`} passHref>
            <Box
                sx={{
                    width: { xs: "100%", sm: "280px" },
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    overflow: "hidden",
                    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    cursor: "pointer",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                color: "text.primary",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {playlist.name}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            {playlist.isPrivate && (
                                <Tooltip title="Private list">
                                    <IconButton size="small">
                                        <LockIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {playlist.isArchived && (
                                <Tooltip title="Archived list">
                                    <IconButton size="small">
                                        <ArchiveIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Stack>
                    </Stack>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "text.secondary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            mb: 2,
                            height: "40px",
                        }}
                    >
                        {playlist.description || "No description"}
                    </Typography>

                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: "auto" }}>
                        <Typography variant="body2" color="text.secondary">
                            {totalItems} items
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {formatDate(playlist.updatedAt)}
                        </Typography>
                    </Stack>
                </Box>
            </Box>
        </Link>
    );
}
