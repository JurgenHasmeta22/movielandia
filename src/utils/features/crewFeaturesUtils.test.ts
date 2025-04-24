import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	onBookmarkCrew,
	onRemoveBookmarkCrew,
} from "@/utils/features/crewFeaturesUtils";
import {
	addFavoriteCrewToUser,
	removeFavoriteCrewToUser,
} from "@/actions/user/userBookmarks.actions";
import { showToast } from "@/utils/helpers/toast";
import { Crew } from "@prisma/client";
import { Session } from "next-auth";

// Mock dependencies
vi.mock("@/actions/user/userBookmarks.actions", () => ({
	addFavoriteCrewToUser: vi.fn(),
	removeFavoriteCrewToUser: vi.fn(),
}));

vi.mock("@/utils/helpers/toast", () => ({
	showToast: vi.fn(),
}));

// Mock console.error to avoid polluting test output
vi.spyOn(console, "error").mockImplementation(() => {});

describe("Crew Features Utils", () => {
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

	const mockCrew: Crew = {
		id: 1,
		fullname: "Test Crew",
		description: "A test crew member biography",
		photoSrc: "photo.jpg",
		photoSrcProd: "photo-prod.jpg",
		role: "Director",
		debut: "2010",
	} as Crew; // Type assertion to handle any missing properties

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("onBookmarkCrew", () => {
		it("should add crew to favorites and show success toast", async () => {
			await onBookmarkCrew(mockSession, mockCrew);

			expect(addFavoriteCrewToUser).toHaveBeenCalledWith(1, mockCrew.id);
			expect(showToast).toHaveBeenCalledWith(
				"success",
				"Crew added to favorites!",
			);
		});

		it("should handle errors and show error toast", async () => {
			const testError = new Error("Test error");
			vi.mocked(addFavoriteCrewToUser).mockRejectedValueOnce(testError);

			await onBookmarkCrew(mockSession, mockCrew);

			expect(addFavoriteCrewToUser).toHaveBeenCalledWith(1, mockCrew.id);
			expect(showToast).toHaveBeenCalledWith(
				"error",
				"An error occurred: Test error",
			);
			expect(console.error).toHaveBeenCalled();
		});

		it("should handle unknown errors", async () => {
			vi.mocked(addFavoriteCrewToUser).mockRejectedValueOnce(
				"Unknown error",
			);

			await onBookmarkCrew(mockSession, mockCrew);

			expect(addFavoriteCrewToUser).toHaveBeenCalledWith(1, mockCrew.id);
			expect(showToast).toHaveBeenCalledWith(
				"error",
				"An unexpected error occurred while adding the crew to favorites.",
			);
			expect(console.error).toHaveBeenCalled();
		});

		it("should do nothing if session or crew is missing", async () => {
			await onBookmarkCrew(null as unknown as Session, mockCrew);
			expect(addFavoriteCrewToUser).not.toHaveBeenCalled();

			await onBookmarkCrew(mockSession, null as unknown as Crew);
			expect(addFavoriteCrewToUser).not.toHaveBeenCalled();

			// Test with missing user
			const sessionWithoutUser = { ...mockSession };
			delete (sessionWithoutUser as any).user;
			await onBookmarkCrew(sessionWithoutUser, mockCrew);
			expect(addFavoriteCrewToUser).not.toHaveBeenCalled();
		});
	});

	describe("onRemoveBookmarkCrew", () => {
		it("should remove crew from favorites and show success toast", async () => {
			await onRemoveBookmarkCrew(mockSession, mockCrew);

			expect(removeFavoriteCrewToUser).toHaveBeenCalledWith(
				1,
				mockCrew.id,
			);
			expect(showToast).toHaveBeenCalledWith(
				"success",
				"Crew removed from favorites!",
			);
		});

		it("should handle errors and show error toast", async () => {
			const testError = new Error("Test error");
			vi.mocked(removeFavoriteCrewToUser).mockRejectedValueOnce(
				testError,
			);

			await onRemoveBookmarkCrew(mockSession, mockCrew);

			expect(removeFavoriteCrewToUser).toHaveBeenCalledWith(
				1,
				mockCrew.id,
			);
			expect(showToast).toHaveBeenCalledWith(
				"error",
				"An error occurred: Test error",
			);
			expect(console.error).toHaveBeenCalled();
		});

		it("should handle unknown errors", async () => {
			vi.mocked(removeFavoriteCrewToUser).mockRejectedValueOnce(
				"Unknown error",
			);

			await onRemoveBookmarkCrew(mockSession, mockCrew);

			expect(removeFavoriteCrewToUser).toHaveBeenCalledWith(
				1,
				mockCrew.id,
			);
			expect(showToast).toHaveBeenCalledWith(
				"error",
				"An unexpected error occurred while removing the crew from favorites.",
			);
			expect(console.error).toHaveBeenCalled();
		});

		it("should do nothing if session or crew is missing", async () => {
			await onRemoveBookmarkCrew(null as unknown as Session, mockCrew);
			expect(removeFavoriteCrewToUser).not.toHaveBeenCalled();

			await onRemoveBookmarkCrew(mockSession, null as unknown as Crew);
			expect(removeFavoriteCrewToUser).not.toHaveBeenCalled();

			// Test with missing user
			const sessionWithoutUser = { ...mockSession };
			delete (sessionWithoutUser as any).user;
			await onRemoveBookmarkCrew(sessionWithoutUser, mockCrew);
			expect(removeFavoriteCrewToUser).not.toHaveBeenCalled();
		});
	});
});
