import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCrewMemberById } from "@/actions/crew.actions";
import { Crew } from "@prisma/client";
import CrewPageContent from "./_components/CrewPageContent";

interface ICrewProps {
    params: Promise<{
        crewId: string;
    }>;
    searchParams?: Promise<{ reviewsAscOrDesc: string | undefined; reviewsPage: number; reviewsSortBy: string }>;
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
    const params = await props.params;
    const searchParams = await props.searchParams;
    const session = await getServerSession(authOptions);

    const { crewId } = params;

    const ascOrDesc = searchParams && searchParams.reviewsAscOrDesc;
    const page = searchParams && searchParams.reviewsPage ? Number(searchParams.reviewsPage) : 1;
    const sortBy = searchParams && searchParams.reviewsSortBy ? searchParams.reviewsSortBy : "";

    const searchParamsValues = {
        ascOrDesc,
        page,
        sortBy,
        userId: Number(session?.user?.id),
    };

    let crew;

    try {
        crew = await getCrewMemberById(Number(crewId), searchParamsValues);
    } catch (error) {
        return notFound();
    }

    const pageCountReviews = Math.ceil(crew.totalReviews / 5);

    return <CrewPageContent searchParamsValues={searchParamsValues} crew={crew} pageCount={pageCountReviews} />;
}
