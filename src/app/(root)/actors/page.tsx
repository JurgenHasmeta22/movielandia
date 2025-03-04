import { Suspense } from "react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ActorsPageContent from "./_components/ActorsPageContent";
import LoadingSkeletonWithoutLatestWithoutCarousel from "@/components/root/loadingSkeleton/LoadingSkeletonWithoutLatestWithoutCarousel";

interface IActorsProps {
    searchParams?: Promise<{ actorsAscOrDesc?: string; page?: string; actorsSortBy?: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_PROJECT_URL;

export const metadata: Metadata = {
    title: "Check Actors | High-Quality and Always Updated",
    description: "Discover the most amazing actors.",
    openGraph: {
        type: "video.other",
        url: `${baseUrl}/actors`,
        title: "Actors",
        description: "Discover the most amazing actors in high quality.",
        siteName: "MovieLandia24",
    },
    twitter: {
        card: "summary_large_image",
        site: "@movieLandia24",
        creator: "movieLandia24",
        title: "Actors",
        description: "Discover the most amazing actors in high quality.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default async function Actors(props: IActorsProps) {
    const session = await getServerSession(authOptions);

    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSkeletonWithoutLatestWithoutCarousel />}>
            <ActorsPageContent searchParams={searchParams} session={session} />
        </Suspense>
    );
}
