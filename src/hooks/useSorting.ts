"use client";

import { useQueryState } from "nuqs";

type SortingOptions = {
    sortBy: string;
    ascOrDesc: string;
};

export function useSorting(type: string) {
    const [typeSortBy, setTypeSortBy] = useQueryState(`${type}SortBy`, {
        defaultValue: "",
        parse: (value) => value || "",
        shallow: false,
    });

    const [sortByDefault, setSortByDefault] = useQueryState("sortBy", {
        defaultValue: "",
        parse: (value) => value || "",
        shallow: false,
    });

    const [typeAscOrDesc, setTypeAscOrDesc] = useQueryState(`${type}AscOrDesc`, {
        defaultValue: "",
        parse: (value) => value || "",
        shallow: false,
    });

    const [ascOrDescDefault, setAscOrDescDefault] = useQueryState("ascOrDesc", {
        defaultValue: "",
        parse: (value) => value || "",
        shallow: false,
    });

    function handleChangeSorting({ sortBy, ascOrDesc }: SortingOptions) {
        if (sortBy === "none" || !sortBy) {
            if (type !== "details") {
                setTypeSortBy(null);
                setTypeAscOrDesc(null);
            } else {
                setSortByDefault(null);
                setAscOrDescDefault(null);
            }
        } else {
            if (type !== "details") {
                setTypeSortBy(sortBy);
                setTypeAscOrDesc(ascOrDesc);
            } else {
                setSortByDefault(sortBy);
                setAscOrDescDefault(ascOrDesc);
            }
        }
    }

    return handleChangeSorting;
}
