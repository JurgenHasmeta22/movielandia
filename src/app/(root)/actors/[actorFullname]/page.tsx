import { Container } from "@mui/material";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getActorByFullname } from "@/lib/actions/actor.actions";
import ActorPage from "./_components/ActorPage";

interface IActorProps {
    params: {
        actorFullname: string;
    };
    searchParams?: { actorsAscOrDesc?: string; page?: string; actorsSortBy?: string };
}

export async function generateMetadata({ params }: IActorProps): Promise<Metadata> {
    const { actorFullname } = params;

    let actor = null;

    try {
        actor = await getActorByFullname(actorFullname, {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrcProd } = actor;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/actors/${actorFullname}`;

    return {
        title: `${actorFullname} | Actor`,
        description: `${actor.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${actorFullname} | Actor`,
            description,
            images: photoSrcProd
                ? [
                      {
                          url: photoSrcProd,
                          width: 200,
                          height: 300,
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
            title: `${actorFullname} | Actor`,
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

export default async function Actor({ searchParams, params }: IActorProps) {
    const session = await getServerSession(authOptions);

    const { actorFullname } = params;
    const ascOrDesc = searchParams?.actorsAscOrDesc;
    const page = searchParams?.page ? Number(searchParams!.page!) : 1;
    const sortBy = searchParams?.actorsSortBy ? searchParams?.actorsSortBy : "";
    const searchParamsValues = {
        ascOrDesc,
        page,
        sortBy,
        userId: Number(session?.user?.id),
    };

    let actor = null;

    try {
        actor = await getActorByFullname(actorFullname, searchParamsValues);
    } catch (error) {
        return notFound();
    }

    const pageCountReviews = Math.ceil(actor?.totalReviews / 5);

    return (
        <Container>
            <ActorPage searchParamsValues={searchParamsValues} actor={actor} pageCount={pageCountReviews} />
        </Container>
    );
}
