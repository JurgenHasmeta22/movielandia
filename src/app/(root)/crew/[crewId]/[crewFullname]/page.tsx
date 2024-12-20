import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCrewMemberById } from "@/actions/crew.actions";
import { Crew } from "@prisma/client";
import CrewPageContent from "./_components/CrewPageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { Suspense } from "react";

interface ICrewProps {
    params: {
        crewId: string;
    };
    searchParams?: Promise<{
        reviewsAscOrDesc: string | undefined;
        reviewsPage: string;
        reviewsSortBy: string;
        producedMoviesPage: string;
        producedSeriesPage: string;
    }>;
}

export async function generateMetadata(props: ICrewProps): Promise<Metadata> {
    const params = await props.params;
    const { crewId } = params;

    let crew: Crew;

    try {
        crew = await getCrewMemberById(Number(crewId), {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrcProd } = crew;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/crew/${crew.fullname}`;

    return {
        title: `${crew.fullname} | Crew`,
        description: `${crew.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${crew.fullname} | Crew`,
            description,
            images: photoSrcProd
                ? [
                      {
                          url: photoSrcProd,
                          width: 160,
                          height: 200,
                          alt: description,
                      },
                  ]
                : [],
            siteName: "MovieLandia24",
        },
        twitter: {
            card: "summary_large_image",
            site: "@movieLandia24",
            creator: "movieLandia24",
            title: `${crew.fullname} | Crew`,
            description,
            images: photoSrcProd
                ? [
                      {
                          url: photoSrcProd,
                          alt: description,
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

export default async function CrewPage(props: ICrewProps) {
    const session = await getServerSession(authOptions);

    const params = await props.params;
    const { crewId } = params;

    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);

    const reviewsAscOrDesc = searchParams && searchParams.reviewsAscOrDesc;
    const reviewsPage = searchParams && searchParams.reviewsPage ? Number(searchParams.reviewsPage) : 1;
    const reviewsSortBy = searchParams && searchParams.reviewsSortBy ? searchParams.reviewsSortBy : "";

    const producedMoviesPage = searchParams?.producedMoviesPage ? Number(searchParams.producedMoviesPage) : 1;
    const producedSeriesPage = searchParams?.producedSeriesPage ? Number(searchParams.producedSeriesPage) : 1;

    const searchParamsValues = {
        reviewsAscOrDesc,
        reviewsPage,
        reviewsSortBy,
        producedMoviesPage,
        producedSeriesPage,
        userId: Number(session?.user?.id),
    };

    let crew;

    try {
        crew = await getCrewMemberById(Number(crewId), searchParamsValues);
    } catch (error) {
        return notFound();
    }

    const perPage = 6;
    const reviewsPageCount = Math.ceil(crew.totalReviews / 5);
    const producedMoviesPageCount = Math.ceil(crew.totalMovies / perPage);
    const producedSeriesPageCount = Math.ceil(crew.totalSeries / perPage);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <CrewPageContent
                searchParamsValues={searchParamsValues}
                crew={crew}
                reviewsPageCount={reviewsPageCount}
                producedMoviesPageCount={producedMoviesPageCount}
                producedSeriesPageCount={producedSeriesPageCount}
            />
        </Suspense>
    );
}
