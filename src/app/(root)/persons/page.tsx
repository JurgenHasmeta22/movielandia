import { Suspense } from "react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import PersonsPageContent from "./_components/PersonsPageContent";

interface IPersonsProps {
    searchParams?: Promise<{ personsAscOrDesc?: string; page?: string; personsSortBy?: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_PROJECT_URL;

export const metadata: Metadata = {
    title: "Check Persons | High-Quality and Always Updated",
    description: "Discover the most amazing persons.",
    openGraph: {
        type: "video.other",
        url: `${baseUrl}/persons`,
        title: "Persons",
        description: "Discover the most amazing persons in high quality.",
        siteName: "MovieLandia24",
    },
    twitter: {
        card: "summary_large_image",
        site: "@movieLandia24",
        creator: "movieLandia24",
        title: "Persons",
        description: "Discover the most amazing persons in high quality.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default async function Persons(props: IPersonsProps) {
    const session = await getServerSession(authOptions);

    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <PersonsPageContent searchParams={searchParams} session={session} />
        </Suspense>
    );
}
