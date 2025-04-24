import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	onBookmarkSerie,
	onRemoveBookmarkSerie,
} from "@/utils/features/serieFeaturesUtils";
import {
	addFavoriteSerieToUser,
	removeFavoriteSerieToUser,
} from "@/actions/user/userBookmarks.actions";
import { showToast } from "@/utils/helpers/toast";
import { Serie } from "@prisma/client";
import { Session } from "next-auth";

// Mock dependencies
vi.mock("@/actions/user/userBookmarks.actions", () => ({
	addFavoriteSerieToUser: vi.fn(),
	removeFavoriteSerieToUser: vi.fn(),
}));

vi.mock("@/utils/helpers/toast", () => ({
	showToast: vi.fn(),
}));

// Mock console.error to avoid polluting test output
vi.spyOn(console, "error").mockImplementation(() => {});

describe("Serie Features Utils", () => {
	// Test data
	const mockSession: Session = {
		user: {
			id: "1",
			email: "test@example.com",
			userName: "TestUser",
			role: "User",
		},
		expires: "2023-01-01",
	};

	const mockSerie: Serie = {
		id: 1,
		title: "Test Serie",
		description: "A test serie",
		photoSrc: "poster.jpg",
		photoSrcProd: "poster-prod.jpg",
		trailerSrc: "trailer.mp4",
		dateAired: new Date(),
		ratingImdb: 8.5,
	} as Serie; // Type assertion to handle any missing properties

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("onBookmarkSerie", () => {
		it("should add serie to favorites and show success toast", async () => {
			await onBookmarkSerie(mockSession, mockSerie);

			expect(addFavoriteSerieToUser).toHaveBeenCalledWith(
				1,
				mockSerie.id,
			);
			expect(showToast).toHaveBeenCalledWith(
				"success",
				"Serie added to favorites!",
			);
		});

		it("should handle errors and show error toast", async () => {
			const testError = new Error("Test error");
			vi.mocked(addFavoriteSerieToUser).mockRejectedValueOnce(testError);

			await onBookmarkSerie(mockSession, mockSerie);

			expect(addFavoriteSerieToUser).toHaveBeenCalledWith(
				1,
				mockSerie.id,
			);
			expect(showToast).toHaveBeenCalledWith(
				"error",
				"An error occurred: Test error",
			);
			expect(console.error).toHaveBeenCalled();
		});

		it("should handle unknown errors", async () => {
			vi.mocked(addFavoriteSerieToUser).mockRejectedValueOnce(
				"Unknown error",
			);

			await onBookmarkSerie(mockSession, mockSerie);

			expect(addFavoriteSerieToUser).toHaveBeenCalledWith(
				1,
				mockSerie.id,
			);
			expect(showToast).toHaveBeenCalledWith(
				"error",
				"An unexpected error occurred while adding the serie to favorites.",
			);
			expect(console.error).toHaveBeenCalled();
		});

		it("should do nothing if session or serie is missing", async () => {
			await onBookmarkSerie(null as unknown as Session, mockSerie);
			expect(addFavoriteSerieToUser).not.toHaveBeenCalled();

			await onBookmarkSerie(mockSession, null as unknown as Serie);
			expect(addFavoriteSerieToUser).not.toHaveBeenCalled();

			// Test with missing user
			const sessionWithoutUser = { ...mockSession };
			delete (sessionWithoutUser as any).user;
			await onBookmarkSerie(sessionWithoutUser, mockSerie);
			expect(addFavoriteSerieToUser).not.toHaveBeenCalled();
		});
	});

	describe("onRemoveBookmarkSerie", () => {
		it("should remove serie from favorites and show success toast", async () => {
			await onRemoveBookmarkSerie(mockSession, mockSerie);

			expect(removeFavoriteSerieToUser).toHaveBeenCalledWith(
				1,
				mockSerie.id,
				`/series/${mockSerie.title}`,
			);
			expect(showToast).toHaveBeenCalledWith(
				"success",
				"Serie removed from favorites!",
			);
		});

		it("should handle errors and show error toast", async () => {
			const testError = new Error("Test error");
			vi.mocked(removeFavoriteSerieToUser).mockRejectedValueOnce(
				testError,
			);

			await onRemoveBookmarkSerie(mockSession, mockSerie);

			expect(removeFavoriteSerieToUser).toHaveBeenCalledWith(
				1,
				mockSerie.id,
				`/series/${mockSerie.title}`,
			);
			expect(showToast).toHaveBeenCalledWith(
				"error",
				"An error occurred: Test error",
			);
			expect(console.error).toHaveBeenCalled();
		});

		it("should handle unknown errors", async () => {
			vi.mocked(removeFavoriteSerieToUser).mockRejectedValueOnce(
				"Unknown error",
			);

			await onRemoveBookmarkSerie(mockSession, mockSerie);

			expect(removeFavoriteSerieToUser).toHaveBeenCalledWith(
				1,
				mockSerie.id,
				`/series/${mockSerie.title}`,
			);
			expect(showToast).toHaveBeenCalledWith(
				"error",
				"An unexpected error occurred while removing the serie from favorites.",
			);
			expect(console.error).toHaveBeenCalled();
		});

		it("should do nothing if session or serie is missing", async () => {
			await onRemoveBookmarkSerie(null as unknown as Session, mockSerie);
			expect(removeFavoriteSerieToUser).not.toHaveBeenCalled();

			await onRemoveBookmarkSerie(mockSession, null as unknown as Serie);
			expect(removeFavoriteSerieToUser).not.toHaveBeenCalled();

			// Test with missing user
			const sessionWithoutUser = { ...mockSession };
			delete (sessionWithoutUser as any).user;
			await onRemoveBookmarkSerie(sessionWithoutUser, mockSerie);
			expect(removeFavoriteSerieToUser).not.toHaveBeenCalled();
		});
	});
});
