import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getPersonById } from "@/actions/person.actions";
import { Person } from "@prisma/client";
import PersonPageContent from "./_components/PersonPageContent";
import { Suspense } from "react";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";

interface IPersonProps {
    params: {
        personId: string;
    };
    searchParams?: Promise<{
        reviewsAscOrDesc: string | undefined;
        reviewsPage: string;
        reviewsSortBy: string;
        starredMoviesPage?: string;
        starredSeriesPage?: string;
    }>;
}

export async function generateMetadata(props: IPersonProps): Promise<Metadata> {
    const params = await props.params;
    const { personId } = params;

    let person: Person;

    try {
        person = await getPersonById(Number(personId), {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrcProd } = person;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/persons/${person.fullname}`;

    return {
        title: `${person.fullname} | Person`,
        description: `${person.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${person.fullname} | Person`,
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
            title: `${person.fullname} | Person`,
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

export default async function PersonPage(props: IPersonProps) {
    const session = await getServerSession(authOptions);

    const params = await props.params;
    const { personId } = params;

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

    let person;

    try {
        person = await getPersonById(Number(personId), searchParamsValues);
    } catch (error) {
        return notFound();
    }

    const perPage = 6;
    const reviewsPageCount = Math.ceil(person.totalReviews / 5);
    const starredMoviesPageCount = Math.ceil(person.totalMovies / perPage);
    const starredSeriesPageCount = Math.ceil(person.totalSeries / perPage);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <PersonPageContent
                searchParamsValues={searchParamsValues}
                person={person}
                reviewsPageCount={reviewsPageCount}
                starredMoviesPageCount={starredMoviesPageCount}
                starredSeriesPageCount={starredSeriesPageCount}
            />
        </Suspense>
    );
}
