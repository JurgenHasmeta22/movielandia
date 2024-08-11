import { Metadata } from "next";
import { Serie } from "@prisma/client";
import { notFound } from "next/navigation";
import { getSerieById } from "@/actions/serie.actions";
import SeriePage from "./[serieTitle]/page";

export async function generateMetadata({ params }: { params: { serieId: string } }): Promise<Metadata> {
    const { serieId } = params;

    let serie: Serie | null = null;

    try {
        serie = await getSerieById(Number(serieId), {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrcProd } = serie!;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/series/${serie?.title}`;

    return {
        title: `${serie?.title} | Serie`,
        description: `${serie?.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${serie?.title} | Serie`,
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
            title: `${serie?.title} | Serie`,
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

export default function Page({ params }: { params: { serieId: string } }) {
    return <SeriePage params={params} />;
}
