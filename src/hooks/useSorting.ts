"use client";

import { useQueryState } from "nuqs";

type SortingOptions = {
	sortBy: string;
	ascOrDesc: string;
};

const getDefaultSortByField = (type: string): string => {
	switch (type) {
		case "movie":
		case "episode":
		case "season":
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

	const [typeAscOrDesc, setTypeAscOrDesc] = useQueryState(
		`${type}AscOrDesc`,
		{
			defaultValue: "asc",
			parse: (value) => value || "asc",
			shallow: false,
		},
	);

	const [ascOrDescDefault, setAscOrDescDefault] = useQueryState("ascOrDesc", {
		defaultValue: "asc",
		parse: (value) => value || "asc",
		shallow: false,
	});

	function handleChangeSorting({ sortBy, ascOrDesc }: SortingOptions) {
		const actualSortBy = sortBy || defaultSortBy;

		if (type !== "details") {
			setTypeSortBy(actualSortBy);
			setTypeAscOrDesc(ascOrDesc);
		} else {
			setSortByDefault(actualSortBy);
			setAscOrDescDefault(ascOrDesc);
		}
	}

	return handleChangeSorting;
}
