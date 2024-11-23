import { Box, Stack, Typography } from "@mui/material";
import { Actor } from "@prisma/client";
import { getActorsWithFilters } from "@/actions/actor.actions";
import Carousel from "@/components/root/carousel/Carousel";
import CardItem from "@/components/root/cardItem/CardItem";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import SortSelect from "@/components/root/sortSelect/SortSelect";

interface ActorsPageContentProps {
    searchParams:
        | {
              actorsAscOrDesc?: string;
              page?: string;
              actorsSortBy?: string;
          }
        | undefined;
    session: any;
}

export default async function ActorsPageContent({ searchParams, session }: ActorsPageContentProps) {
    const ascOrDesc = searchParams?.actorsAscOrDesc ?? "";
    const page = searchParams?.page ? Number(searchParams.page) : 1;
    const sortBy = searchParams?.actorsSortBy ?? "";

    const queryParams = {
        ascOrDesc,
        page,
        sortBy,
    };

    const itemsPerPage = 12;
    const actorsData = await getActorsWithFilters(queryParams, Number(session?.user?.id));
    const actors = actorsData.actors;
    const actorsCarouselImages: Actor[] = actorsData.actors.slice(0, 5);
    const actorsCount = actorsData.count;
    const pageCount = Math.ceil(actorsCount / itemsPerPage);

    const startIndex = (page - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, actorsCount);

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
                <Carousel data={actorsCarouselImages} type="actors" />
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
                        Actors
                    </Typography>
                    <Typography variant="h5" sx={{ pt: 0.5 }}>
                        {startIndex} – {endIndex} of {actorsCount} actors
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
                    <SortSelect sortBy={sortBy} ascOrDesc={ascOrDesc} type="list" dataType="actors" />
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
                    {actors.map((actor: Actor) => (
                        <Box key={actor.id}>
                            <CardItem data={actor} type="actor" path={"actors"} />
                        </Box>
                    ))}
                </Stack>
                <PaginationControl currentPage={Number(page)} pageCount={pageCount} />
            </Box>
        </Box>
    );
}
