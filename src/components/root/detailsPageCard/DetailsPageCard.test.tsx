import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DetailsPageCard } from "./DetailsPageCard";
import { useSession } from "next-auth/react";
import { useTransition } from "react";
import { formatDate } from "@/utils/helpers/utils";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/utils/theme/theme";

// Mock dependencies
vi.mock("next-auth/react", () => ({
	useSession: vi.fn(),
}));

vi.mock("react", async () => {
	const actual = await vi.importActual("react");
	return {
		...actual,
		useTransition: vi.fn(() => [false, vi.fn()]),
	};
});

vi.mock("@/utils/helpers/utils", () => ({
	formatDate: vi.fn((date) => "January 1, 2023"),
}));

vi.mock("next/image", () => ({
	default: ({ src, alt, ...props }: any) => (
		<div
			data-src={src}
			data-alt={alt}
			{...props}
			data-testid="mock-image"
		/>
	),
}));

vi.mock("next/link", () => ({
	default: ({ href, children, ...props }: any) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

vi.mock("./PersonRoleCard", () => ({
	default: ({ data, type }: any) => (
		<div data-testid={`person-role-card-${type}`}>
			{type}: {data.fullname}
		</div>
	),
}));

vi.mock("./PaginationPersonControl", () => ({
	default: ({ currentPage, pageCount, urlParamName }: any) => (
		<div data-testid="pagination-control">
			Page {currentPage} of {pageCount} ({urlParamName})
		</div>
	),
}));

describe("DetailsPageCard", () => {
	const mockStartTransition = vi.fn();
	const mockOnBookmark = vi.fn();
	const mockOnRemoveBookmark = vi.fn();
	const mockOnGoBack = vi.fn();

	// Helper function to render with ThemeProvider
	const renderWithTheme = (component: React.ReactElement) => {
		return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useTransition).mockReturnValue([false, mockStartTransition]);
		vi.mocked(useSession).mockReturnValue({
			data: {
				user: {
					userName: "testuser",
				},
			},
			status: "authenticated",
			update: vi.fn(),
		} as any);
	});

	it("renders movie data correctly", () => {
		const movieData = {
			id: 1,
			title: "Test Movie",
			photoSrcProd: "/test-image.jpg",
			description: "A test movie description",
			dateAired: new Date("2023-01-01"),
			duration: 120,
			ratingImdb: 8.5,
			averageRating: 4.5,
			trailerSrc: "https://youtube.com/test",
			genres: [
				{ genre: { id: 1, name: "Action" } },
				{ genre: { id: 2, name: "Drama" } },
			],
		};

		renderWithTheme(
			<DetailsPageCard
				data={movieData}
				type="movie"
				isBookmarked={false}
				onBookmark={mockOnBookmark}
				onRemoveBookmark={mockOnRemoveBookmark}
			/>,
		);

		expect(screen.getByText("Test Movie")).toBeDefined();
		expect(screen.getByText("A test movie description")).toBeDefined();
		expect(screen.getByText("120 mins")).toBeDefined();
		expect(screen.getByText("Action")).toBeDefined();
		expect(screen.getByText("Drama")).toBeDefined();
		expect(screen.getByText("Watch trailer")).toBeDefined();
		expect(screen.getByText("Bookmark")).toBeDefined();
	});

	it("renders serie data correctly", () => {
		const serieData = {
			id: 1,
			title: "Test Serie",
			photoSrcProd: "/test-image.jpg",
			description: "A test serie description",
			dateAired: new Date("2023-01-01"),
			ratingImdb: 8.5,
			averageRating: 4.5,
			trailerSrc: "https://youtube.com/test",
			genres: [
				{ genre: { id: 1, name: "Action" } },
				{ genre: { id: 2, name: "Drama" } },
			],
		};

		renderWithTheme(
			<DetailsPageCard
				data={serieData}
				type="serie"
				isBookmarked={false}
				onBookmark={mockOnBookmark}
				onRemoveBookmark={mockOnRemoveBookmark}
			/>,
		);

		expect(screen.getByText("Test Serie")).toBeDefined();
		expect(screen.getByText("A test serie description")).toBeDefined();
		expect(screen.queryByText("120 mins")).toBeNull(); // Duration not shown for series
		expect(screen.getByText("Action")).toBeDefined();
		expect(screen.getByText("Drama")).toBeDefined();
		expect(screen.getByText("Watch trailer")).toBeDefined();
		expect(screen.getByText("Bookmark")).toBeDefined();
	});

	it("renders season data with Go Back button", () => {
		const seasonData = {
			id: 1,
			title: "Season 1",
			photoSrcProd: "/test-image.jpg",
			description: "A test season description",
			dateAired: new Date("2023-01-01"),
			ratingImdb: 8.5,
			averageRating: 4.5,
			trailerSrc: "https://youtube.com/test",
			genres: [
				{ genre: { id: 1, name: "Action" } },
				{ genre: { id: 2, name: "Drama" } },
			],
		};

		renderWithTheme(
			<DetailsPageCard
				data={seasonData}
				type="season"
				isBookmarked={false}
				onBookmark={mockOnBookmark}
				onRemoveBookmark={mockOnRemoveBookmark}
				onGoBack={mockOnGoBack}
			/>,
		);

		expect(screen.getByText("Season 1")).toBeDefined();
		expect(screen.getByText("Go Back")).toBeDefined();

		// Test Go Back button click
		fireEvent.click(screen.getByText("Go Back"));
		expect(mockOnGoBack).toHaveBeenCalledTimes(1);
	});

	it("renders actor data correctly", () => {
		const actorData = {
			id: 1,
			fullname: "John Doe",
			photoSrcProd: "/test-image.jpg",
			description: "A famous actor",
			debut: "2010",
			averageRating: 4.5,
		};

		renderWithTheme(
			<DetailsPageCard
				data={actorData}
				type="actor"
				isBookmarked={false}
				onBookmark={mockOnBookmark}
				onRemoveBookmark={mockOnRemoveBookmark}
			/>,
		);

		expect(screen.getByText("John Doe")).toBeDefined();
		expect(screen.getByText("A famous actor")).toBeDefined();
		expect(screen.getByText("2010")).toBeDefined();
		expect(screen.queryByText("Watch trailer")).toBeNull(); // No trailer for actors
	});

	it("renders cast and crew sections when provided", () => {
		const movieData = {
			id: 1,
			title: "Test Movie",
			photoSrcProd: "/test-image.jpg",
			description: "A test movie description",
			dateAired: new Date("2023-01-01"),
			duration: 120,
			ratingImdb: 8.5,
			averageRating: 4.5,
			trailerSrc: "https://youtube.com/test",
			genres: [{ genre: { id: 1, name: "Action" } }],
		};

		const castData = [
			{ actor: { id: 1, fullname: "Actor 1" } },
			{ actor: { id: 2, fullname: "Actor 2" } },
		];

		const crewData = [
			{ crew: { id: 1, fullname: "Crew 1" } },
			{ crew: { id: 2, fullname: "Crew 2" } },
		];

		renderWithTheme(
			<DetailsPageCard
				data={movieData}
				type="movie"
				isBookmarked={false}
				onBookmark={mockOnBookmark}
				onRemoveBookmark={mockOnRemoveBookmark}
				cast={castData}
				crew={crewData}
				currentCastPage={1}
				currentCrewPage={1}
				castPageCount={2}
				crewPageCount={2}
			/>,
		);

		expect(screen.getByText("Featured Cast")).toBeDefined();
		expect(screen.getByText("Featured Crew")).toBeDefined();
		expect(screen.getAllByTestId(/person-role-card-actor/).length).toBe(2);
		expect(screen.getAllByTestId(/person-role-card-crew/).length).toBe(2);
		expect(screen.getAllByTestId("pagination-control").length).toBe(2);
	});

	it("handles bookmark action when user is logged in", () => {
		const movieData = {
			id: 1,
			title: "Test Movie",
			photoSrcProd: "/test-image.jpg",
			description: "A test movie description",
			dateAired: new Date("2023-01-01"),
			duration: 120,
			ratingImdb: 8.5,
			averageRating: 4.5,
			trailerSrc: "https://youtube.com/test",
			genres: [{ genre: { id: 1, name: "Action" } }],
		};

		renderWithTheme(
			<DetailsPageCard
				data={movieData}
				type="movie"
				isBookmarked={false}
				onBookmark={mockOnBookmark}
				onRemoveBookmark={mockOnRemoveBookmark}
			/>,
		);

		fireEvent.click(screen.getByText("Bookmark"));
		expect(mockStartTransition).toHaveBeenCalledTimes(1);
		expect(mockOnBookmark).toHaveBeenCalledTimes(1);
		expect(mockOnRemoveBookmark).not.toHaveBeenCalled();
	});

	it("handles remove bookmark action when already bookmarked", () => {
		const movieData = {
			id: 1,
			title: "Test Movie",
			photoSrcProd: "/test-image.jpg",
			description: "A test movie description",
			dateAired: new Date("2023-01-01"),
			duration: 120,
			ratingImdb: 8.5,
			averageRating: 4.5,
			trailerSrc: "https://youtube.com/test",
			genres: [{ genre: { id: 1, name: "Action" } }],
		};

		renderWithTheme(
			<DetailsPageCard
				data={movieData}
				type="movie"
				isBookmarked={true}
				onBookmark={mockOnBookmark}
				onRemoveBookmark={mockOnRemoveBookmark}
			/>,
		);

		fireEvent.click(screen.getByText("Bookmarked"));
		expect(mockStartTransition).toHaveBeenCalledTimes(1);
		expect(mockOnRemoveBookmark).toHaveBeenCalledTimes(1);
		expect(mockOnBookmark).not.toHaveBeenCalled();
	});

	it("does not show bookmark button when user is not logged in", () => {
		vi.mocked(useSession).mockReturnValue({
			data: null,
			status: "unauthenticated",
			update: vi.fn(),
		} as any);

		const movieData = {
			id: 1,
			title: "Test Movie",
			photoSrcProd: "/test-image.jpg",
			description: "A test movie description",
			dateAired: new Date("2023-01-01"),
			duration: 120,
			ratingImdb: 8.5,
			averageRating: 4.5,
			trailerSrc: "https://youtube.com/test",
			genres: [{ genre: { id: 1, name: "Action" } }],
		};

		renderWithTheme(
			<DetailsPageCard
				data={movieData}
				type="movie"
				isBookmarked={false}
				onBookmark={mockOnBookmark}
				onRemoveBookmark={mockOnRemoveBookmark}
			/>,
		);

		expect(screen.queryByText("Bookmark")).toBeNull();
		expect(screen.queryByText("Bookmarked")).toBeNull();
	});
});
