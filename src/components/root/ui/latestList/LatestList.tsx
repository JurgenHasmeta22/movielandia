import { Box, Stack, Typography } from "@mui/material";
import CardItem from "../cardItem/CardItem";

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
                rowGap: 2,
                marginBottom: 4,
                pl: 3,
                pr: 3,
            }}
        >
            <Box>
                <Typography fontSize={22} variant="h2">
                    Latest {type.toLowerCase()}
                </Typography>
            </Box>
            <Stack
                direction="row"
                flexWrap="wrap"
                justifyContent={"flex-start"}
                alignItems={"start"}
                rowGap={4}
                columnGap={3}
                marginTop={3}
                mb={4}
            >
                {data?.map((item: any) => (
                    <CardItem data={item} key={item.id} type={`${type === "Movies" ? "movie" : "serie"}`} />
                ))}
            </Stack>
        </Box>
    );
}

export default LatestList;
