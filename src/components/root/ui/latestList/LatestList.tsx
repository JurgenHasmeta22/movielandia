import { Box, Stack, Typography } from "@mui/material";
import CardItem from "../cardItem/CardItem";
import { Movie, Serie } from "@prisma/client";

interface ILatestListProps {
    data: Array<Movie | Serie> | null;
    type: string;
}

export function LatestList({ data, type }: ILatestListProps) {
    return (
        <Box
            component={"section"}
            sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: 2,
                marginBottom: 4,
                pr: 3,
            }}
        >
            <Box
                sx={{
                    pl: 3,
                    display: "flex",
                    justifyContent: {
                        xs: "center",
                        sm: "center",
                        md: "start",
                        lg: "start",
                    },
                }}
            >
                <Typography fontSize={22} variant="h2">
                    Latest {type.toLowerCase()}
                </Typography>
            </Box>
            <Stack
                direction="row"
                flexWrap="wrap"
                alignItems={"start"}
                columnGap={5}
                rowGap={5}
                sx={{
                    mb: 4,
                    pl: 5,
                    mt: 3,
                    justifyContent: {
                        xs: "center",
                        sm: "center",
                        md: "start",
                        lg: "start",
                    },
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
