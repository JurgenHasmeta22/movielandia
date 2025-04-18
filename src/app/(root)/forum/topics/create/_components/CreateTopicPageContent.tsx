"use client";

import {
    Box,
    Container,
    Typography,
    Breadcrumbs,
    Link as MuiLink,
    Paper,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Alert,
} from "@mui/material";
import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ForumCategory } from "@prisma/client";
import TextEditor from "@/components/root/textEditor/TextEditor";
import { createTopic } from "@/actions/forum/forumTopic.actions";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { showToast } from "@/utils/helpers/toast";

interface ICreateTopicPageContentProps {
    categories: ForumCategory[];
    initialCategoryId?: number;
    session: any;
}

export default function CreateTopicPageContent({
    categories,
    initialCategoryId,
    session,
}: ICreateTopicPageContentProps) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState<number | "">(!initialCategoryId ? "" : initialCategoryId);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const editorRef = useRef(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Please enter a title for your topic.");
            return;
        }

        if (!content || content === "<p><br></p>") {
            setError("Please enter some content for your topic.");
            return;
        }

        if (!categoryId) {
            setError("Please select a category for your topic.");
            return;
        }

        setError(null);

        startTransition(async () => {
            try {
                await createTopic(title, content, Number(categoryId), Number(session.user.id));
                showToast("Topic created successfully!", "success");
                router.push(`/forum/categories/${categoryId}`);
            } catch (error) {
                setError(error instanceof Error ? error.message : "An error occurred while creating your topic.");
                showToast("Failed to create topic.", "error");
            }
        });
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
                <MuiLink component={Link} href="/forum" underline="hover" color="inherit">
                    Forum
                </MuiLink>
                {initialCategoryId && categories.find((cat) => cat.id === initialCategoryId) && (
                    <MuiLink
                        component={Link}
                        href={`/forum/categories/${initialCategoryId}/${categories.find((cat) => cat.id === initialCategoryId)?.slug}`}
                        underline="hover"
                        color="inherit"
                    >
                        {categories.find((cat) => cat.id === initialCategoryId)?.name}
                    </MuiLink>
                )}
                <Typography color="text.primary">Create Topic</Typography>
            </Breadcrumbs>

            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Create New Topic
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 2,
                        backgroundColor: (theme) => theme.vars.palette.secondary.light,
                        border: (theme) => `1px solid ${theme.vars.palette.primary.light}`,
                    }}
                >
                    <TextField
                        label="Topic Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        required
                        sx={{ mb: 3 }}
                        disabled={isPending}
                    />

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="category-select-label">Category</InputLabel>
                        <Select
                            labelId="category-select-label"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value as number)}
                            label="Category"
                            required
                            disabled={isPending || !!initialCategoryId}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Typography variant="subtitle1" gutterBottom>
                        Topic Content
                    </Typography>

                    <TextEditor
                        value={content}
                        onChange={setContent}
                        ref={editorRef}
                        isDisabled={isPending}
                        type="topic"
                    />
                </Paper>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Button variant="outlined" onClick={() => router.back()} disabled={isPending}>
                        Cancel
                    </Button>

                    <Button type="submit" variant="contained" color="primary" disabled={isPending}>
                        {isPending ? "Creating..." : "Create Topic"}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
