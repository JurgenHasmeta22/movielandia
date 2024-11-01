import { addFavoriteCrewToUser, removeFavoriteCrewToUser } from "@/actions/user.actions";
import { showToast } from "@/utils/helpers/toast";
import { Crew } from "@prisma/client";
import { Session } from "next-auth";

export async function onBookmarkCrew(session: Session, crew: Crew) {
    if (!session?.user || !crew) return;

    try {
        await addFavoriteCrewToUser(Number(session.user.id), crew.id);
        showToast("success", "Crew added to favorites!");
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error adding crew to favorites: ${error.message}`);
            showToast("error", `An error occurred: ${error.message}`);
        } else {
            console.error("Unknown error adding crew to favorites.");
            showToast("error", "An unexpected error occurred while adding the crew to favorites.");
        }
    }
}

export async function onRemoveBookmarkCrew(session: Session, crew: Crew) {
    if (!session?.user || !crew) return;

    try {
        await removeFavoriteCrewToUser(Number(session.user.id), crew.id);
        showToast("success", "Crew removed from favorites!");
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error removing crew from favorites: ${error.message}`);
            showToast("error", `An error occurred: ${error.message}`);
        } else {
            console.error("Unknown error removing crew from favorites.");
            showToast("error", "An unexpected error occurred while removing the crew from favorites.");
        }
    }
}
