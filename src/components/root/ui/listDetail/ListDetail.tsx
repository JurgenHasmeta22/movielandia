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
                            justifyContent: "center",
                            alignItems: "center",
                            rowGap: 2,
                            marginBottom: 2,
                            marginTop: 2,
                        }}
                        component={"section"}
                    >
                        <Box>
                            <Typography fontSize={28}>
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
                            {type === "actor" && roleData !== "cast" && (
                                <Typography fontSize={28}>Starred {roleData}</Typography>
                            )}
                            {type === "actor" && roleData === "cast" && <Typography fontSize={28}>Cast</Typography>}
                        </Box>
                        <Stack
                            direction="row"
                            flexWrap="wrap"
                            columnGap={3}
                            rowGap={3}
                            justifyContent="center"
                            alignContent="center"
                            mt={1}
                            mb={4}
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
                </>
            )}
        </>
    );
}

export default ListDetail;
