"use client";

import { Box, Container, Typography, TextField, Button, Breadcrumbs, Link as MuiLink, Paper } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ForumCategory } from "@prisma/client";
import { createTopic } from "@/actions/forum/forumTopic.actions";
import { toast } from "react-toastify";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface ICreateTopicPageContentProps {
  category: ForumCategory;
  userId: number;
}

export default function CreateTopicPageContent({ category, userId }: ICreateTopicPageContentProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a title for your topic.");
      return;
    }
    
    if (!content.trim()) {
      toast.error("Please enter content for your topic.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createTopic(title, content, category.id, userId);
      toast.success("Topic created successfully!");
      router.push(`/forum/categories/${category.id}/${category.slug}`);
    } catch (error) {
      toast.error("Failed to create topic. Please try again.");
      console.error("Error creating topic:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
        <MuiLink component={Link} href="/forum" underline="hover" color="inherit">
          Forum
        </MuiLink>
        <MuiLink 
          component={Link} 
          href={`/forum/categories/${category.id}/${category.slug}`} 
          underline="hover" 
          color="inherit"
        >
          {category.name}
        </MuiLink>
        <Typography color="text.primary">Create Topic</Typography>
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
          <TextField
            label="Topic Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          
          <Typography variant="subtitle1" gutterBottom>
            Content
          </Typography>
          <Box sx={{ mb: 3 }}>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              placeholder="Write your topic content here..."
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
              style={{ minHeight: "200px", marginBottom: "50px" }}
            />
          </Box>
          
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={() => router.push(`/forum/categories/${category.id}/${category.slug}`)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={isSubmitting || !title.trim() || !content.trim()}
            >
              {isSubmitting ? "Creating..." : "Create Topic"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
