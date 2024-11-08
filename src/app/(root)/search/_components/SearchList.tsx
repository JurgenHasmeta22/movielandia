import PaginationControl from "@/components/root/ui/paginationControl/PaginationControl";
import SortSelect from "@/components/root/ui/sortSelect/SortSelect";
import CardItem from "@/components/root/ui/cardItem/CardItem";
import { Box, Typography, Stack } from "@mui/material";
import { Actor, Episode, Movie, Season, Serie, User } from "@prisma/client";

interface MediaListProps {
    title: string;
    data: Array<Movie | Serie | Actor | Season | Episode | User>;
    count: number;
    sortBy: string;
    ascOrDesc: string;
    page: number;
    pageCount: number;
    dataType: "Movies" | "Series" | "Actors" | "Seasons" | "Episodes" | "Users";
    cardType: "movie" | "serie" | "actor" | "season" | "episode" | "user";
    path?: string;
}

const SearchList: React.FC<MediaListProps> = ({
    title,
    data,
    count,
    sortBy,
    ascOrDesc,
    page,
    pageCount,
    dataType,
    cardType,
    path = "",
}) => {
    const itemsPerPage = 12;
    const startIndex = (page - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, count);

    return data.length !== 0 ? (
        <Box display={"flex"} flexDirection={"column"} rowGap={3}>
            <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                sx={{
                    mt: 4,
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
                        {title}
                    </Typography>
                    <Typography variant="h5">
                        {startIndex} – {endIndex} of {count} {dataType.toLowerCase()}
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
                    <SortSelect sortBy={sortBy!} ascOrDesc={ascOrDesc!} type="list" dataType={dataType.toLowerCase()} />
                </Box>
            </Box>
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
                    {data.map((item) => (
                        <CardItem data={item} type={cardType} key={item.id} path={path} />
                    ))}
                </Stack>
                <PaginationControl currentPage={Number(page)!} pageCount={pageCount} dataType={dataType} />
            </Box>
        </Box>
    ) : (
        <Box
            sx={{
                height: "50vh",
                display: "flex",
                placeItems: "center",
                placeContent: "center",
            }}
            component={"section"}
        >
            <Typography component={"h1"} fontSize={24} textAlign={"center"}>
                No search result, no {dataType.toLowerCase()} found with that criteria.
            </Typography>
        </Box>
    );
};

export default SearchList;
