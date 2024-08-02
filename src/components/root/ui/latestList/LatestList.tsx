"use client";

import { Box, Stack, Typography } from "@mui/material";
import CardItem from "../cardItem/CardItem";
import DividerLine from "../dividerLine/DividerLine";
import { useStore } from "@/store/store";

interface ILatestList {
    data: any;
    type: string;
}

export function LatestList({ data, type }: ILatestList) {
    const { mobileOpen } = useStore();

    return (
        <Box
            component={"section"}
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                rowGap: 2,
                marginBottom: 4,
            }}
        >
            <Box>
                <Typography fontSize={28} variant="h2">
                    Latest {type}
                </Typography>
            </Box>
            <Stack
                direction="row"
                flexWrap="wrap"
                rowGap={8}
                columnGap={4}
                // justifyContent={`${mobileOpen ? "center" : "start"}`}
                justifyContent="center"
                alignContent={"center"}
                marginTop={3}
                mb={4}
            >
                {data
                    ?.slice(0, 6)
                    .map((item: any) => (
                        <CardItem data={item} key={item.id} type={`${type === "Movies" ? "movie" : "serie"}`} />
                    ))}
            </Stack>
        </Box>
    );
}

export default LatestList;
