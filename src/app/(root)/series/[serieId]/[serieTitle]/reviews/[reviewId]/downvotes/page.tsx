import { getDownvotesByReviewId } from "@/actions/review/reviewVotes.actions";
import SerieReviewDownvotesPageContent from "./_components/SerieReviewDownvotesPageContent";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { Suspense } from "react";

interface IDownvotesPageProps {
	params: {
		reviewId: string;
	};
	searchParams?: Promise<{ page?: string }>;
}

export default async function DownvotesPage(props: IDownvotesPageProps) {
	const session = await getServerSession(authOptions);
	const userSession = session?.user
		? {
				id: Number(session.user.id),
				userName: session.user.userName,
				email: session.user.email,
				password: null,
				role: session.user.role,
				bio: "",
				active: true,
				canResetPassword: false,
			}
		: null;

	const params = await props.params;
	const searchParams = await props.searchParams;
	const searchParamsKey = JSON.stringify(searchParams);
	const page = Number(searchParams?.page) || 1;

	const downvotes = await getDownvotesByReviewId(
		Number(params.reviewId),
		"serie",
		page,
	);

	return (
		<Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
			<SerieReviewDownvotesPageContent
				downvotes={downvotes}
				userLoggedIn={userSession}
			/>
		</Suspense>
	);
}
