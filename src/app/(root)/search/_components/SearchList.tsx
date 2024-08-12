import PaginationControl from "@/components/root/features/paginationControl/PaginationControl";
import SortSelect from "@/components/root/features/sortSelect/SortSelect";
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
    return data.length !== 0 ? (
        <Box display={"flex"} flexDirection={"column"} rowGap={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} ml={3} mr={3}>
                <Box display={"flex"} flexDirection={"row"} columnGap={1} alignItems={"center"}>
                    <Typography fontSize={22} variant="h2">
                        {title}
                    </Typography>
                    <Typography variant="h5">
                        (showing {data.length} of {count})
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
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
                }}
                pl={3}
                pr={3}
            >
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    alignItems={"start"}
                    rowGap={4}
                    columnGap={3}
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
