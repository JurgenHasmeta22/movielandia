import { Container } from "@mui/material";
// import { getLatestActors, getActorByTitle, getRelatedActors } from "@/lib/actions/actor.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ActorPage from "./_components/ActorPage";

interface IActorProps {
    params: {
        title: string;
    };
    searchParams?: { actorsAscOrDesc?: string; page?: string; actorsSortBy?: string };
}

// export async function generateMetadata({ params }: IActorProps): Promise<Metadata> {
//     const { title } = params;
//     let actor = null;

//     try {
//         actor = await getActorByTitle(title, {});
//     } catch (error) {
//         return notFound();
//     }

//     const { description, photoSrc } = actor;

//     const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/actors/${title}`;

//     return {
//         title: `${title} | Actor`,
//         description: `${actor.description}`,
//         openGraph: {
//             type: "video.other",
//             url: pageUrl,
//             title: `${title} | Actor`,
//             description,
//             images: photoSrc
//                 ? [
//                       {
//                           url: photoSrc,
//                           width: 200,
//                           height: 300,
//                           alt: description,
//                       },
//                   ]
//                 : [],
//             siteName: "MovieLandia24",
//         },
//         twitter: {
//             card: "summary_large_image",
//             site: "@actorLandia24",
//             creator: "actorLandia24",
//             title: `${title} | Actor`,
//             description,
//             images: photoSrc
//                 ? [
//                       {
//                           url: photoSrc,
//                           alt: description,
//                       },
//                   ]
//                 : [],
//         },
//         robots: {
//             index: true,
//             follow: true,
//         },
//     };
// }

export default async function Actor({ searchParams, params }: IActorProps) {
    // const session = await getServerSession(authOptions);

    // const title = params.title;
    // const ascOrDesc = searchParams?.actorsAscOrDesc;
    // const page = searchParams?.page ? Number(searchParams!.page!) : 1;
    // const sortBy = searchParams?.actorsSortBy ? searchParams?.actorsSortBy : "";
    // const searchParamsValues = {
    //     ascOrDesc,
    //     page,
    //     sortBy,
    // };

    // let actor = null;

    // try {
    //     actor = await getActorByTitle(title, { userId: Number(session?.user?.id) });
    // } catch (error) {
    //     return notFound();
    // }

    // const latestActors = await getLatestActors();
    // const relatedActors = await getRelatedActors(title);

    // const pageCount = Math.ceil(actor?.totalReviews / 5);

    return (
        <Container>
            <ActorPage
            // searchParamsValues={searchParamsValues}
            // actor={actor}
            // latestActors={latestActors}
            // relatedActors={relatedActors}
            // pageCount={pageCount}
            />
        </Container>
    );
}
