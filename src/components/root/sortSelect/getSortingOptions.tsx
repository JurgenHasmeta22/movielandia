interface SortOption {
    value: string;
    label: string;
}

export const getSortOptions = (type: string, dataType: string): SortOption[] => {
    if (dataType === "actors" || dataType === "crew") {
        return [
            { value: "fullname", label: "Full Name" },
            { value: "debut", label: "Debut" },
        ];
    }

    if (dataType === "users") {
        return [
            { value: "userName", label: "Username" },
            { value: "email", label: "Email" },
        ];
    }

    if (dataType === "seasons") {
        return [
            { value: "title", label: "Title" },
            { value: "ratingImdb", label: "Rating Imdb" },
        ];
    }

    if (dataType === "movies" || dataType === "series" || dataType === "episodes") {
        return [
            { value: "title", label: "Title" },
            { value: "ratingImdb", label: "Rating Imdb" },
            { value: "duration", label: "Duration" },
        ];
    }

    if (type === "list") {
        const listOptions: SortOption[] = [];
        return listOptions;
    } else {
        return [
            { value: "createdAt", label: "Created At" },
            { value: "rating", label: "Rating" },
        ];
    }
};
