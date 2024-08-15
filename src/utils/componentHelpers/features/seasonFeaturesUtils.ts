import { addFavoriteSeasonToUser, removeFavoriteSeasonToUser } from "@/actions/user.actions";
import { Season } from "@prisma/client";
import { Session } from "next-auth";
import { showToast } from "../../helpers/toast";

export async function onBookmarkSeason(session: Session, season: Season) {
    if (!session?.user || !season) return;

    try {
        await addFavoriteSeasonToUser(Number(session.user.id), season.id);
        showToast("success", "Season added to favorites!");
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error adding season to favorites: ${error.message}`);
            showToast("error", `An error occurred: ${error.message}`);
        } else {
            console.error("Unknown error adding season to favorites.");
            showToast("error", "An unexpected error occurred while adding the season to favorites.");
        }
    }
}

export async function onRemoveBookmarkSeason(session: Session, season: Season) {
    if (!session?.user || !season) return;

    try {
        await removeFavoriteSeasonToUser(Number(session.user.id), season.id, `/seasons/${season.title}`);
        showToast("success", "Season removed from favorites!");
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error removing season from favorites: ${error.message}`);
            showToast("error", `An error occurred: ${error.message}`);
        } else {
            console.error("Unknown error removing season from favorites.");
            showToast("error", "An unexpected error occurred while removing the season from favorites.");
        }
    }
}
