import { Metadata } from "next";
import { getCrewMemberById } from "@/actions/crew.actions";
import { Crew } from "@prisma/client";
import { notFound } from "next/navigation";
import CrewPage from "./[crewFullname]/page";

export async function generateMetadata(props: { params: Promise<{ crewId: string }> }): Promise<Metadata> {
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

export default async function Page(props: { params: Promise<{ crewId: string }> }) {
    const params = await props.params;
    return <CrewPage params={params} />;
}
