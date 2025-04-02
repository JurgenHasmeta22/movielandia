import { describe, it, expect, vi, beforeEach } from "vitest";
import { onBookmarkMovie, onRemoveBookmarkMovie } from "@/utils/features/movieFeaturesUtils";
import { addFavoriteMovieToUser, removeFavoriteMovieToUser } from "@/actions/user/userBookmarks.actions";
import { showToast } from "@/utils/helpers/toast";
import { Movie } from "@prisma/client";
import { Session } from "next-auth";

// Mock dependencies
vi.mock("@/actions/user/userBookmarks.actions", () => ({
    addFavoriteMovieToUser: vi.fn(),
    removeFavoriteMovieToUser: vi.fn(),
}));

vi.mock("@/utils/helpers/toast", () => ({
    showToast: vi.fn(),
}));

// Mock console.error to avoid polluting test output
vi.spyOn(console, "error").mockImplementation(() => {});

describe("Movie Features Utils", () => {
    // Test data
    const mockSession: Session = {
        user: { id: "1", email: "test@example.com", userName: "TestUser", role: "User" },
        expires: "2023-01-01",
    };

    const mockMovie: Movie = {
        id: 1,
        title: "Test Movie",
        description: "A test movie",
        photoSrc: "poster.jpg",
        photoSrcProd: "poster-prod.jpg",
        trailerSrc: "trailer.mp4",
        duration: 120,
        dateAired: new Date(),
        ratingImdb: 8.5,
    } as Movie; // Type assertion to handle any missing properties

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("onBookmarkMovie", () => {
        it("should add movie to favorites and show success toast", async () => {
            await onBookmarkMovie(mockSession, mockMovie);

            expect(addFavoriteMovieToUser).toHaveBeenCalledWith(1, mockMovie.id);
            expect(showToast).toHaveBeenCalledWith("success", "Movie added to favorites!");
        });

        it("should handle errors and show error toast", async () => {
            const testError = new Error("Test error");
            vi.mocked(addFavoriteMovieToUser).mockRejectedValueOnce(testError);

            await onBookmarkMovie(mockSession, mockMovie);

            expect(addFavoriteMovieToUser).toHaveBeenCalledWith(1, mockMovie.id);
            expect(showToast).toHaveBeenCalledWith("error", "An error occurred: Test error");
            expect(console.error).toHaveBeenCalled();
        });

        it("should handle unknown errors", async () => {
            vi.mocked(addFavoriteMovieToUser).mockRejectedValueOnce("Unknown error");

            await onBookmarkMovie(mockSession, mockMovie);

            expect(addFavoriteMovieToUser).toHaveBeenCalledWith(1, mockMovie.id);
            expect(showToast).toHaveBeenCalledWith(
                "error",
                "An unexpected error occurred while adding the movie to favorites.",
            );
            expect(console.error).toHaveBeenCalled();
        });

        it("should do nothing if session or movie is missing", async () => {
            await onBookmarkMovie(null as unknown as Session, mockMovie);
            expect(addFavoriteMovieToUser).not.toHaveBeenCalled();

            await onBookmarkMovie(mockSession, null as unknown as Movie);
            expect(addFavoriteMovieToUser).not.toHaveBeenCalled();

            // Test with missing user
            const sessionWithoutUser = { ...mockSession };
            delete (sessionWithoutUser as any).user;
            await onBookmarkMovie(sessionWithoutUser, mockMovie);
            expect(addFavoriteMovieToUser).not.toHaveBeenCalled();
        });
    });

    describe("onRemoveBookmarkMovie", () => {
        it("should remove movie from favorites and show success toast", async () => {
            await onRemoveBookmarkMovie(mockSession, mockMovie);

            expect(removeFavoriteMovieToUser).toHaveBeenCalledWith(1, mockMovie.id, `/movies/${mockMovie.title}`);
            expect(showToast).toHaveBeenCalledWith("success", "Movie removed from favorites!");
        });

        it("should handle errors and show error toast", async () => {
            const testError = new Error("Test error");
            vi.mocked(removeFavoriteMovieToUser).mockRejectedValueOnce(testError);

            await onRemoveBookmarkMovie(mockSession, mockMovie);

            expect(removeFavoriteMovieToUser).toHaveBeenCalledWith(1, mockMovie.id, `/movies/${mockMovie.title}`);
            expect(showToast).toHaveBeenCalledWith("error", "An error occurred: Test error");
            expect(console.error).toHaveBeenCalled();
        });

        it("should do nothing if session or movie is missing", async () => {
            await onRemoveBookmarkMovie(null as unknown as Session, mockMovie);
            expect(removeFavoriteMovieToUser).not.toHaveBeenCalled();

            await onRemoveBookmarkMovie(mockSession, null as unknown as Movie);
            expect(removeFavoriteMovieToUser).not.toHaveBeenCalled();

            // Test with missing user
            const sessionWithoutUser = { ...mockSession };
            delete (sessionWithoutUser as any).user;
            await onRemoveBookmarkMovie(sessionWithoutUser, mockMovie);
            expect(removeFavoriteMovieToUser).not.toHaveBeenCalled();
        });
    });
});
