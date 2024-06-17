import { Box, Container, Stack } from "@mui/material";
import { DetailsPageCard } from "@/components/detailsPageCard/DetailsPageCard";
import PaginationControl from "@/components/paginationControl/PaginationControl";
import { ListDetail } from "@/components/listDetail/ListDetail";
import Review from "@/components/review/Review";
import Reviews from "@/components/reviews/Reviews";
import { getLatestSeries, getRelatedSeries, getSerieByTitle } from "@/lib/actions/serie.action";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Serie as ISerie } from "@prisma/client";

interface ISerieProps {
    params: {
        title: string;
    };
    searchParams?: { seriesAscOrDesc?: string; page?: string; seriesSortBy?: string };
}

export async function generateMetadata({ params }: ISerieProps): Promise<Metadata> {
    const { title } = params;
    const serie: ISerie = await getSerieByTitle(title, {});

    if (!serie) return notFound();

    const { description, photoSrc } = serie;
    const siteUrl = "https://movielandia24.com";
    const pageUrl = `${siteUrl}/series/${title}`;

    return {
        title: `${title} | Serie`,
        description: `${serie.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${title} | Serie`,
            description,
            images: photoSrc
                ? [
                      {
                          url: photoSrc,
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
            title: `${title} | Serie`,
            description,
            images: photoSrc
                ? [
                      {
                          url: photoSrc,
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

export default async function Serie({ searchParams, params }: ISerieProps) {
    const title = params?.title;
    const ascOrDesc = searchParams?.seriesAscOrDesc;
    const page = searchParams?.page ? Number(searchParams!.page!) : 1;
    const sortBy = searchParams?.seriesSortBy ? searchParams?.seriesSortBy : "";

    const serie = await getSerieByTitle(title, {});
    const latestSeries = await getLatestSeries();
    const relatedSeries = await getRelatedSeries(title);

    const pageCount = Math.ceil(serie?.totalReviews / 5);

    return (
        <Container>
            <Stack flexDirection={"column"} rowGap={4}>
                <DetailsPageCard data={serie} type="serie" />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 2,
                        mb: serie?.reviews!.length > 0 ? 4 : 0,
                    }}
                    component={"section"}
                >
                    {serie?.reviews!.length > 0 && <Reviews data={serie} sortBy={sortBy!} ascOrDesc={ascOrDesc!} />}
                    {serie?.reviews!.map((review: any, index: number) => (
                        <Review key={index} review={review} type="serie" data={serie} />
                    ))}
                    {serie?.totalReviews > 0 && <PaginationControl currentPage={Number(page)!} pageCount={pageCount} />}
                    {/* {user && (!serie.isReviewed) && <TextEditorForm review={review} rating={rating} />} */}
                </Box>
                <ListDetail data={latestSeries!} type="serie" roleData={"latest"} />
                <ListDetail data={relatedSeries!} type="serie" roleData="related" />
            </Stack>
        </Container>
    );
}
