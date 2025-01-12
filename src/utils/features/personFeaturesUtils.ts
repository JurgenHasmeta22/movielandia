import { addFavoritePersonToUser, removeFavoritePersonToUser } from "@/actions/user/userBookmarks.actions";
import { showToast } from "@/utils/helpers/toast";
import { Person } from "@prisma/client";
import { Session } from "next-auth";

export async function onBookmarkPerson(session: Session, person: Person) {
    if (!session?.user || !person) return;

    try {
        await addFavoritePersonToUser(Number(session.user.id), person.id);
        showToast("success", "Person added to favorites!");
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error adding person to favorites: ${error.message}`);
            showToast("error", `An error occurred: ${error.message}`);
        } else {
            console.error("Unknown error adding person to favorites.");
            showToast("error", "An unexpected error occurred while adding the person to favorites.");
        }
    }
}

export async function onRemoveBookmarkPerson(session: Session, person: Person) {
    if (!session?.user || !person) return;

    try {
        await removeFavoritePersonToUser(Number(session.user.id), person.id);
        showToast("success", "Person removed from favorites!");
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error removing person from favorites: ${error.message}`);
            showToast("error", `An error occurred: ${error.message}`);
        } else {
            console.error("Unknown error removing person from favorites.");
            showToast("error", "An unexpected error occurred while removing the person from favorites.");
        }
    }
}
