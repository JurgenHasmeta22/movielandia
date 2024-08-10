import { Metadata } from "next";
import { Season } from "@prisma/client";
import { notFound } from "next/navigation";
import { getSeasonById } from "@/actions/season.actions";
import SeasonDetails from "./[seasonTitle]/page";

export async function generateMetadata({
    params,
}: {
    params: { seasonId: string; serieId: string };
}): Promise<Metadata> {
    const { seasonId } = params;

    let season: Season | null = null;

    try {
        season = await getSeasonById(Number(seasonId), {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrcProd } = season!;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/seasons/${season?.title}`;

    return {
        title: `${season?.title} | Season`,
        description: `${season?.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${season?.title} | Season`,
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
            siteName: "SeasonLandia24",
        },
        twitter: {
            card: "summary_large_image",
            site: "@seasonLandia24",
            creator: "seasonLandia24",
            title: `${season?.title} | Season`,
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

export default function Page({ params }: { params: { seasonId: string; serieId: string } }) {
    return <SeasonDetails params={params} />;
}
