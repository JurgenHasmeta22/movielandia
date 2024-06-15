"use client";

import React from "react";
import { Stack, Pagination, Box } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";

interface IPaginationControl {
    pageCount: number;
    currentPage: number;
    dataType?: string;
}

const PaginationControl: React.FC<IPaginationControl> = ({ pageCount, currentPage, dataType }) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const onPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());

        if (dataType === "Movies") {
            newSearchParams.set("pageMovies", String(value));
        } else if (dataType === "Series") {
            newSearchParams.set("pageSeries", String(value));
        } else {
            newSearchParams.set("page", String(value));
        }

        router.push(`?${newSearchParams.toString()}`);
    };

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
