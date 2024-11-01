import CardItem from "@/components/root/ui/cardItem/CardItem";
import Carousel from "@/components/root/ui/carousel/Carousel";
import PaginationControl from "@/components/root/features/paginationControl/PaginationControl";
import SortSelect from "@/components/root/features/sortSelect/SortSelect";
import { Box, Stack, Typography } from "@mui/material";
import { Crew } from "@prisma/client";
import type { Metadata } from "next";
import { getCrewMembersWithFilters } from "@/actions/crew.actions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface ICrewsProps {
    searchParams?: Promise<{ crewsAscOrDesc?: string; page?: string; crewsSortBy?: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_PROJECT_URL;

export const metadata: Metadata = {
    title: "Check Crews | High-Quality and Always Updated",
    description: "Discover the most amazing crews.",
    openGraph: {
        type: "video.other",
        url: `${baseUrl}/crews`,
        title: "Crews",
        description: "Discover the most amazing crews in high quality.",
        siteName: "MovieLandia24",
    },
    twitter: {
        card: "summary_large_image",
        site: "@movieLandia24",
        creator: "movieLandia24",
        title: "Crews",
        description: "Discover the most amazing crews in high quality.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default async function Crews(props: ICrewsProps) {
    const searchParams = await props.searchParams;
    const session = await getServerSession(authOptions);

    const ascOrDesc = searchParams?.crewsAscOrDesc || "";
    const page = searchParams?.page ? Number(searchParams.page) : 1;
    const sortBy = searchParams?.crewsSortBy || "";

    const queryParams = {
        ascOrDesc,
        page,
        sortBy,
    };

    const crewsData = await getCrewMembersWithFilters(queryParams, Number(session?.user?.id));
    const crews = crewsData.crewMemebrs;
    const crewsCarouselImages: Crew[] = crewsData.crewMemebrs.slice(0, 5);
    const crewsCount = crewsData.count;
    const pageCount = Math.ceil(crewsCount / 10);

    const itemsPerPage = 12;
    const startIndex = (page - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, crewsCount);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: 4,
            }}
            component={"section"}
        >
            <Box component={"section"}>
                <Carousel data={crewsCarouselImages} type="crews" />
            </Box>
            <Stack
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                component="section"
                sx={{
                    ml: 3,
                    mr: 3,
                    rowGap: { xs: 2, sm: 0 },
                    flexWrap: "wrap",
                }}
            >
                <Box
                    display={"flex"}
                    flexDirection={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    columnGap={1}
                    textAlign={{ xs: "left", sm: "center" }}
                >
                    <Typography fontSize={22} variant="h2">
                        Crews
                    </Typography>
                    <Typography variant="h5" sx={{ pt: 0.5 }}>
                        {startIndex} – {endIndex} of {crewsCount} crews
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: { xs: "flex-start", sm: "flex-end" },
                        alignItems: "center",
                        mt: { xs: 2, sm: 0 },
                    }}
                >
                    <SortSelect sortBy={sortBy} ascOrDesc={ascOrDesc} type="list" dataType="crews" />
                </Box>
            </Stack>
            <Box
                component={"section"}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 4,
                    pl: 5,
                    pr: 3,
                }}
            >
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    alignItems={"start"}
                    columnGap={5}
                    rowGap={5}
                    sx={{
                        justifyContent: {
                            xs: "center",
                            sm: "center",
                            md: "start",
                            lg: "start",
                        },
                    }}
                >
                    {crews.map((crew: Crew) => (
                        <Box key={crew.id}>
                            <CardItem data={crew} type="crew" path={"crews"} />
                        </Box>
                    ))}
                </Stack>
                <PaginationControl currentPage={Number(page)} pageCount={pageCount} />
            </Box>
        </Box>
    );
}
