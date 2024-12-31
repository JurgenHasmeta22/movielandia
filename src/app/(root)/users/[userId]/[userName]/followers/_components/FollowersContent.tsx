"use client";

import { Box, Container, Pagination, Stack, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import UserListItem from "../../_components/UserListItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useQueryState } from "nuqs";

interface FollowersContentProps {
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
    followers: {
        items: Array<{
            follower: {
                id: number;
                userName: string;
                bio: string;
                avatar?: { photoSrc: string } | null;
                followStatus?: {
                    isFollowing: boolean;
                    state: string | null;
                } | null;
            };
        }>;
        total: number;
    };
}

export default function FollowersContent({ userInPage, followers, userLoggedIn }: FollowersContentProps) {
    const router = useRouter();

    const [page, setPage] = useQueryState("page", {
        defaultValue: "1",
        parse: (value) => value || "1",
        history: "push",
        shallow: false,
    });

    const perPage = 10;
    const totalPages = Math.ceil(followers.total / perPage);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value.toString());
    };

    return (
        <Container maxWidth="md" sx={{ py: 4, mt: 8, mb: 8 }}>
            <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => {
                    router.push(`/users/${userInPage.id}/${userInPage.userName}`);
                    router.refresh();
                }}
                sx={{ mb: 2 }}
            >
                Go Back
            </Button>
            <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 3 }}>
                {userInPage.userName}&apos;s Followers
            </Typography>
            <Stack spacing={2}>
                {followers.items.length > 0 ? (
                    followers.items.map((follow) => (
                        <UserListItem key={follow.follower.id} user={follow.follower} userLoggedIn={userLoggedIn} />
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
                        page={Number(page)}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                    />
                </Box>
            )}
        </Container>
    );
}
