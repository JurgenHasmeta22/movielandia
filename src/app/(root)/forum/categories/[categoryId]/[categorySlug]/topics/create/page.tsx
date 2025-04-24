import { Suspense } from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCategoryById } from "@/actions/forum/forumCategory.actions";
import { notFound, redirect } from "next/navigation";
import CreateTopicPageContent from "./_components/CreateTopicPageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";

interface ICreateTopicPageProps {
	params: {
		categoryId: string;
		categorySlug: string;
	};
}

export const metadata: Metadata = {
	title: "Create Topic | Forum | MovieLandia24",
	description: "Create a new topic in the MovieLandia24 community forum.",
	openGraph: {
		title: "Create Topic | Forum | MovieLandia24",
		description: "Create a new topic in the MovieLandia24 community forum.",
		url: "/forum/topics/create",
		siteName: "MovieLandia24",
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		site: "@movieLandia24",
		creator: "movieLandia24",
		title: "Create Topic | Forum | MovieLandia24",
		description: "Create a new topic in the MovieLandia24 community forum.",
	},
};

export default async function CreateTopicPage(props: ICreateTopicPageProps) {
	const session = await getServerSession(authOptions);
	const params = await props.params;

	if (!session?.user) {
		redirect("/auth/signin?callbackUrl=/forum");
	}

	const category = await getCategoryById(Number(params.categoryId));

	if (!category) {
		return notFound();
	}

	return (
		<Suspense fallback={<LoadingSpinner />}>
			<CreateTopicPageContent
				category={category}
				userId={Number(session.user.id)}
			/>
		</Suspense>
	);
}
