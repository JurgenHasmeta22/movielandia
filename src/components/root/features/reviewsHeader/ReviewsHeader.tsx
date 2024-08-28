import { Typography } from "@mui/material";
import SortSelect from "../sortSelect/SortSelect";
import Box from "@mui/material-pigment-css/Box";
import Stack from "@mui/material-pigment-css/Stack";

interface IReviews {
    data: {
        totalReviews: number;
    };
    sortBy: string;
    ascOrDesc: string;
    sortingDataType: string;
}

const ReviewsHeader = ({ data, sortBy, ascOrDesc, sortingDataType }: IReviews) => {
    return (
        <Stack
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingRight: 1.5,
                paddingLeft: 1.5,
            }}
        >
            <Box>
                <Typography variant="h3" align="center">
                    Reviews ({data.totalReviews})
                </Typography>
            </Box>
            <Box>
                <SortSelect sortBy={sortBy} ascOrDesc={ascOrDesc} type="details" dataType={sortingDataType} />
            </Box>
        </Stack>
    );
};

export default ReviewsHeader;
