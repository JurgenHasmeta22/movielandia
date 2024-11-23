import { Box, Stack, Typography } from "@mui/material";
import { Crew } from "@prisma/client";
import { getCrewMembersWithFilters } from "@/actions/crew.actions";
import Carousel from "@/components/root/carousel/Carousel";
import CardItem from "@/components/root/cardItem/CardItem";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import SortSelect from "@/components/root/sortSelect/SortSelect";

interface CrewPageContentProps {
    searchParams:
        | {
              crewAscOrDesc?: string;
              page?: string;
              crewSortBy?: string;
          }
        | undefined;
    session: any;
}

export default async function CrewPageContent({ searchParams, session }: CrewPageContentProps) {
    const ascOrDesc = searchParams?.crewAscOrDesc ?? "";
    const page = searchParams?.page ? Number(searchParams.page) : 1;
    const sortBy = searchParams?.crewSortBy ?? "";

    const queryParams = {
        ascOrDesc,
        page,
        sortBy,
    };

    const itemsPerPage = 12;
    const crewData = await getCrewMembersWithFilters(queryParams, Number(session?.user?.id));
    const crewMembers = crewData.crewMembers;
    const crewCarouselImages: Crew[] = crewMembers.slice(0, 5);

    const crewCount = crewData.count;
    const pageCount = Math.ceil(crewCount / itemsPerPage);

    const startIndex = (page - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, crewCount);

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
                <Carousel data={crewCarouselImages} type="crew" />
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
                        Crew
                    </Typography>
                    <Typography variant="h5" sx={{ pt: 0.5 }}>
                        {startIndex} – {endIndex} of {crewCount} crews
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
                    <SortSelect sortBy={sortBy} ascOrDesc={ascOrDesc} type="list" dataType="crew" />
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
                    {crewMembers.map((crewMember: Crew) => (
                        <Box key={crewMember.id}>
                            <CardItem data={crewMember} type="crew" path={"crew"} />
                        </Box>
                    ))}
                </Stack>
                <PaginationControl currentPage={Number(page)} pageCount={pageCount} />
            </Box>
        </Box>
    );
}
