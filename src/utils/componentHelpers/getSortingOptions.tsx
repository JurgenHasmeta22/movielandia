import { MenuItem } from "@mui/material";

export const getSortOptions = (type: string, dataType: string) => {
    if (dataType === "actors") {
        return [
            <MenuItem key="none" value="none">
                None
            </MenuItem>,
            <MenuItem key="fullnameAsc" value="fullnameAsc">
                Full Name (Asc)
            </MenuItem>,
            <MenuItem key="fullnameDesc" value="fullnameDesc">
                Full Name (Desc)
            </MenuItem>,
        ];
    }

    const commonOptions = [
        <MenuItem key="none" value="none">
            None
        </MenuItem>,
        <MenuItem key="ratingImdbAsc" value="ratingImdbAsc">
            Imdb rating (Asc)
        </MenuItem>,
        <MenuItem key="ratingImdbDesc" value="ratingImdbDesc">
            Imdb rating (Desc)
        </MenuItem>,
        <MenuItem key="titleAsc" value="titleAsc">
            Title (Asc)
        </MenuItem>,
        <MenuItem key="titleDesc" value="titleDesc">
            Title (Desc)
        </MenuItem>,
    ];

    const durationOptions = [
        <MenuItem key="durationAsc" value="durationAsc">
            Duration (Asc)
        </MenuItem>,
        <MenuItem key="durationDesc" value="durationDesc">
            Duration (Desc)
        </MenuItem>,
    ];

    if (type === "list") {
        return dataType === "seasons" ? commonOptions : [...commonOptions, ...durationOptions];
    } else {
        return [
            <MenuItem key="createdAtAsc" value="createdAtAsc">
                Created At (Asc)
            </MenuItem>,
            <MenuItem key="createdAtDesc" value="createdAtDesc">
                Created At (Desc)
            </MenuItem>,
            <MenuItem key="ratingAsc" value="ratingAsc">
                Rating (Asc)
            </MenuItem>,
            <MenuItem key="ratingDesc" value="ratingDesc">
                Rating (Desc)
            </MenuItem>,
        ];
    }
};
