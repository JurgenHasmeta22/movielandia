import { addFavoriteMovieToUser, removeFavoriteMovieToUser } from "@/actions/user.actions";
import { showToast } from "@/utils/helpers/toast";
import { Movie } from "@prisma/client";
import { Session } from "next-auth";

export async function onBookmarkMovie(session: Session, movie: Movie) {
    if (!session?.user || !movie) return;

    try {
        await addFavoriteMovieToUser(Number(session.user.id), movie.id);
        showToast("success", "Movie added to favorites!");
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error adding movie to favorites: ${error.message}`);
            showToast("error", `An error occurred: ${error.message}`);
        } else {
            console.error("Unknown error adding movie to favorites.");
            showToast("error", "An unexpected error occurred while adding the movie to favorites.");
        }
    }
}

export async function onRemoveBookmarkMovie(session: Session, movie: Movie) {
    if (!session?.user || !movie) return;

    try {
        await removeFavoriteMovieToUser(Number(session.user.id), movie.id, `/movies/${movie.title}`);
        showToast("success", "Movie removed from favorites!");
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error removing movie from favorites: ${error.message}`);
            showToast("error", `An error occurred: ${error.message}`);
        } else {
            console.error("Unknown error removing movie from favorites.");
            showToast("error", "An unexpected error occurred while removing the movie from favorites.");
        }
    }
}
