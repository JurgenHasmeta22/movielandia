import { describe, it, expect, vi, beforeEach } from "vitest";
import { onBookmarkEpisode, onRemoveBookmarkEpisode } from "@/utils/features/episodeFeaturesUtils";
import { addFavoriteEpisodeToUser, removeFavoriteEpisodeToUser } from "@/actions/user/userBookmarks.actions";
import { showToast } from "@/utils/helpers/toast";
import { Episode } from "@prisma/client";
import { Session } from "next-auth";

// Mock dependencies
vi.mock("@/actions/user/userBookmarks.actions", () => ({
    addFavoriteEpisodeToUser: vi.fn(),
    removeFavoriteEpisodeToUser: vi.fn(),
}));

vi.mock("@/utils/helpers/toast", () => ({
    showToast: vi.fn(),
}));

// Mock console.error to avoid polluting test output
vi.spyOn(console, "error").mockImplementation(() => {});

describe("Episode Features Utils", () => {
    // Test data
    const mockSession: Session = {
        user: { id: "1", email: "test@example.com", userName: "TestUser", role: "User" },
        expires: "2023-01-01",
    };

    const mockEpisode: Episode = {
        id: 1,
        title: "Test Episode",
        description: "A test episode",
        photoSrc: "poster.jpg",
        photoSrcProd: "poster-prod.jpg",
        trailerSrc: "trailer.mp4",
        duration: 45,
        dateAired: new Date(),
        ratingImdb: 8.5,
        seasonId: 1,
    } as Episode; // Type assertion to handle any missing properties

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("onBookmarkEpisode", () => {
        it("should add episode to favorites and show success toast", async () => {
            await onBookmarkEpisode(mockSession, mockEpisode);

            expect(addFavoriteEpisodeToUser).toHaveBeenCalledWith(1, mockEpisode.id);
            expect(showToast).toHaveBeenCalledWith("success", "Episode added to favorites!");
        });

        it("should handle errors and show error toast", async () => {
            const testError = new Error("Test error");
            vi.mocked(addFavoriteEpisodeToUser).mockRejectedValueOnce(testError);

            await onBookmarkEpisode(mockSession, mockEpisode);

            expect(addFavoriteEpisodeToUser).toHaveBeenCalledWith(1, mockEpisode.id);
            expect(showToast).toHaveBeenCalledWith("error", "An error occurred: Test error");
            expect(console.error).toHaveBeenCalled();
        });

        it("should handle unknown errors", async () => {
            vi.mocked(addFavoriteEpisodeToUser).mockRejectedValueOnce("Unknown error");

            await onBookmarkEpisode(mockSession, mockEpisode);

            expect(addFavoriteEpisodeToUser).toHaveBeenCalledWith(1, mockEpisode.id);
            expect(showToast).toHaveBeenCalledWith(
                "error",
                "An unexpected error occurred while adding the episode to favorites.",
            );
            expect(console.error).toHaveBeenCalled();
        });

        it("should do nothing if session or episode is missing", async () => {
            await onBookmarkEpisode(null as unknown as Session, mockEpisode);
            expect(addFavoriteEpisodeToUser).not.toHaveBeenCalled();

            await onBookmarkEpisode(mockSession, null as unknown as Episode);
            expect(addFavoriteEpisodeToUser).not.toHaveBeenCalled();

            // Test with missing user
            const sessionWithoutUser = { ...mockSession };
            delete (sessionWithoutUser as any).user;
            await onBookmarkEpisode(sessionWithoutUser, mockEpisode);
            expect(addFavoriteEpisodeToUser).not.toHaveBeenCalled();
        });
    });

    describe("onRemoveBookmarkEpisode", () => {
        it("should remove episode from favorites and show success toast", async () => {
            await onRemoveBookmarkEpisode(mockSession, mockEpisode);

            expect(removeFavoriteEpisodeToUser).toHaveBeenCalledWith(
                1,
                mockEpisode.id,
                `/episodes/${mockEpisode.title}`,
            );
            expect(showToast).toHaveBeenCalledWith("success", "Episode removed from favorites!");
        });

        it("should handle errors and show error toast", async () => {
            const testError = new Error("Test error");
            vi.mocked(removeFavoriteEpisodeToUser).mockRejectedValueOnce(testError);

            await onRemoveBookmarkEpisode(mockSession, mockEpisode);

            expect(removeFavoriteEpisodeToUser).toHaveBeenCalledWith(
                1,
                mockEpisode.id,
                `/episodes/${mockEpisode.title}`,
            );
            expect(showToast).toHaveBeenCalledWith("error", "An error occurred: Test error");
            expect(console.error).toHaveBeenCalled();
        });

        it("should handle unknown errors", async () => {
            vi.mocked(removeFavoriteEpisodeToUser).mockRejectedValueOnce("Unknown error");

            await onRemoveBookmarkEpisode(mockSession, mockEpisode);

            expect(removeFavoriteEpisodeToUser).toHaveBeenCalledWith(
                1,
                mockEpisode.id,
                `/episodes/${mockEpisode.title}`,
            );
            expect(showToast).toHaveBeenCalledWith(
                "error",
                "An unexpected error occurred while removing the episode from favorites.",
            );
            expect(console.error).toHaveBeenCalled();
        });

        it("should do nothing if session or episode is missing", async () => {
            await onRemoveBookmarkEpisode(null as unknown as Session, mockEpisode);
            expect(removeFavoriteEpisodeToUser).not.toHaveBeenCalled();

            await onRemoveBookmarkEpisode(mockSession, null as unknown as Episode);
            expect(removeFavoriteEpisodeToUser).not.toHaveBeenCalled();

            // Test with missing user
            const sessionWithoutUser = { ...mockSession };
            delete (sessionWithoutUser as any).user;
            await onRemoveBookmarkEpisode(sessionWithoutUser, mockEpisode);
            expect(removeFavoriteEpisodeToUser).not.toHaveBeenCalled();
        });
    });
});
