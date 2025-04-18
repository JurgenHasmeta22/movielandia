"use client";

import { Box, Container, Typography, Paper, Button, Stack, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import ForumCategoryList from "./ForumCategoryList";
import ForumStats from "./ForumStats";
import { getForumStats } from "@/actions/forum/forumCategory.actions";

interface IForumPageContentProps {
  searchParams?: {
    page?: string;
  };
  session: any;
}

export default function ForumPageContent({ searchParams, session }: IForumPageContentProps) {
  const router = useRouter();
  const [page, setPage] = useQueryState("page");
  const [stats, setStats] = useState<{ categoriesCount: number; topicsCount: number; postsCount: number } | null>(null);
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const forumStats = await getForumStats();
        setStats(forumStats);
      } catch (error) {
        console.error("Error fetching forum stats:", error);
      }
    };

    fetchStats();
  }, []);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value === 1 ? null : value.toString());
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Community Forum
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Join discussions about your favorite movies and series with other movie enthusiasts.
        </Typography>
      </Box>

      {stats && <ForumStats stats={stats} />}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, mt: 4 }}>
        <Typography variant="h5" component="h2" fontWeight="bold">
          Categories
        </Typography>
        {session?.user?.role === "ADMIN" && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => router.push("/forum/categories/create")}
          >
            Create Category
          </Button>
        )}
      </Box>
      
      <ForumCategoryList currentPage={currentPage} onPageChange={handlePageChange} />
    </Container>
  );
}
