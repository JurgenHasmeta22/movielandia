"use client";

import { Box, Pagination, PaginationItem } from "@mui/material";
import { useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

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
        if (value === currentPage) return;
        router.push(pathname + "?" + createQueryString(urlParamName, value.toString()), { scroll: false });
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
