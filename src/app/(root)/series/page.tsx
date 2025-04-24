import { Suspense } from "react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SeriesPageContent from "./_components/SeriesPageContent";
import LoadingSkeletonWithLatest from "@/components/root/loadingSkeleton/LoadingSkeletonWithLatest";

interface ISeriesProps {
	searchParams?: Promise<{
		seriesAscOrDesc?: string;
		page?: string;
		seriesSortBy?: string;
	}>;
}

const baseUrl = process.env.NEXT_PUBLIC_PROJECT_URL;

export const metadata: Metadata = {
	title: "Watch the Latest Series | High-Quality and Always Updated",
	description:
		"Discover and watch the latest and most amazing series in high quality. Our collection is always updated with the newest episodes and releases.",
	openGraph: {
		type: "video.tv_show",
		url: `${baseUrl}/series`,
		title: "Watch the Latest Series | High-Quality and Always Updated",
		description:
			"Discover and watch the latest and most amazing series in high quality. Our collection is always updated with the newest episodes and releases.",
		siteName: "MovieLandia24",
	},
	twitter: {
		card: "summary_large_image",
		site: "@movieLandia24",
		creator: "movieLandia24",
		title: "Watch the Latest Series | High-Quality and Always Updated",
		description:
			"Discover and watch the latest and most amazing series in high quality. Our collection is always updated with the newest episodes and releases.",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default async function Series(props: ISeriesProps) {
	const session = await getServerSession(authOptions);

	const searchParams = await props.searchParams;
	const searchParamsKey = JSON.stringify(searchParams);

	return (
		<Suspense
			key={searchParamsKey}
			fallback={<LoadingSkeletonWithLatest />}
		>
			<SeriesPageContent searchParams={searchParams} session={session} />
		</Suspense>
	);
}
