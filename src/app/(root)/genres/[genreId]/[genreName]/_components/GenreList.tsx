import PaginationControl from "@/components/root/features/paginationControl/PaginationControl";
import SortSelect from "@/components/root/features/sortSelect/SortSelect";
import CardItem from "@/components/root/ui/cardItem/CardItem";
import { Box, Typography, Stack } from "@mui/material";
import { Movie, Serie } from "@prisma/client";

interface GenreListProps {
    title: string;
    data: Array<Movie | Serie>;
    count: number;
    sortBy: string;
    ascOrDesc: string;
    page: number;
    pageCount: number;
    dataType: "Movies" | "Series";
    cardType: "movie" | "serie";
}

const GenreList: React.FC<GenreListProps> = ({
    title,
    data,
    count,
    sortBy,
    ascOrDesc,
    page,
    pageCount,
    dataType,
    cardType,
}) => {
    const itemsPerPage = 12;
    const startIndex = (page - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, count);

    return data.length !== 0 ? (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                sx={{
                    mt: 4,
                    ml: 3,
                    mr: 3,
                    flexDirection: { xs: "column", sm: "row" },
                    rowGap: { xs: 2, sm: 0 },
                }}
            >
                <Box
                    display={"flex"}
                    flexDirection={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    columnGap={1}
                    textAlign={{ xs: "left", sm: "center" }}
                >
                    <Typography
                        sx={{
                            fontSize: [16, 17, 20, 22, 24],
                        }}
                        variant="h2"
                    >
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
                    {data.map((item, index) => (
                        <CardItem data={item} key={index} type={cardType} />
                    ))}
                </Stack>
                <PaginationControl currentPage={Number(page)!} pageCount={pageCount} dataType={dataType} />
            </Box>
        </>
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
            <Typography component={"p"} fontSize={22} textAlign={"center"}>
                No search result, no {dataType.toLowerCase()} found with this genre.
            </Typography>
        </Box>
    );
};

export default GenreList;
