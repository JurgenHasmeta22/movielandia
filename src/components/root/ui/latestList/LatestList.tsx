import { Box, Stack, Typography } from "@mui/material";
import CardItem from "../cardItem/CardItem";
import DividerLine from "../dividerLine/DividerLine";

interface ILatestList {
    data: any;
    type: string;
}

export function LatestList({ data, type }: ILatestList) {
    return (
        <Box
            component={"section"}
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "start",
                rowGap: 2,
                marginBottom: 4,
            }}
        >
            <Box>
                <Typography fontSize={28} variant="h2">
                    Latest {type}
                </Typography>
                <DividerLine />
            </Box>
            <Stack
                direction="row"
                flexWrap="wrap"
                rowGap={8}
                columnGap={4}
                justifyContent={"start"}
                alignContent={"center"}
                marginTop={3}
                mb={4}
            >
                {data
                    ?.slice(0, 5)
                    .map((item: any) => (
                        <CardItem data={item} key={item.id} type={`${type === "Movies" ? "movie" : "serie"}`} />
                    ))}
            </Stack>
        </Box>
    );
}

export default LatestList;
