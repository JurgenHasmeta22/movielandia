import { getPendingFollowRequests } from "@/actions/user/userFollow.actions";
import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import FollowersRequestsPageContent from "./_components/FollowersRequestsPageContent";

interface FollowRequestPageProps {
	params: {
		userId: string;
		userName: string;
	};
}

export default async function FollowersRequestsPage({
	params,
}: FollowRequestPageProps) {
	const session = await getServerSession(authOptions);
	const userId = Number(params.userId);
	const userLoggedInId = Number(session?.user?.id);
	const userLoggedInUsername = session?.user?.userName;
	const pendingFollowers = await getPendingFollowRequests(userId);

	return (
		<Suspense
			fallback={
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "100vh",
					}}
				>
					<CircularProgress />
				</Box>
			}
		>
			<FollowersRequestsPageContent
				pendingFollowers={pendingFollowers}
				userLoggedInUsername={userLoggedInUsername!}
				userLoggedInId={userLoggedInId}
			/>
		</Suspense>
	);
}
