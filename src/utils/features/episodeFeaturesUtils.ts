import {
	addFavoriteEpisodeToUser,
	removeFavoriteEpisodeToUser,
} from "@/actions/user/userBookmarks.actions";
import { showToast } from "@/utils/helpers/toast";
import { Session } from "next-auth";

export async function onBookmarkEpisode(session: Session, episode: any) {
	if (!session?.user || !episode) return;

	try {
		await addFavoriteEpisodeToUser(Number(session.user.id), episode.id);
		showToast("success", "Episode added to favorites!");
	} catch (error) {
		if (error instanceof Error) {
			console.error(
				`Error adding episode to favorites: ${error.message}`,
			);
			showToast("error", `An error occurred: ${error.message}`);
		} else {
			console.error("Unknown error adding episode to favorites.");
			showToast(
				"error",
				"An unexpected error occurred while adding the episode to favorites.",
			);
		}
	}
}

export async function onRemoveBookmarkEpisode(session: Session, episode: any) {
	if (!session?.user || !episode) return;

	try {
		await removeFavoriteEpisodeToUser(
			Number(session.user.id),
			episode.id,
			`/episodes/${episode.title}`,
		);
		showToast("success", "Episode removed from favorites!");
	} catch (error) {
		if (error instanceof Error) {
			console.error(
				`Error removing episode from favorites: ${error.message}`,
			);
			showToast("error", `An error occurred: ${error.message}`);
		} else {
			console.error("Unknown error removing episode from favorites.");
			showToast(
				"error",
				"An unexpected error occurred while removing the episode from favorites.",
			);
		}
	}
}
