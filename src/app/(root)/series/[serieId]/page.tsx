import { Metadata } from "next";
import { Serie } from "@prisma/client";
import { notFound } from "next/navigation";
import { getSerieById } from "@/actions/serie.actions";
import SeriePage from "./[serieTitle]/page";

export async function generateMetadata(props: { params: Promise<{ serieId: string }> }): Promise<Metadata> {
    const params = await props.params;
    const { serieId } = params;

    let serie: Serie;

    try {
        serie = await getSerieById(Number(serieId), {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrcProd } = serie;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/series/${serie.title}`;

    return {
        title: `${serie.title} | Serie`,
        description: `${serie.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${serie.title} | Serie`,
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
            siteName: "SerieLandia24",
        },
        twitter: {
            card: "summary_large_image",
            site: "@serieLandia24",
            creator: "serieLandia24",
            title: `${serie.title} | Serie`,
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

export default async function Page(props: { params: Promise<{ serieId: string }> }) {
    const params = await props.params;
    return <SeriePage params={params} />;
}
