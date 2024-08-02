import { Container } from "@mui/material";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getActorById } from "@/lib/actions/actor.actions";
import ActorPage from "./_components/ActorPage";
import { Actor } from "@prisma/client";

interface IActorProps {
    params: {
        actorId: string;
    };
    searchParams?: { actorsAscOrDesc?: string; page?: string; actorsSortBy?: string };
}

export async function generateMetadata({ params }: IActorProps): Promise<Metadata> {
    const { actorId } = params;

    let actor: Actor | null = null;

    try {
        actor = await getActorById(Number(actorId), {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrcProd } = actor!;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/actors/${actor?.fullname}`;

    return {
        title: `${actor?.fullname} | Actor`,
        description: `${actor?.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${actor?.fullname} | Actor`,
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
            title: `${actor?.fullname} | Actor`,
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

export default async function ActorDetails({ searchParams, params }: IActorProps) {
    const session = await getServerSession(authOptions);

    const { actorId } = params;
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
        actor = await getActorById(Number(actorId), searchParamsValues);
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
