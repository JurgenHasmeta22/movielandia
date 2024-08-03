import { Box, Stack, Typography } from "@mui/material";
import CardItem from "../cardItem/CardItem";

interface IListDetail {
    data: any;
    type: string;
    roleData: string;
}

export function ListDetail({ data, type, roleData }: IListDetail) {
    return (
        <>
            {data && data.length > 0 && (
                <>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 2,
                            marginBottom: 2,
                            marginTop: 2,
                        }}
                        component={"section"}
                    >
                        <Box ml={3} mr={3}>
                            <Typography variant={"h2"} fontSize={28}>
                                {roleData === "latest" ? "Latest" : roleData === "related" ? "Related" : ""}
                                {type === "movie"
                                    ? " movies"
                                    : type === "serie"
                                      ? " series"
                                      : type === "season"
                                        ? " Seasons"
                                        : type === "episode"
                                          ? " episodes"
                                          : ""}
                            </Typography>
                            {type === "actor" && roleData !== "cast" && (
                                <Typography variant={"h2"} fontSize={28}>
                                    Starred {roleData}
                                </Typography>
                            )}
                            {type === "actor" && roleData === "cast" && (
                                <Typography variant={"h2"} fontSize={28}>
                                    Cast
                                </Typography>
                            )}
                        </Box>
                        <Box pl={3} pr={3}>
                            <Stack
                                direction="row"
                                flexWrap="wrap"
                                justifyContent={"flex-start"}
                                alignItems={"start"}
                                rowGap={4}
                                columnGap={3}
                            >
                                {data &&
                                    data.length > 0 &&
                                    !data.error &&
                                    data.map((item: any, index: number) => (
                                        <CardItem
                                            data={
                                                type === "actor" && roleData === "Movies"
                                                    ? item.movie
                                                    : type === "actor" && roleData === "Series"
                                                      ? item.serie
                                                      : type === "actor" && roleData === "cast"
                                                        ? item.actor
                                                        : item
                                            }
                                            key={index}
                                            type={type}
                                            path={
                                                type === "actor" && roleData !== "cast"
                                                    ? "movies"
                                                    : type === "actor" && roleData === "cast"
                                                      ? "actors"
                                                      : null
                                            }
                                        />
                                    ))}
                            </Stack>
                        </Box>
                    </Box>
                </>
            )}
        </>
    );
}

export default ListDetail;
