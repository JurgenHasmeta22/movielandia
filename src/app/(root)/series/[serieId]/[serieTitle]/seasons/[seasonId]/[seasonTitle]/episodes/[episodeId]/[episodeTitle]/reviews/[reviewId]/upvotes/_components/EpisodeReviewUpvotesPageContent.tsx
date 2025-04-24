"use client";

import {
	Box,
	Container,
	Pagination,
	Stack,
	Typography,
	Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useQueryState } from "nuqs";
import UserListItem from "@/app/(root)/users/[userId]/[userName]/_components/UserListItem";

interface UpvotesContentProps {
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
	upvotes: {
		items: Array<{
			user: {
				id: number;
				userName: string;
				bio: string;
				avatar?: { photoSrc: string } | null;
			};
		}>;
		total: number;
	};
}

export default function UpvotesContent({
	upvotes,
	userLoggedIn,
}: UpvotesContentProps) {
	const router = useRouter();

	const [page, setPage] = useQueryState("page", {
		defaultValue: "1",
		parse: (value) => value || "1",
		history: "push",
		shallow: false,
	});

	const perPage = 10;
	const totalPages = Math.ceil(upvotes.total / perPage);

	const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
		setPage(value.toString());
	};

	return (
		<Container maxWidth="md" sx={{ py: 4, mt: 8, mb: 8 }}>
			<Button
				variant="outlined"
				startIcon={<ArrowBackIcon />}
				onClick={() => {
					router.back();
					router.refresh();
				}}
				sx={{ mb: 2 }}
			>
				Go Back
			</Button>
			<Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 3 }}>
				Upvotes
			</Typography>
			<Stack spacing={2}>
				{upvotes.items.length > 0 ? (
					upvotes.items.map((upvote) => (
						<UserListItem
							key={upvote.user.id}
							user={upvote.user}
							userLoggedIn={userLoggedIn}
						/>
					))
				) : (
					<Typography color="text.secondary" textAlign="center">
						No upvotes yet
					</Typography>
				)}
			</Stack>
			{upvotes.total > perPage && (
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
