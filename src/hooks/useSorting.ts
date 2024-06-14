"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { SelectChangeEvent } from "@mui/material";

export function useSorting(type: string) {
    const searchParams = useSearchParams();
    const router = useRouter();

    function handleChangeSorting(event: SelectChangeEvent<string>) {
        const selectedValue = event.target.value;
        const newSearchParams = new URLSearchParams(searchParams.toString());

        if (selectedValue === "none") {
            if (type !== "details") {
                newSearchParams.delete(`${type}SortBy`);
                newSearchParams.delete(`${type}AscOrDesc`);
            } else {
                newSearchParams.delete("sortBy");
                newSearchParams.delete("ascOrDesc");
            }
        } else {
            const [, sortByValue, ascOrDesc] = selectedValue.match(/(\w+)(Asc|Desc)/) || [];

            if (type !== "details") {
                newSearchParams.set(`${type}SortBy`, sortByValue);
                newSearchParams.set(`${type}AscOrDesc`, ascOrDesc.toLowerCase());
            } else {
                newSearchParams.set("sortBy", sortByValue);
                newSearchParams.set("ascOrDesc", ascOrDesc.toLowerCase());
            }
        }

        router.push(`?${newSearchParams.toString()}`);
    }

    return handleChangeSorting;
}
