"use client";

import { useSearchParams, useRouter } from "next/navigation";

type SortingOptions = {
    sortBy: string;
    ascOrDesc: string;
};

export function useSorting(type: string) {
    const searchParams = useSearchParams();
    const router = useRouter();

    function handleChangeSorting({ sortBy, ascOrDesc }: SortingOptions) {
        const newSearchParams = new URLSearchParams(searchParams.toString());

        if (sortBy === "none" || !sortBy) {
            if (type !== "details") {
                newSearchParams.delete(`${type}SortBy`);
                newSearchParams.delete(`${type}AscOrDesc`);
            } else {
                newSearchParams.delete("sortBy");
                newSearchParams.delete("ascOrDesc");
            }
        } else {
            if (type !== "details") {
                newSearchParams.set(`${type}SortBy`, sortBy);
                newSearchParams.set(`${type}AscOrDesc`, ascOrDesc);
            } else {
                newSearchParams.set("sortBy", sortBy);
                newSearchParams.set("ascOrDesc", ascOrDesc);
            }
        }

        router.push(`?${newSearchParams.toString()}`);
    }

    return handleChangeSorting;
}
