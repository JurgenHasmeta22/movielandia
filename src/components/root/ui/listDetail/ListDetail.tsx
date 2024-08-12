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
                            {type !== "actor" && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: {
                                            xs: "center",
                                            sm: "center",
                                            md: "start",
                                            lg: "start",
                                        },
                                    }}
                                >
                                    <Typography
                                        variant={"h2"}
                                        fontSize={28}
                                        sx={{
                                            display: "flex",
                                            justifySelf: {
                                                xs: "center",
                                                sm: "center",
                                                md: "start",
                                                lg: "start",
                                            },
                                        }}
                                    >
                                        {roleData === "latest" ? "Latest" : roleData === "related" ? "Related" : ""}
                                        {type === "movie"
                                            ? " Movies"
                                            : type === "serie"
                                              ? " Series"
                                              : type === "season"
                                                ? " Seasons"
                                                : type === "episode"
                                                  ? " Episodes"
                                                  : ""}
                                    </Typography>
                                </Box>
                            )}
                            {type === "actor" && roleData !== "cast" && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: {
                                            xs: "center",
                                            sm: "center",
                                            md: "start",
                                            lg: "start",
                                        },
                                    }}
                                >
                                    <Typography variant={"h2"} fontSize={28}>
                                        Starred {roleData}
                                    </Typography>
                                </Box>
                            )}
                            {type === "actor" && roleData === "cast" && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: {
                                            xs: "center",
                                            sm: "center",
                                            md: "start",
                                            lg: "start",
                                        },
                                    }}
                                >
                                    <Typography variant={"h2"} fontSize={28}>
                                        Cast
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                        <Box pl={3} pr={3}>
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
                                {data &&
                                    data.length > 0 &&
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
