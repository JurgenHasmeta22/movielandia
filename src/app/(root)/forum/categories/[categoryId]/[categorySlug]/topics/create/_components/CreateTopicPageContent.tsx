"use client";

import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Breadcrumbs,
    Link as MuiLink,
    Paper,
    Alert,
} from "@mui/material";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ForumCategory } from "@prisma/client";
import { createTopic } from "@/actions/forum/forumTopic.actions";
import { toast } from "react-toastify";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import TagSelector from "@/app/(root)/forum/_components/TagSelector";
import TextEditor from "@/components/root/textEditor/TextEditor";
import { useRef } from "react";

interface ICreateTopicPageContentProps {
    category: ForumCategory;
    userId: number;
}

export default function CreateTopicPageContent({ category, userId }: ICreateTopicPageContentProps) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const editorRef = useRef(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Please enter a title for your topic.");
            return;
        }

        if (!content.trim()) {
            setError("Please enter content for your topic.");
            return;
        }

        setError(null);

        startTransition(async () => {
            try {
                const result = await createTopic(
                    title,
                    content,
                    category.id,
                    userId,
                    selectedTags.length > 0 ? selectedTags : undefined,
                );

                toast.success("Topic created successfully!");
                router.push(`/forum/categories/${category.id}/${category.slug}/topics/${result.id}/${result.slug}`);
            } catch (error) {
                setError(error instanceof Error ? error.message : "An error occurred while creating your topic.");
                toast.error("Failed to create topic. Please try again.");
            }
        });
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4, mt: 4 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
                <MuiLink component={Link} href="/forum" underline="hover" color="inherit">
                    Forum
                </MuiLink>
                <MuiLink
                    component={Link}
                    href={'/forum/categories'}
                    underline="hover"
                    color="inherit"
                >
                    Categories
                </MuiLink>
                <MuiLink
                    component={Link}
                    href={`/forum/categories/${category.id}/${category.slug}`}
                    underline="hover"
                    color="inherit"
                >
                    {category.name}
                </MuiLink>
                <Typography>Create Topic</Typography>
            </Breadcrumbs>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    Create New Topic
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    Start a new discussion in the {category.name} category.
                </Typography>
            </Box>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: (theme) => theme.vars.palette.secondary.light,
                    border: (theme) => `1px solid ${theme.vars.palette.primary.light}`,
                }}
            >
                <Box component="form" onSubmit={handleSubmit}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        label="Topic Title"
                        variant="outlined"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        sx={{ mb: 3 }}
                        disabled={isPending}
                    />
                    <Typography variant="subtitle1" gutterBottom>
                        Content
                    </Typography>
                    <Box sx={{ mb: 5 }}>
                        <TextEditor
                            value={content}
                            onChange={setContent}
                            ref={editorRef}
                            isDisabled={isPending}
                            type="topic"
                        />
                    </Box>
                    <TagSelector
                        selectedTags={selectedTags}
                        onChange={setSelectedTags}
                        label="Topic Tags"
                        placeholder="Select tags for your topic"
                        disabled={isPending}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => router.push(`/forum/categories/${category.id}/${category.slug}`)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isPending || !title.trim() || !content.trim()}
                        >
                            {isPending ? "Creating..." : "Create Topic"}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
