import { Typography } from "@mui/material";
import CardItem from "../cardItem/CardItem";
import { Movie, Serie } from "@prisma/client";
import Box from "@mui/material-pigment-css/Box";
import Stack from "@mui/material-pigment-css/Stack";

interface ILatestList {
    data: Array<Movie | Serie> | null;
    type: string;
}

export function LatestList({ data, type }: ILatestList) {
    return (
        <Box
            component={"section"}
            sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: 2,
                marginBottom: 4,
                paddingRight: 3,
            }}
        >
            <Box
                sx={{
                    paddingLeft: 3,
                }}
            >
                <Typography fontSize={22} variant="h2">
                    Latest {type.toLowerCase()}
                </Typography>
            </Box>
            <Stack
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "start",
                    rowGap: 5,
                    columnGap: 5,
                    marginBottom: 4,
                    paddingLeft: 5,
                    marginTop: 3,
                    justifyContent: "start",
                    // justifyContent: {
                    //     xs: "center",
                    //     sm: "center",
                    //     md: "start",
                    //     lg: "start",
                    // },
                }}
            >
                {data?.map((item: Movie | Serie) => (
                    <CardItem data={item} key={item.id} type={`${type === "Movies" ? "movie" : "serie"}`} />
                ))}
            </Stack>
        </Box>
    );
}

export default LatestList;
