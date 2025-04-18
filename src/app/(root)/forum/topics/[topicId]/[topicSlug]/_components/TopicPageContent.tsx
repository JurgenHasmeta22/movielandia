"use client";

import { Box, Container, Typography, Button, Breadcrumbs, Link as MuiLink, Chip, Avatar, Divider, Paper } from "@mui/material";
import { useEffect, useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import Link from "next/link";
import { ForumCategory, ForumTopic } from "@prisma/client";
import PostList from "./PostList";
import CreatePostForm from "./CreatePostForm";
import { getPostsByTopicId } from "@/actions/forum/forumPost.actions";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PushPinIcon from "@mui/icons-material/PushPin";
import LockIcon from "@mui/icons-material/Lock";
import { formatDistanceToNow, format } from "date-fns";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface ITopicPageContentProps {
  topic: ForumTopic & {
    user: {
      id: number;
      userName: string;
      avatar?: { photoSrc: string } | null;
    };
  };
  category: ForumCategory;
  searchParams?: {
    page?: string;
  };
  session: any;
}

export default function TopicPageContent({ topic, category, searchParams, session }: ITopicPageContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useQueryState("page");
  const [posts, setPosts] = useState<{
    items: any[];
    total: number;
  }>({ items: [], total: 0 });
  
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      startTransition(async () => {
        try {
          const result = await getPostsByTopicId(topic.id, currentPage, limit);
          setPosts(result);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      });
    };

    fetchPosts();
  }, [topic.id, currentPage]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value === 1 ? null : value.toString());
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
        <Typography color="text.primary">{topic.title}</Typography>
      </Breadcrumbs>

      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: 2,
          backgroundColor: (theme) => theme.vars.palette.secondary.light,
          border: (theme) => `1px solid ${theme.vars.palette.primary.light}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          {topic.isPinned && (
            <PushPinIcon fontSize="small" color="primary" />
          )}
          {topic.isLocked && (
            <LockIcon fontSize="small" color="error" />
          )}
          <Typography variant="h4" component="h1" fontWeight="bold">
            {topic.title}
          </Typography>
        </Box>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Avatar 
            src={topic.user.avatar?.photoSrc || ""} 
            alt={topic.user.userName}
            sx={{ width: 32, height: 32 }}
          />
          <Typography variant="body2" color="text.secondary">
            Started by{" "}
            <Link href={`/users/${topic.user.id}/${topic.user.userName}`} style={{ textDecoration: "none" }}>
              {topic.user.userName}
            </Link>
            {" "}{format(new Date(topic.createdAt), "PPP")}
          </Typography>
          
          {topic.status !== "Open" && (
            <Chip 
              label={topic.status} 
              size="small" 
              color={topic.status === "Closed" ? "error" : "warning"} 
              sx={{ ml: 2 }}
            />
          )}
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <ReactQuill
            value={topic.content}
            readOnly={true}
            theme="snow"
            modules={{ toolbar: false }}
          />
        </Box>
        
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {formatDistanceToNow(new Date(topic.updatedAt), { addSuffix: true })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Views: {topic.viewCount}
          </Typography>
        </Box>
      </Paper>

      <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
        Replies
      </Typography>
      
      <PostList 
        posts={posts} 
        isPending={isPending} 
        currentPage={currentPage} 
        totalPages={Math.ceil(posts.total / limit)}
        onPageChange={handlePageChange}
        userLoggedIn={session?.user}
        topicLocked={topic.isLocked}
      />
      
      {session?.user && !topic.isLocked && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" component="h3" fontWeight="bold" sx={{ mb: 2 }}>
            Post a Reply
          </Typography>
          <CreatePostForm topicId={topic.id} userId={Number(session.user.id)} />
        </Box>
      )}
    </Container>
  );
}
