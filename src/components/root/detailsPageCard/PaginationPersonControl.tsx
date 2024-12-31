"use client";

import { Box, Pagination, PaginationItem } from "@mui/material";
import { useQueryState } from "nuqs";

interface PaginationDetailsPersonControlProps {
    currentPage: number;
    pageCount: number;
    urlParamName: string;
}

const PaginationDetailsPersonControl = ({
    currentPage,
    pageCount,
    urlParamName,
}: PaginationDetailsPersonControlProps) => {
    const [page, setPage] = useQueryState(urlParamName, {
        defaultValue: "",
        parse: (value) => value || "",
        history: "push",
        shallow: false,
    });

    const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        if (value === currentPage) return;
        setPage(value.toString());
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
            <Pagination
                page={currentPage}
                onChange={handleChange}
                count={pageCount}
                variant="outlined"
                shape="rounded"
                showLastButton={true}
                showFirstButton={true}
                size="small"
                renderItem={(item) => (
                    <PaginationItem {...item} disabled={item.page === currentPage || item.disabled} />
                )}
            />
        </Box>
    );
};

export default PaginationDetailsPersonControl;
