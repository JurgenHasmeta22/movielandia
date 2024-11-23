import { Suspense } from "react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CrewPageContent from "./_components/CrewPageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";

interface ICrewProps {
    searchParams?: Promise<{ crewAscOrDesc?: string; page?: string; crewSortBy?: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_PROJECT_URL;

export const metadata: Metadata = {
    title: "Crew of movies and series",
    description: "Discover the most amazing crews.",
    openGraph: {
        type: "video.other",
        url: `${baseUrl}/crews`,
        title: "Crews",
        description: "Discover the most amazing crews in high quality.",
        siteName: "MovieLandia24",
    },
    twitter: {
        card: "summary_large_image",
        site: "@movieLandia24",
        creator: "movieLandia24",
        title: "Crews",
        description: "Discover the crew of movies and series.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default async function Crews(props: ICrewProps) {
    const session = await getServerSession(authOptions);

    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <CrewPageContent searchParams={searchParams} session={session} />
        </Suspense>
    );
}
