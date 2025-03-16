import { Box, Typography, IconButton, Stack, Tooltip, Card } from "@mui/material";
import { List } from "@prisma/client";
import Link from "next/link";
import LockIcon from "@mui/icons-material/Lock";
import ArchiveIcon from "@mui/icons-material/Archive";
import { formatDate } from "@/utils/helpers/utils";

interface ListCardProps {
    list: List & {
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

export default function ListCard({ list, username, userId }: ListCardProps) {
    const totalItems = list._count
        ? Object.values(list._count).reduce((acc, curr) => acc + curr, 0)
        : list.itemCount;

    return (
        <Link
            href={`/users/${userId}/${username}/lists/${list.id}/${list.name}`}
            style={{ textDecoration: "none" }}
        >
            <Card
                elevation={1}
                sx={{
                    width: { xs: "100%", sm: 280 },
                    height: "auto",
                    minHeight: 180,
                    maxHeight: 220,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
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
                            {list.name}
                        </Typography>
                        <Stack direction="row" spacing={0.5}>
                            {list.isPrivate && (
                                <Tooltip title="Private list">
                                    <IconButton size="small">
                                        <LockIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {list.isArchived && (
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
                            mb: "auto",
                            flexGrow: 1,
                        }}
                    >
                        {list.description || "No description"}
                    </Typography>

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                            mt: 2,
                            pt: 1,
                            borderTop: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            {totalItems} items
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {formatDate(list.createdAt)}
                        </Typography>
                    </Stack>
                </Box>
            </Card>
        </Link>
    );
}
