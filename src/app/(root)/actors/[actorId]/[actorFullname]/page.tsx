import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getActorById } from "@/actions/actor.actions";
import { Actor } from "@prisma/client";
import ActorPageContent from "./_components/ActorPageContent";
import { Suspense } from "react";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";

interface IActorProps {
    params: {
        actorId: string;
    };
    searchParams?: Promise<{
        reviewsAscOrDesc: string | undefined;
        reviewsPage: string;
        reviewsSortBy: string;
        starredMoviesPage?: string;
        starredSeriesPage?: string;
    }>;
}

export async function generateMetadata(props: IActorProps): Promise<Metadata> {
    const params = props.params;
    const { actorId } = params;

    let actor: Actor;

    try {
        actor = await getActorById(Number(actorId), {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrcProd } = actor;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/actors/${actor.fullname}`;

    return {
        title: `${actor.fullname} | Actor`,
        description: `${actor.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${actor.fullname} | Actor`,
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
            title: `${actor.fullname} | Actor`,
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

export default async function ActorPageByFullname(props: IActorProps) {
    const session = await getServerSession(authOptions);

    const params = props.params;
    const { actorId } = params;

    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);

    const reviewsAscOrDesc = searchParams && searchParams.reviewsAscOrDesc;
    const reviewsPage = searchParams && searchParams.reviewsPage ? Number(searchParams.reviewsPage) : 1;
    const reviewsSortBy = searchParams && searchParams.reviewsSortBy ? searchParams.reviewsSortBy : "";
    const starredMoviesPage = searchParams?.starredMoviesPage ? Number(searchParams.starredMoviesPage) : 1;
    const starredSeriesPage = searchParams?.starredSeriesPage ? Number(searchParams.starredSeriesPage) : 1;

    const searchParamsValues = {
        reviewsAscOrDesc,
        reviewsPage,
        reviewsSortBy,
        starredMoviesPage,
        starredSeriesPage,
        userId: Number(session?.user?.id),
    };

    let actor;

    try {
        actor = await getActorById(Number(actorId), searchParamsValues);
    } catch (error) {
        return notFound();
    }

    const perPage = 6;
    const reviewsPageCount = Math.ceil(actor.totalReviews / 5);
    const moviesPageCount = Math.ceil(actor.totalMovies / perPage);
    const seriesPageCount = Math.ceil(actor.totalSeries / perPage);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <ActorPageContent
                searchParamsValues={searchParamsValues}
                actor={actor}
                reviewsPageCount={reviewsPageCount}
                moviesPageCount={moviesPageCount}
                seriesPageCount={seriesPageCount}
            />
        </Suspense>
    );
}
