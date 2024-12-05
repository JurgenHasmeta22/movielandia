import { MRT_ColumnDef } from "material-react-table";

export const getColumns = (page: string): MRT_ColumnDef<any>[] => {
    switch (page) {
        case "crews":
            return [
                {
                    accessorKey: "fullname",
                    header: "Full Name",
                },
                {
                    accessorKey: "photoSrc",
                    header: "Photo URL",
                },
                {
                    accessorKey: "role",
                    header: "Role",
                },
                {
                    accessorKey: "description",
                    header: "Description",
                },
                {
                    accessorKey: "debut",
                    header: "Debut",
                },
            ];
        case "actors":
            return [
                {
                    accessorKey: "fullname",
                    header: "Full Name",
                },
                {
                    accessorKey: "photoSrc",
                    header: "Photo URL",
                },
                {
                    accessorKey: "description",
                    header: "Description",
                },
                {
                    accessorKey: "debut",
                    header: "Debut",
                },
            ];
        case "seasons":
            return [
                {
                    accessorKey: "title",
                    header: "Title",
                },
                {
                    accessorKey: "photoSrc",
                    header: "Photo URL",
                },
                {
                    accessorKey: "trailerSrc",
                    header: "Trailer URL",
                },
                {
                    accessorKey: "description",
                    header: "Description",
                },
                {
                    accessorKey: "dateAired",
                    header: "Date Aired",
                },
                {
                    accessorKey: "ratingImdb",
                    header: "IMDB Rating",
                },
                {
                    accessorKey: "serieId",
                    header: "Serie ID",
                },
            ];
        case "episodes":
            return [
                {
                    accessorKey: "title",
                    header: "Title",
                },
                {
                    accessorKey: "photoSrc",
                    header: "Photo URL",
                },
                {
                    accessorKey: "trailerSrc",
                    header: "Trailer URL",
                },
                {
                    accessorKey: "description",
                    header: "Description",
                },
                {
                    accessorKey: "duration",
                    header: "Duration (minutes)",
                },
                {
                    accessorKey: "dateAired",
                    header: "Date Aired",
                },
                {
                    accessorKey: "ratingImdb",
                    header: "IMDB Rating",
                },
                {
                    accessorKey: "seasonId",
                    header: "Season ID",
                },
            ];
        case "series":
            return [
                {
                    accessorKey: "title",
                    header: "Title",
                },
                {
                    accessorKey: "photoSrc",
                    header: "Photo URL",
                },
                {
                    accessorKey: "trailerSrc",
                    header: "Trailer URL",
                },
                {
                    accessorKey: "description",
                    header: "Description",
                },
                {
                    accessorKey: "dateAired",
                    header: "Date Aired",
                },
                {
                    accessorKey: "ratingImdb",
                    header: "IMDB Rating",
                },
                {
                    accessorKey: "genreId",
                    header: "Genre ID",
                },
            ];
        case "movies":
            return [
                {
                    accessorKey: "title",
                    header: "Title",
                },
                {
                    accessorKey: "photoSrc",
                    header: "Photo URL",
                },
                {
                    accessorKey: "trailerSrc",
                    header: "Trailer URL",
                },
                {
                    accessorKey: "description",
                    header: "Description",
                },
                {
                    accessorKey: "dateAired",
                    header: "Date Aired",
                },
                {
                    accessorKey: "ratingImdb",
                    header: "IMDB Rating",
                },
                {
                    accessorKey: "genreId",
                    header: "Genre ID",
                },
            ];
        case "genres":
            return [
                {
                    accessorKey: "name",
                    header: "Name",
                },
                {
                    accessorKey: "description",
                    header: "Description",
                },
            ];
        case "users":
            return [
                {
                    accessorKey: "userName",
                    header: "User Name",
                },
                {
                    accessorKey: "email",
                    header: "Email",
                },
                {
                    accessorKey: "password",
                    header: "Password",
                },
            ];
        default:
            return [];
    }
};
