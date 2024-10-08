import { Box, Stack, Typography } from "@mui/material";
import CardItem from "../cardItem/CardItem";

interface IListDetailProps {
    data: any;
    type: string;
    roleData: string;
}

export function ListDetail({ data, type, roleData }: IListDetailProps) {
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
                        <Box
                            sx={{
                                ml: 3,
                                mr: 3,
                            }}
                        >
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
                        <Box sx={{ pl: 5, pr: 3 }}>
                            <Stack
                                direction="row"
                                flexWrap="wrap"
                                alignItems={"start"}
                                rowGap={5}
                                columnGap={5}
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
                                                type === "actor" && roleData === "Movies"
                                                    ? "movies"
                                                    : type === "actor" && roleData === "Series"
                                                      ? "series"
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
