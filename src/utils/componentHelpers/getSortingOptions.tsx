interface SortOption {
    value: string;
    label: string;
}

export const getSortOptions = (type: string, dataType: string): SortOption[] => {
    const commonOptions: SortOption[] = [{ value: "none", label: "None" }];

    if (dataType === "actors") {
        return [...commonOptions, { value: "fullname", label: "Full Name" }];
    }

    if (dataType === "users") {
        return [...commonOptions, { value: "userName", label: "Username" }];
    }

    if (dataType === "seasons") {
        return [...commonOptions, { value: "title", label: "Title" }, { value: "ratingImdb", label: "Rating Imdb" }];
    }

    if (dataType === "movies" || dataType === "series" || dataType === "episodes") {
        return [
            ...commonOptions,
            { value: "title", label: "Title" },
            { value: "ratingImdb", label: "Rating Imdb" },
            { value: "duration", label: "Duration" },
        ];
    }

    if (type === "list") {
        const listOptions = [...commonOptions];

        return listOptions;
    } else {
        return [
            { value: "createdAt", label: "Created At" },
            { value: "rating", label: "Rating" },
        ];
    }
};
