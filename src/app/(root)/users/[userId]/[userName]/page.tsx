import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getUserById } from "@/actions/user/user.actions";
import UserPageContentWrapper from "./_components/UserPageContentWrapper";
import LoadingSkeletonUserProfile from "@/components/root/loadingSkeleton/LoadingSkeletonUserProfile";

interface IUserDetailsProps {
	params: {
		userId: string;
	};
	searchParams?: Promise<{
		maintab?: string;
		subtab?: string;
		page?: string;
		search?: string;
	}>;
}

export async function generateMetadata(
	props: IUserDetailsProps,
): Promise<Metadata> {
	const params = await props.params;
	const { userId } = params;
	let userInPage: any;

	try {
		userInPage = await getUserById(Number(userId));
	} catch (error) {
		return notFound();
	}

	const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/users/${userInPage.id}/${userInPage.userName}`;

	return {
		title: `${userInPage.userName} | User`,
		description: `${userInPage.bio}`,
		openGraph: {
			type: "video.tv_show",
			url: pageUrl,
			title: `${userInPage.userName} | User`,
			description: userInPage.bio,
			images: userInPage.avatar?.photoSrc
				? [
						{
							url: userInPage.avatar?.photoSrc,
							width: 160,
							height: 200,
							alt: userInPage.bio,
						},
					]
				: [],
			siteName: "MovieLandia24",
		},
		twitter: {
			card: "summary_large_image",
			site: "@movieLandia24",
			creator: "movieLandia24",
			title: `${userInPage.userName} | User`,
			description: userInPage.bio,
			images: userInPage.avatar?.photoSrc
				? [
						{
							url: userInPage.avatar?.photoSrc,
							alt: userInPage.bio,
						},
					]
				: [],
		},
		robots: {
			index: true,
			follow: true,
		},
	};
}

export default async function UserPage(props: IUserDetailsProps) {
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
	const userId = params.userId;

	const searchParams = await props.searchParams;
	// Create a unique key that includes all search parameters to force remounting
	const searchParamsKey = JSON.stringify(searchParams);

	return (
		<Suspense
			key={searchParamsKey}
			fallback={<LoadingSkeletonUserProfile />}
		>
			<UserPageContentWrapper
				searchParams={searchParams}
				userSession={userSession}
				userId={userId}
			/>
		</Suspense>
	);
}
