import { addFavoriteActorToUser, removeFavoriteActorToUser } from "@/actions/user.actions";
import { showToast } from "@/utils/helpers/toast";
import { Actor } from "@prisma/client";
import { Session } from "next-auth";

export async function onBookmarkActor(session: Session, actor: Actor) {
    if (!session?.user || !actor) return;

    try {
        await addFavoriteActorToUser(Number(session.user.id), actor.id);
        showToast("success", "Actor added to favorites!");
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error adding actor to favorites: ${error.message}`);
            showToast("error", `An error occurred: ${error.message}`);
        } else {
            console.error("Unknown error adding actor to favorites.");
            showToast("error", "An unexpected error occurred while adding the actor to favorites.");
        }
    }
}

export async function onRemoveBookmarkActor(session: Session, actor: Actor) {
    if (!session?.user || !actor) return;

    try {
        await removeFavoriteActorToUser(Number(session.user.id), actor.id);
        showToast("success", "Actor removed from favorites!");
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error removing actor from favorites: ${error.message}`);
            showToast("error", `An error occurred: ${error.message}`);
        } else {
            console.error("Unknown error removing actor from favorites.");
            showToast("error", "An unexpected error occurred while removing the actor from favorites.");
        }
    }
}
