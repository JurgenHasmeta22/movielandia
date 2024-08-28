import PaginationControl from "@/components/root/features/paginationControl/PaginationControl";
import SortSelect from "@/components/root/features/sortSelect/SortSelect";
import CardItem from "@/components/root/ui/cardItem/CardItem";
import { Typography } from "@mui/material";
import { Movie, Serie } from "@prisma/client";
import Box from "@mui/material-pigment-css/Box";
import Stack from "@mui/material-pigment-css/Stack";

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
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, count);

    return data.length !== 0 ? (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 4,
                    marginLeft: 3,
                    marginRight: 3,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        columnGap: 1,
                        alignItems: "center",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: [16, 17, 20, 22, 24],
                        }}
                        variant="h2"
                        textAlign={"center"}
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
                    paddingLeft: 5,
                    paddingRight: 3,
                }}
            >
                <Stack
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "start",
                        columnGap: 5,
                        rowGap: 5,
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
