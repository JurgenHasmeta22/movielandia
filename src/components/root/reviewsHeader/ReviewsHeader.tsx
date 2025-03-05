import { Box } from "@mui/material";
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
                justifyContent: "flex-end", 
                alignItems: "center",
                mb: 2
            }}>
                <SortSelect 
                    sortBy={sortBy} 
                    ascOrDesc={ascOrDesc} 
                    type="details" 
                    dataType={sortingDataType} 
                />
            </Box>
        </Box>
    );
};

export default ReviewsHeader;
