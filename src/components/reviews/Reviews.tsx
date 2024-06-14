import { Box, Stack, Typography } from "@mui/material";
import SortSelect from "../sortSelect/SortSelect";

interface IReviews {
    data: {
        totalReviews: number;
    };
    sortBy: string;
    ascOrDesc: string;
}

const Reviews = ({ data, sortBy, ascOrDesc }: IReviews) => {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
                <Typography variant="h5" align="center">
                    Reviews ({data.totalReviews})
                </Typography>
            </Box>
            <Box>
                <SortSelect sortBy={sortBy} ascOrDesc={ascOrDesc} type="details" dataType="movie" />
            </Box>
        </Stack>
    );
};

export default Reviews;
