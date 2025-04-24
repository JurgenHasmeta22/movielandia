import { getUserById } from "@/actions/user/user.actions";
import {
	getFollowers,
	getFollowing,
	getPendingFollowRequests,
} from "@/actions/user/userFollow.actions";
import {
	getUserFavorites,
	getUserReviews,
	getUserVotes,
} from "@/actions/user/userProfile.actions";
import {
	getUserForumTopics,
	getUserForumReplies,
} from "@/actions/user/userForum.actions";
import { notFound } from "next/navigation";
import UserPageContent from "./UserPageContent";

interface UserPageContentWrapperProps {
	searchParams:
		| { maintab?: string; subtab?: string; page?: string; search?: string }
		| undefined;
	userSession: {
		id: number;
		userName: string;
		email: string;
		password: null;
		role: string;
		bio: string;
		active: boolean;
		canResetPassword: boolean;
	} | null;
	userId: string;
}

export default async function UserPageContentWrapper({
	searchParams,
	userSession,
	userId,
}: UserPageContentWrapperProps) {
	const mainTab = searchParams?.maintab || "bookmarks";
	const subTab = searchParams?.subtab || "movies";
	const page = searchParams?.page ? Number(searchParams.page) : 1;
	const search = searchParams?.search || "";

	let userInPage;
	let additionalData: any = { items: [], total: 0 };
	let userFollowers: any;
	let userFollowing: any;
	let userPendingFollowers: any;

	try {
		userInPage = await getUserById(Number(userId), userSession?.id);
		userFollowers = await getFollowers(Number(userId));
		userFollowing = await getFollowing(Number(userId));
		userPendingFollowers = await getPendingFollowRequests(Number(userId));

		if (!userInPage) {
			return notFound();
		}

		if (mainTab === "bookmarks") {
			additionalData = await getUserFavorites(
				Number(userId),
				subTab.toLowerCase() as
					| "movies"
					| "series"
					| "actors"
					| "crew"
					| "seasons"
					| "episodes",
				page,
				search,
			);
		} else if (mainTab === "reviews") {
			additionalData = await getUserReviews(
				Number(userId),
				subTab as
					| "movies"
					| "series"
					| "actors"
					| "crew"
					| "seasons"
					| "episodes",
				page,
				search,
			);
		} else if (mainTab === "upvotes" || mainTab === "downvotes") {
			additionalData = await getUserVotes(
				Number(userId),
				subTab as
					| "movies"
					| "series"
					| "actors"
					| "crew"
					| "seasons"
					| "episodes",
				mainTab,
				search,
				page,
			);
		} else if (mainTab === "forum") {
			if (subTab.toLowerCase() === "topics") {
				additionalData = await getUserForumTopics(
					Number(userId),
					page,
					search,
				);
			} else if (subTab.toLowerCase() === "replies") {
				additionalData = await getUserForumReplies(
					Number(userId),
					page,
					search,
				);
			}
		}
	} catch (error) {
		return notFound();
	}

	return (
		<UserPageContent
			userLoggedIn={userSession}
			// @ts-expect-error type user
			userInPage={userInPage}
			additionalData={additionalData}
			userFollowers={userFollowers}
			userFollowing={userFollowing}
			userPendingFollowers={userPendingFollowers}
		/>
	);
}
