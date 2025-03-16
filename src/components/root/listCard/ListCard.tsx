import { Box, Typography, Stack, Tooltip, Card } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import LockIcon from "@mui/icons-material/Lock";
import ArchiveIcon from "@mui/icons-material/Archive";
import { formatDate } from "@/utils/helpers/utils";

interface ListCardProps {
    list: any;
    username: string;
    userId: number;
}

const getTotalItems = (counts: Record<string, number>) => {
    return Object.values(counts).reduce((acc, curr) => acc + curr, 0);
};

export default function ListCard({ list, username, userId }: ListCardProps) {
    const getListPath = () => {
        const formattedUsername = encodeURIComponent(username);
        const formattedListName = getDisplayName()
            ? encodeURIComponent(getDisplayName().trim().toLowerCase().split(/\s+/).join("-"))
            : "";

        return `/users/${userId}/${formattedUsername}/lists/${list.id}/${formattedListName}`;
    };

    const getDisplayName = () => {
        if (list.title) return list.title;
        if (list.fullname) return list.fullname;
        if (list.userName) return list.userName;
        if (list.name) return list.name;
        return "Untitled";
    };

    const getImageSrc = () => {
        return list.photoSrcProd || list.photo || list.image || "/images/placeholder.jpg";
    };

    const getFormattedDate = () => {
        try {
            return list?.createdAt ? formatDate(new Date(list.createdAt)) : "No date";
        } catch (error) {
            return "Invalid date";
        }
    };

    return (
        <Link href={getListPath()} style={{ textDecoration: "none" }}>
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
                <Box sx={{ p: 2, display: "flex", gap: 2 }}>
                    <Box sx={{ position: "relative", width: 60, height: 60, flexShrink: 0 }}>
                        <Image
                            src={getImageSrc()}
                            alt={list?.description || "No description available"}
                            fill
                            sizes="60px"
                            style={{
                                objectFit: "cover",
                                borderRadius: "8px",
                            }}
                        />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
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
                                {getDisplayName()}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                {list?.isPrivate && (
                                    <Tooltip title="Private list">
                                        <LockIcon fontSize="small" color="action" />
                                    </Tooltip>
                                )}
                                {list?.isArchived && (
                                    <Tooltip title="Archived list">
                                        <ArchiveIcon fontSize="small" color="action" />
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
                            {list?.description || "No description"}
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
                                {list?._count ? getTotalItems(list._count) : 0} items
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {getFormattedDate()}
                            </Typography>
                        </Stack>
                    </Box>
                </Box>
            </Card>
        </Link>
    );
}
