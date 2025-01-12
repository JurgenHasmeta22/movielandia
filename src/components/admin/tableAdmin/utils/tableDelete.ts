import { deleteActorById } from "@/actions/person.actions";
import { deleteCrewMemberById } from "@/actions/crew.actions";
import { deleteEpisodeById } from "@/actions/episode.actions";
import { deleteGenreById } from "@/actions/genre.actions";
import { deleteMovieById } from "@/actions/movie.actions";
import { deleteSeasonById } from "@/actions/season.actions";
import { deleteSerieById } from "@/actions/serie.actions";
import { deleteUserById } from "@/actions/user/user.actions";
import { toast } from "react-toastify";

interface IDeleteHandler {
    page: string;
    id: number;
}

interface IMassiveDeleteHandler {
    page: string;
    selectedIds: string[];
}

export const handleDeleteById = async ({ page, id }: IDeleteHandler) => {
    let response: any;

    try {
        switch (page) {
            case "series":
                response = await deleteSerieById(Number(id));
                break;
            case "movies":
                response = await deleteMovieById(Number(id));
                break;
            case "genres":
                response = await deleteGenreById(Number(id));
                break;
            case "users":
                response = await deleteUserById(Number(id));
                break;
            case "persons":
                response = await deleteActorById(Number(id));
                break;
            case "episodes":
                response = await deleteEpisodeById(Number(id));
                break;
            case "seasons":
                response = await deleteSeasonById(Number(id));
                break;
            case "crews":
                response = await deleteCrewMemberById(Number(id));
                break;
            default:
                console.error(`Unsupported page type: ${page}`);
                return null;
        }

        if (response) {
            toast.success(`Item with id ${id} deleted successfully`);
            return response;
        } else {
            toast.error(`Failed to delete item with id ${id}`);
            return null;
        }
    } catch (error) {
        console.error(`Error deleting item with id ${id}:`, error);
        toast.error(`Error deleting item with id ${id}`);
        return null;
    }
};

export const handleMassiveDelete = async ({ page, selectedIds }: IMassiveDeleteHandler) => {
    const results = [];

    for (const id of selectedIds) {
        const result = await handleDeleteById({ page, id: Number(id) });
        results.push(result);
    }

    return results;
};
