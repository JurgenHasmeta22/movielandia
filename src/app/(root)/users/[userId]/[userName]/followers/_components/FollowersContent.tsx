"use client";

import { Box, Container, Pagination, Stack, Typography } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import UserListItem from "../../_components/UserListItem";

interface FollowersContentProps {
    userInPage: any;
    followers: {
        items: any[];
        total: number;
    };
}

export default function FollowersContent({ userInPage, followers }: FollowersContentProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const page = Number(searchParams?.get("page")) || 1;
    const perPage = 10;
    const totalPages = Math.ceil(followers.total / perPage);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set("page", value.toString());
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${window.location.pathname}${query}`);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4, mt: 8, mb: 8 }}>
            <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 3 }}>
                {userInPage.userName}&apos;s Followers
            </Typography>
            <Stack spacing={2}>
                {followers.items.length > 0 ? (
                    followers.items.map((follow: any) => (
                        <UserListItem key={follow.follower.id} user={follow.follower} userLoggedIn={userInPage} />
                    ))
                ) : (
                    <Typography color="text.secondary" textAlign="center">
                        No followers yet
                    </Typography>
                )}
            </Stack>
            {followers.total > perPage && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                    />
                </Box>
            )}
        </Container>
    );
}
