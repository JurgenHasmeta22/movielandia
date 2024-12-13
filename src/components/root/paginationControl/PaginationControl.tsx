"use client";

import React, { useCallback } from "react";
import { Box, Pagination } from "@mui/material";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface PaginationControlProps {
    currentPage: number;
    pageCount: number;
    urlParamName?: string;
}

export default function PaginationControl({ currentPage, pageCount, urlParamName = "page" }: PaginationControlProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            return params.toString();
        },
        [searchParams],
    );

    const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        router.push(pathname + "?" + createQueryString(urlParamName, value.toString()), { scroll: false });
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Pagination
                page={currentPage}
                onChange={handleChange}
                count={pageCount}
                variant="outlined"
                shape="rounded"
                size="large"
            />
        </Box>
    );
}
