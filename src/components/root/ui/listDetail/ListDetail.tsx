import { Box, Stack, Typography } from "@mui/material";
import CardItem from "../cardItem/CardItem";
import DividerLine from "../dividerLine/DividerLine";

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
                    <DividerLine />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "start",
                            alignItems: "start",
                            rowGap: 2,
                            marginBottom: 2,
                            marginTop: 2,
                        }}
                        component={"section"}
                    >
                        <Box>
                            <Typography fontSize={28}>
                                {roleData === "latest" ? "Latest" : "Related"} {type === "movie" ? "Movies" : "Series"}
                            </Typography>
                            <DividerLine />
                        </Box>
                        <Stack
                            direction="row"
                            flexWrap="wrap"
                            columnGap={3}
                            rowGap={3}
                            justifyContent="flex-start"
                            alignContent="center"
                            mt={1}
                            mb={4}
                        >
                            {data &&
                                data.length > 0 &&
                                !data.error &&
                                data
                                    .slice(0, 5)
                                    .map((item: any, index: number) => (
                                        <CardItem data={item} key={index} type={type} />
                                    ))}
                        </Stack>
                    </Box>
                </>
            )}
        </>
    );
}

export default ListDetail;
