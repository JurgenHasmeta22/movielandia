"use client";

import { Box, Container, Pagination, Stack, Typography } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import UserListItem from "../../_components/UserListItem";

interface FollowingContentProps {
    userInPage: {
        id: number;
        userName: string;
        email: string;
        password: string | null;
        role: string;
        bio: string;
        active: boolean;
        canResetPassword: boolean;
        avatar?: { photoSrc: string } | null;
        isFollowed?: boolean;
        isFollowedStatus?: string | null;
    };
    following: {
        items: any[];
        total: number;
    };
    userLoggedIn: {
        id: number;
        userName: string;
        email: string;
        password: string | null;
        role: string;
        bio: string;
        active: boolean;
        canResetPassword: boolean;
    } | null;
}

export default function FollowingContent({ userInPage, following, userLoggedIn }: FollowingContentProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const page = Number(searchParams?.get("page")) || 1;
    const perPage = 10;
    const totalPages = Math.ceil(following.total / perPage);

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
                {userInPage.userName} is Following
            </Typography>
            <Stack spacing={2}>
                {following.items.length > 0 ? (
                    following.items.map((follow: any) => (
                        <UserListItem
                            key={follow.following.id}
                            user={follow.following}
                            userLoggedIn={userLoggedIn}
                            isFollowingList={true}
                        />
                    ))
                ) : (
                    <Typography color="text.secondary" textAlign="center">
                        Not following anyone yet
                    </Typography>
                )}
            </Stack>
            {following.total > perPage && (
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
