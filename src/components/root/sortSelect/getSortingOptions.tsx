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
            { value: "dateAired", label: "Date Aired" },
        ];
    }

    if (dataType === "movies" || dataType === "episodes") {
        return [
            { value: "title", label: "Title" },
            { value: "ratingImdb", label: "Rating Imdb" },
            { value: "duration", label: "Duration" },
            { value: "dateAired", label: "Date Aired" },
        ];
    }

    if (dataType === "series") {
        return [
            { value: "title", label: "Title" },
            { value: "ratingImdb", label: "Rating Imdb" },
            { value: "dateAired", label: "Date Aired" },
        ];
    }

    if (dataType === "topics") {
        return [
            { value: "lastPostAt", label: "Last Activity" },
            { value: "createdAt", label: "Creation Date" },
            { value: "title", label: "Title" },
            { value: "viewCount", label: "View Count" },
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
