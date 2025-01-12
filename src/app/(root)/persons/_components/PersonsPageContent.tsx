import { Box, Stack, Typography } from "@mui/material";
import { Person } from "@prisma/client";
import { getPersonsWithFilters } from "@/actions/person.actions";
import Carousel from "@/components/root/carousel/Carousel";
import CardItem from "@/components/root/cardItem/CardItem";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import SortSelect from "@/components/root/sortSelect/SortSelect";

interface PersonsPageContentProps {
    searchParams:
        | {
              personsAscOrDesc?: string;
              pagePersons?: string;
              personsSortBy?: string;
          }
        | undefined;
    session: any;
}

export default async function PersonsPageContent({ searchParams, session }: PersonsPageContentProps) {
    const ascOrDesc = searchParams?.personsAscOrDesc ?? "";
    const page = searchParams?.pagePersons ? Number(searchParams.pagePersons) : 1;
    const sortBy = searchParams?.personsSortBy ?? "";

    const queryParams = {
        ascOrDesc,
        page,
        sortBy,
    };

    const itemsPerPage = 12;
    const personsData = await getPersonsWithFilters(queryParams, Number(session?.user?.id));
    const persons = personsData.persons;
    const personsCarouselImages: Person[] = personsData.persons.slice(0, 5);
    const personsCount = personsData.count;
    const pageCount = Math.ceil(personsCount / itemsPerPage);

    const startIndex = (page - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, personsCount);

    return (
        <Box
            component="section"
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 3, sm: 4, md: 5 },
            }}
        >
            <Box component="section">
                <Carousel data={personsCarouselImages} type="persons" />
            </Box>
            <Box
                component="section"
                sx={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    width: "100%",
                    px: { xs: 2, sm: 3, md: 4 },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 2, sm: 3 },
                        mb: { xs: 3, md: 4 },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "baseline" },
                            gap: { xs: 1, sm: 2 },
                        }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: 24, sm: 28, md: 32 },
                                fontWeight: 800,
                                color: "text.primary",
                                position: "relative",
                                display: "inline-block",
                                "&::after": {
                                    content: '""',
                                    position: "absolute",
                                    bottom: -8,
                                    left: 0,
                                    width: "100%",
                                    height: 3,
                                    bgcolor: "primary.main",
                                    borderRadius: 1,
                                },
                            }}
                        >
                            Persons
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: { xs: 16, sm: 18 },
                                color: "text.secondary",
                                mt: { xs: 2, sm: 0 },
                                ml: { sm: 1 },
                                position: "relative",
                                top: { sm: 2 },
                            }}
                        >
                            {startIndex} – {endIndex} of {personsCount} persons
                        </Typography>
                    </Box>
                    <Box>
                        <SortSelect sortBy={sortBy} ascOrDesc={ascOrDesc} type="list" dataType="persons" />
                    </Box>
                </Box>
                <Box
                    sx={{
                        width: "100%",
                        overflow: "hidden",
                        mt: { xs: 4, md: 5 },
                    }}
                >
                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        sx={{
                            columnGap: { xs: 1, sm: 2, md: 3 },
                            rowGap: { xs: 3, sm: 4, md: 5 },
                            justifyContent: {
                                xs: "center",
                                md: "flex-start",
                            },
                            mx: { xs: 1, sm: 2 },
                            mb: { xs: 3, md: 4 },
                        }}
                    >
                        {persons.map((person: Person) => (
                            <CardItem key={person.id} data={person} type="person" path="persons" />
                        ))}
                    </Stack>
                    <PaginationControl currentPage={Number(page)} pageCount={pageCount} urlParamName="pagePersons" />
                </Box>
            </Box>
        </Box>
    );
}
