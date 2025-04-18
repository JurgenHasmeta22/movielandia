"use client";

import { Box, Paper, Typography, Grid } from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import TopicIcon from "@mui/icons-material/Topic";
import ChatIcon from "@mui/icons-material/Chat";
import { useTheme } from "@mui/material/styles";

interface ForumStatsProps {
    stats: {
        categoriesCount: number;
        topicsCount: number;
        postsCount: number;
    };
}

export default function ForumStats({ stats }: ForumStatsProps) {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: theme.vars.palette.secondary.light,
                border: `1px solid ${theme.vars.palette.primary.light}`,
            }}
        >
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", textAlign: "center" }}>
                        <ForumIcon sx={{ fontSize: 40, color: theme.vars.palette.primary.main, mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            {stats.categoriesCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Categories
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", textAlign: "center" }}>
                        <TopicIcon sx={{ fontSize: 40, color: theme.vars.palette.primary.main, mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            {stats.topicsCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Topics
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", textAlign: "center" }}>
                        <ChatIcon sx={{ fontSize: 40, color: theme.vars.palette.primary.main, mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            {stats.postsCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Posts
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}
