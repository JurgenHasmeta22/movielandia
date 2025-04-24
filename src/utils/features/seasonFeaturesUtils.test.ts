import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	onBookmarkSeason,
	onRemoveBookmarkSeason,
} from "@/utils/features/seasonFeaturesUtils";
import {
	addFavoriteSeasonToUser,
	removeFavoriteSeasonToUser,
} from "@/actions/user/userBookmarks.actions";
import { showToast } from "@/utils/helpers/toast";
import { Season } from "@prisma/client";
import { Session } from "next-auth";

// Mock dependencies
vi.mock("@/actions/user/userBookmarks.actions", () => ({
	addFavoriteSeasonToUser: vi.fn(),
	removeFavoriteSeasonToUser: vi.fn(),
}));

vi.mock("@/utils/helpers/toast", () => ({
	showToast: vi.fn(),
}));

// Mock console.error to avoid polluting test output
vi.spyOn(console, "error").mockImplementation(() => {});

describe("Season Features Utils", () => {
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

	const mockSeason: Season = {
		id: 1,
		title: "Test Season",
		description: "A test season",
		photoSrc: "poster.jpg",
		photoSrcProd: "poster-prod.jpg",
		trailerSrc: "trailer.mp4",
		dateAired: new Date(),
		ratingImdb: 8.5,
		serieId: 1,
	} as Season; // Type assertion to handle any missing properties

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("onBookmarkSeason", () => {
		it("should add season to favorites and show success toast", async () => {
			await onBookmarkSeason(mockSession, mockSeason);

			expect(addFavoriteSeasonToUser).toHaveBeenCalledWith(
				1,
				mockSeason.id,
			);
			expect(showToast).toHaveBeenCalledWith(
				"success",
				"Season added to favorites!",
			);
		});

		it("should handle errors and show error toast", async () => {
			const testError = new Error("Test error");
			vi.mocked(addFavoriteSeasonToUser).mockRejectedValueOnce(testError);

			await onBookmarkSeason(mockSession, mockSeason);

			expect(addFavoriteSeasonToUser).toHaveBeenCalledWith(
				1,
				mockSeason.id,
			);
			expect(showToast).toHaveBeenCalledWith(
				"error",
				"An error occurred: Test error",
			);
			expect(console.error).toHaveBeenCalled();
		});

		it("should handle unknown errors", async () => {
			vi.mocked(addFavoriteSeasonToUser).mockRejectedValueOnce(
				"Unknown error",
			);

			await onBookmarkSeason(mockSession, mockSeason);

			expect(addFavoriteSeasonToUser).toHaveBeenCalledWith(
				1,
				mockSeason.id,
			);
			expect(showToast).toHaveBeenCalledWith(
				"error",
				"An unexpected error occurred while adding the season to favorites.",
			);
			expect(console.error).toHaveBeenCalled();
		});

		it("should do nothing if session or season is missing", async () => {
			await onBookmarkSeason(null as unknown as Session, mockSeason);
			expect(addFavoriteSeasonToUser).not.toHaveBeenCalled();

			await onBookmarkSeason(mockSession, null as unknown as Season);
			expect(addFavoriteSeasonToUser).not.toHaveBeenCalled();

			// Test with missing user
			const sessionWithoutUser = { ...mockSession };
			delete (sessionWithoutUser as any).user;
			await onBookmarkSeason(sessionWithoutUser, mockSeason);
			expect(addFavoriteSeasonToUser).not.toHaveBeenCalled();
		});
	});

	describe("onRemoveBookmarkSeason", () => {
		it("should remove season from favorites and show success toast", async () => {
			await onRemoveBookmarkSeason(mockSession, mockSeason);

			expect(removeFavoriteSeasonToUser).toHaveBeenCalledWith(
				1,
				mockSeason.id,
				`/seasons/${mockSeason.title}`,
			);
			expect(showToast).toHaveBeenCalledWith(
				"success",
				"Season removed from favorites!",
			);
		});

		it("should handle errors and show error toast", async () => {
			const testError = new Error("Test error");
			vi.mocked(removeFavoriteSeasonToUser).mockRejectedValueOnce(
				testError,
			);

			await onRemoveBookmarkSeason(mockSession, mockSeason);

			expect(removeFavoriteSeasonToUser).toHaveBeenCalledWith(
				1,
				mockSeason.id,
				`/seasons/${mockSeason.title}`,
			);
			expect(showToast).toHaveBeenCalledWith(
				"error",
				"An error occurred: Test error",
			);
			expect(console.error).toHaveBeenCalled();
		});

		it("should handle unknown errors", async () => {
			vi.mocked(removeFavoriteSeasonToUser).mockRejectedValueOnce(
				"Unknown error",
			);

			await onRemoveBookmarkSeason(mockSession, mockSeason);

			expect(removeFavoriteSeasonToUser).toHaveBeenCalledWith(
				1,
				mockSeason.id,
				`/seasons/${mockSeason.title}`,
			);
			expect(showToast).toHaveBeenCalledWith(
				"error",
				"An unexpected error occurred while removing the season from favorites.",
			);
			expect(console.error).toHaveBeenCalled();
		});

		it("should do nothing if session or season is missing", async () => {
			await onRemoveBookmarkSeason(
				null as unknown as Session,
				mockSeason,
			);
			expect(removeFavoriteSeasonToUser).not.toHaveBeenCalled();

			await onRemoveBookmarkSeason(
				mockSession,
				null as unknown as Season,
			);
			expect(removeFavoriteSeasonToUser).not.toHaveBeenCalled();

			// Test with missing user
			const sessionWithoutUser = { ...mockSession };
			delete (sessionWithoutUser as any).user;
			await onRemoveBookmarkSeason(sessionWithoutUser, mockSeason);
			expect(removeFavoriteSeasonToUser).not.toHaveBeenCalled();
		});
	});
});
