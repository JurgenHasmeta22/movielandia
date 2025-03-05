import { Box, Typography, Divider } from "@mui/material";
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
        <Box sx={{ mb: 4 }}>
            <Box sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                mb: 2
            }}>
                <Typography 
                    variant="h4" 
                    sx={{
                        fontWeight: 700,
                        letterSpacing: 0.5
                    }}
                >
                    Reviews
                    <Typography 
                        component="span" 
                        variant="h5" 
                        sx={{ 
                            ml: 1,
                            color: 'text.secondary',
                            fontWeight: 400
                        }}
                    >
                        ({data.totalReviews})
                    </Typography>
                </Typography>
                <SortSelect 
                    sortBy={sortBy} 
                    ascOrDesc={ascOrDesc} 
                    type="details" 
                    dataType={sortingDataType} 
                />
            </Box>
            <Divider sx={{ mb: 3 }} />
        </Box>
    );
};

export default ReviewsHeader;
