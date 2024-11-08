import { addFavoriteSerieToUser, removeFavoriteSerieToUser } from "@/actions/user.actions";
import { showToast } from "@/utils/helpers/toast";
import { Serie } from "@prisma/client";
import { Session } from "next-auth";

export async function onBookmarkSerie(session: Session, serie: Serie) {
    if (!session?.user || !serie) return;

    try {
        await addFavoriteSerieToUser(Number(session.user.id), serie.id);
        showToast("success", "Serie added to favorites!");
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error adding serie to favorites: ${error.message}`);
            showToast("error", `An error occurred: ${error.message}`);
        } else {
            console.error("Unknown error adding serie to favorites.");
            showToast("error", "An unexpected error occurred while adding the serie to favorites.");
        }
    }
}

export async function onRemoveBookmarkSerie(session: Session, serie: Serie) {
    if (!session?.user || !serie) return;

    try {
        await removeFavoriteSerieToUser(Number(session.user.id), serie.id, `/series/${serie.title}`);
        showToast("success", "Serie removed from favorites!");
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error removing serie from favorites: ${error.message}`);
            showToast("error", `An error occurred: ${error.message}`);
        } else {
            console.error("Unknown error removing serie from favorites.");
            showToast("error", "An unexpected error occurred while removing the serie from favorites.");
        }
    }
}
