"use client";

import { Box, Button, Paper, Typography, Alert } from "@mui/material";
import { useState, useRef, useTransition } from "react";
import { createPost } from "@/actions/forum/forumPost.actions";
import TextEditor from "@/components/root/textEditor/TextEditor";
import { showToast } from "@/utils/helpers/toast";

interface CreatePostFormProps {
  topicId: number;
  userId: number;
}

export default function CreatePostForm({ topicId, userId }: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const editorRef = useRef(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content || content === "<p><br></p>") {
      setError("Please enter some content for your post.");
      return;
    }
    
    setError(null);
    
    startTransition(async () => {
      try {
        await createPost(content, topicId, userId);
        setContent("");
        showToast("Post created successfully!", "success");
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred while creating your post.");
        showToast("Failed to create post.", "error");
      }
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} id="reply-form">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          backgroundColor: (theme) => theme.vars.palette.secondary.light,
          border: (theme) => `1px solid ${theme.vars.palette.primary.light}`,
        }}
      >
        <TextEditor
          value={content}
          onChange={setContent}
          ref={editorRef}
          isDisabled={isPending}
          type="post"
        />
        
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isPending}
          >
            {isPending ? "Posting..." : "Post Reply"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
