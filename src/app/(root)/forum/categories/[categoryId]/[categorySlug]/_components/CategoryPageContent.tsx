"use client";

import { Box, Container, Typography, Button, Breadcrumbs, Link as MuiLink } from "@mui/material";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import Link from "next/link";
import { ForumCategory } from "@prisma/client";
import TopicList from "./TopicList";
import { getTopics } from "@/actions/forum/forumTopic.actions";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

interface ICategoryPageContentProps {
  category: ForumCategory;
  searchParams?: {
    page?: string;
    sortBy?: string;
    order?: string;
  };
  session: any;
}

export default function CategoryPageContent({ category, searchParams, session }: ICategoryPageContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useQueryState("page");
  const [sortBy, setSortBy] = useQueryState("sortBy");
  const [order, setOrder] = useQueryState("order");
  
  const [topics, setTopics] = useState<{
    items: any[];
    total: number;
  }>({ items: [], total: 0 });
  
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
  const currentSortBy = searchParams?.sortBy || "lastPostAt";
  const currentOrder = searchParams?.order || "desc";
  const limit = 10;

  useEffect(() => {
    const fetchTopics = async () => {
      startTransition(async () => {
        try {
          const result = await getTopics(category.id, currentPage, limit);
          setTopics(result);
        } catch (error) {
          console.error("Error fetching topics:", error);
        }
      });
    };

    fetchTopics();
  }, [category.id, currentPage, currentSortBy, currentOrder]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value === 1 ? null : value.toString());
  };

  const handleCreateTopic = () => {
    router.push(`/forum/topics/create?categoryId=${category.id}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
        <MuiLink component={Link} href="/forum" underline="hover" color="inherit">
          Forum
        </MuiLink>
        <Typography color="text.primary">{category.name}</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          {category.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {category.description}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" component="h2" fontWeight="bold">
          Topics
        </Typography>
        {session?.user && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleCreateTopic}
          >
            Create Topic
          </Button>
        )}
      </Box>
      
      <TopicList 
        topics={topics} 
        isPending={isPending} 
        currentPage={currentPage} 
        totalPages={Math.ceil(topics.total / limit)}
        onPageChange={handlePageChange}
        userLoggedIn={session?.user}
      />
    </Container>
  );
}
