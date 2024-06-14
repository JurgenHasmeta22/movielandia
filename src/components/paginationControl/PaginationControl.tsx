"use client";

import React from "react";
import { Stack, Pagination, Box } from "@mui/material";

interface IPaginationControl {
    pageCount: number;
    currentPage: number;
    onPageChange?: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const PaginationControl: React.FC<IPaginationControl> = ({ pageCount, currentPage, onPageChange }) => {
    return (
        <Box>
            <Stack spacing={2} sx={{ display: "flex", placeItems: "center", marginTop: 2, marginBottom: 4 }}>
                <Pagination
                    page={currentPage}
                    size="large"
                    count={pageCount}
                    showFirstButton
                    shape="rounded"
                    showLastButton
                    onChange={onPageChange}
                />
            </Stack>
        </Box>
    );
};

export default PaginationControl;
