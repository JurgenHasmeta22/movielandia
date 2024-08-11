import { Box, Stack, Typography } from "@mui/material";
import SortSelect from "../sortSelect/SortSelect";

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
        <Stack direction="row" justifyContent="space-between" alignItems="center" px={3}>
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
