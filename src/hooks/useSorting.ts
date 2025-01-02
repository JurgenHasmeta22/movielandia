"use client";

import { useQueryState } from "nuqs";

type SortingOptions = {
    sortBy: string;
    ascOrDesc: string;
};

const getDefaultSortByField = (type: string): string => {
    switch (type) {
        case "movie":
        case "serie":
            return "title";
        case "actor":
        case "crew":
            return "fullName";
        case "user":
            return "userName";
        case "genre":
            return "name";
        case "details":
            return "createdAt";
        default:
            return "createdAt";
    }
};

export function useSorting(type: string) {
    const defaultSortBy = getDefaultSortByField(type);

    const [typeSortBy, setTypeSortBy] = useQueryState(`${type}SortBy`, {
        defaultValue: defaultSortBy,
        parse: (value) => value || defaultSortBy,
        shallow: false,
    });

    const [sortByDefault, setSortByDefault] = useQueryState("sortBy", {
        defaultValue: defaultSortBy,
        parse: (value) => value || defaultSortBy,
        shallow: false,
    });

    const [typeAscOrDesc, setTypeAscOrDesc] = useQueryState(`${type}AscOrDesc`, {
        defaultValue: "asc",
        parse: (value) => value || "asc",
        shallow: false,
    });

    const [ascOrDescDefault, setAscOrDescDefault] = useQueryState("ascOrDesc", {
        defaultValue: "asc",
        parse: (value) => value || "asc",
        shallow: false,
    });

    function handleChangeSorting({ sortBy, ascOrDesc }: SortingOptions) {
        if (!sortBy) {
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
