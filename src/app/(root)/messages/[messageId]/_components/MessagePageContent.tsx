"use client";

import { Box, Button, Paper, Typography, Avatar, Stack, Divider } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

export default function MessagePageContent({ message }: { message: any }) {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 3 }}>
            <Paper
                sx={{
                    width: "100%",
                    maxWidth: 700,
                    p: 3,
                    mt: 10,
                    mb: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 500, color: "primary.main" }}>
                    Message Details
                </Typography>
                <Divider />
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                        alt={message.sender.userName}
                        src={message.sender.avatar?.photoSrc || undefined}
                        sx={{ width: 40, height: 40 }}
                    >
                        {!message.sender.avatar?.photoSrc && <PersonIcon />}
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        From:{" "}
                        <Link
                            href={`/users/${message.sender.id}/${message.sender.userName}`}
                            style={{
                                fontWeight: 400,
                                color: "text.secondary",
                                textDecoration: "none",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {message.sender.userName}
                        </Link>
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                        alt={message.receiver.userName}
                        src={message.receiver.avatar?.photoSrc || undefined}
                        sx={{ width: 40, height: 40 }}
                    >
                        {!message.receiver.avatar?.photoSrc && <PersonIcon />}
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        To:{" "}
                        <Link
                            href={`/users/${message.receiver.id}/${message.receiver.userName}`}
                            style={{
                                fontWeight: 400,
                                color: "text.secondary",
                                textDecoration: "none",
                                "&:hover": {
                                    textDecoration: "underline",
                                },
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {message.receiver.userName}
                        </Link>
                    </Typography>
                </Stack>
                <Box
                    sx={{
                        mt: 2,
                        p: 2,
                        bgcolor: "background.paper",
                        borderRadius: 1,
                        boxShadow: 1,
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                    }}
                    dangerouslySetInnerHTML={{ __html: message.text }}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                    {message.editedAt && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                            Edited {formatDistanceToNow(new Date(message.editedAt), { addSuffix: true })}
                        </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                        Sent {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button
                        onClick={handleBack}
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        color="primary"
                        sx={{
                            textTransform: "capitalize",
                        }}
                    >
                        Back to Messages
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
