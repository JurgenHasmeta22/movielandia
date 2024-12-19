"use client";

import { Box, Pagination, PaginationItem, useTheme } from "@mui/material";
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
    const theme = useTheme();

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
        router.push(pathname + "?" + createQueryString(urlParamName, value.toString()));
    };

    if (pageCount <= 1) return null;

    return (
        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
            <Pagination
                page={currentPage}
                onChange={handleChange}
                count={pageCount}
                variant="outlined"
                shape="rounded"
                size="small"
                siblingCount={1}
                renderItem={(item) => (
                    <PaginationItem
                        {...item}
                        sx={{
                            color: theme.vars.palette.primary.main,
                            borderColor: theme.vars.palette.primary.main,
                            "&.Mui-selected": {
                                bgcolor: theme.vars.palette.primary.main,
                                color: theme.vars.palette.common.white,
                                "&:hover": {
                                    bgcolor: theme.vars.palette.primary.dark,
                                },
                            },
                        }}
                    />
                )}
            />
        </Box>
    );
};

export default PaginationDetailsPersonControl;
