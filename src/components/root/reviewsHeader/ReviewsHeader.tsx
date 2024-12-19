import { Box, Stack, Typography } from "@mui/material";
import SortSelect from "../sortSelect/SortSelect";

interface IReviewsProps {
    data: {
        totalReviews: number;
    };
    sortBy: string;
    ascOrDesc: string;
    sortingDataType: string;
}

const ReviewsHeader = ({ data, sortBy, ascOrDesc, sortingDataType }: IReviewsProps) => {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" px={3}>
            <Box>
                <Typography variant="h3" align="center">
                    {data.totalReviews} Reviews
                </Typography>
            </Box>
            <Box>
                <SortSelect sortBy={sortBy} ascOrDesc={ascOrDesc} type="details" dataType={sortingDataType} />
            </Box>
        </Stack>
    );
};

export default ReviewsHeader;
