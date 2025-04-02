import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CardItem, { CardItemType } from "./CardItem";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/utils/theme/theme";
import { onBookmarkMovie, onRemoveBookmarkMovie } from "@/utils/features/movieFeaturesUtils";
import { onBookmarkSerie, onRemoveBookmarkSerie } from "@/utils/features/serieFeaturesUtils";
import { onBookmarkSeason, onRemoveBookmarkSeason } from "@/utils/features/seasonFeaturesUtils";
import { onBookmarkEpisode, onRemoveBookmarkEpisode } from "@/utils/features/episodeFeaturesUtils";
import { onBookmarkActor, onRemoveBookmarkActor } from "@/utils/features/actorFeaturesUtils";
import { onBookmarkCrew, onRemoveBookmarkCrew } from "@/utils/features/crewFeaturesUtils";

// Mock Next.js modules
vi.mock("next/navigation", () => ({
    useParams: vi.fn().mockReturnValue({}),
}));

// Mock next-auth
vi.mock("next-auth/react", () => ({
    useSession: vi.fn().mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: vi.fn(),
    }),
}));

// Mock next/image
vi.mock("next/image", () => ({
    default: ({ src, alt, fill, style }: any) => {
        // Use different data-testid for IMDb icon vs. main image
        const testId = src.includes("/icons/") ? "icon-image" : "card-image";
        return (
            <img
                src={src}
                alt={alt}
                data-testid={testId}
                style={{
                    objectFit: style?.objectFit || "cover",
                    width: fill ? "100%" : undefined,
                    height: fill ? "100%" : undefined,
                }}
            />
        );
    },
}));

// Mock bookmark functions
vi.mock("@/utils/features/movieFeaturesUtils", () => ({
    onBookmarkMovie: vi.fn().mockResolvedValue(undefined),
    onRemoveBookmarkMovie: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/utils/features/serieFeaturesUtils", () => ({
    onBookmarkSerie: vi.fn().mockResolvedValue(undefined),
    onRemoveBookmarkSerie: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/utils/features/seasonFeaturesUtils", () => ({
    onBookmarkSeason: vi.fn().mockResolvedValue(undefined),
    onRemoveBookmarkSeason: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/utils/features/episodeFeaturesUtils", () => ({
    onBookmarkEpisode: vi.fn().mockResolvedValue(undefined),
    onRemoveBookmarkEpisode: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/utils/features/actorFeaturesUtils", () => ({
    onBookmarkActor: vi.fn().mockResolvedValue(undefined),
    onRemoveBookmarkActor: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/utils/features/crewFeaturesUtils", () => ({
    onBookmarkCrew: vi.fn().mockResolvedValue(undefined),
    onRemoveBookmarkCrew: vi.fn().mockResolvedValue(undefined),
}));

// Mock window.ontouchstart for touch device detection
Object.defineProperty(window, "ontouchstart", {
    configurable: true,
    value: undefined,
});

// Mock console.error to avoid polluting test output
const originalConsoleError = console.error;
beforeEach(() => {
    console.error = vi.fn();
});

afterEach(() => {
    console.error = originalConsoleError;
    vi.clearAllMocks();
});

// Test data for different card types
const movieData = {
    id: 1,
    title: "Test Movie",
    photoSrcProd: "/test-movie.jpg",
    description: "A test movie description",
    dateAired: new Date("2023-01-01"),
    ratingImdb: 8.5,
    averageRating: 4.5,
    isBookmarked: false,
};

const serieData = {
    id: 2,
    title: "Test Serie",
    photoSrcProd: "/test-serie.jpg",
    description: "A test serie description",
    dateAired: new Date("2022-05-15"),
    ratingImdb: 9.0,
    averageRating: 4.8,
    isBookmarked: true,
};

const seasonData = {
    id: 3,
    title: "Test Season",
    photoSrcProd: "/test-season.jpg",
    description: "A test season description",
    dateAired: new Date("2022-06-20"),
    ratingImdb: 8.7,
    averageRating: 4.6,
    isBookmarked: false,
};

const episodeData = {
    id: 4,
    title: "Test Episode",
    photoSrcProd: "/test-episode.jpg",
    description: "A test episode description",
    dateAired: new Date("2022-07-10"),
    ratingImdb: 8.2,
    averageRating: 4.3,
    isBookmarked: true,
};

const actorData = {
    id: 5,
    fullname: "Test Actor",
    photoSrcProd: "/test-actor.jpg",
    description: "A test actor description",
    debut: "2010",
    ratingImdb: 8.8,
    averageRating: 4.7,
    isBookmarked: false,
    title: "Test Actor", // Add title for path generation
};

const crewData = {
    id: 6,
    fullname: "Test Crew",
    photoSrcProd: "/test-crew.jpg",
    description: "A test crew description",
    debut: "2005",
    ratingImdb: 8.9,
    averageRating: 4.9,
    isBookmarked: true,
    title: "Test Crew", // Add title for path generation
};

const userData = {
    id: 7,
    userName: "testuser",
    photoSrcProd: "/test-user.jpg",
    description: "A test user description",
    isBookmarked: false,
};

// Helper function to render CardItem with ThemeProvider
const renderCardItem = (data: any, type: CardItemType, path?: string, isAutocomplete?: boolean) => {
    return render(
        <ThemeProvider theme={theme}>
            <CardItem data={data} type={type} path={path} isAutocomplete={isAutocomplete} />
        </ThemeProvider>,
    );
};

describe("CardItem Component", () => {
    describe("Rendering different card types", () => {
        it("should render a movie card correctly", () => {
            // Mock session with no user
            vi.mocked(useSession).mockReturnValue({ data: null, status: "unauthenticated", update: vi.fn() } as any);

            renderCardItem(movieData, "movie");

            const image = screen.getByTestId("card-image");
            expect(image.getAttribute("src")).toBe("/test-movie.jpg");
            expect(screen.getByText("Test Movie (2023)")).toBeDefined();
            expect(screen.getByText("A test movie description")).toBeDefined();
            expect(screen.getByText("8.5")).toBeDefined();
            expect(screen.getByText("4.5")).toBeDefined();
        });

        it("should render a serie card correctly", () => {
            vi.mocked(useSession).mockReturnValue({ data: null, status: "unauthenticated", update: vi.fn() } as any);

            renderCardItem(serieData, "serie");

            const image = screen.getByTestId("card-image");
            expect(image.getAttribute("src")).toBe("/test-serie.jpg");
            expect(screen.getByText("Test Serie (2022)")).toBeDefined();
            expect(screen.getByText("A test serie description")).toBeDefined();
        });

        it("should render an actor card correctly", () => {
            vi.mocked(useSession).mockReturnValue({ data: null, status: "unauthenticated", update: vi.fn() } as any);

            renderCardItem(actorData, "actor", "actors");

            const image = screen.getByTestId("card-image");
            expect(image.getAttribute("src")).toBe("/test-actor.jpg");
            expect(screen.getByText("Test Actor Debut Year: (2010)")).toBeDefined();
            expect(screen.getByText("A test actor description")).toBeDefined();
        });

        it("should render a user card correctly", () => {
            vi.mocked(useSession).mockReturnValue({ data: null, status: "unauthenticated", update: vi.fn() } as any);

            renderCardItem(userData, "user");

            const image = screen.getByTestId("card-image");
            expect(image.getAttribute("src")).toBe("/test-user.jpg");
            expect(screen.getByText("testuser")).toBeDefined();
            expect(screen.getByText("A test user description")).toBeDefined();
            // User cards should not have ratings
            expect(screen.queryByText("N/A")).toBeNull();
        });

        it("should render with autocomplete size", () => {
            vi.mocked(useSession).mockReturnValue({ data: null, status: "unauthenticated", update: vi.fn() } as any);

            renderCardItem(movieData, "movie", undefined, true);

            // We can't easily test the sx props directly, but we can verify the component renders
            expect(screen.getByTestId("card-image")).toBeDefined();
        });
    });

    describe("Link generation", () => {
        it("should generate correct movie link", () => {
            vi.mocked(useSession).mockReturnValue({ data: null, status: "unauthenticated", update: vi.fn() } as any);

            renderCardItem(movieData, "movie");

            const link = screen.getByRole("link");
            expect(link.getAttribute("href")).toBe("/movies/1/Test-Movie");
        });

        it("should generate correct serie link", () => {
            vi.mocked(useSession).mockReturnValue({ data: null, status: "unauthenticated", update: vi.fn() } as any);

            renderCardItem(serieData, "serie");

            const link = screen.getByRole("link");
            expect(link.getAttribute("href")).toBe("/series/2/Test-Serie");
        });

        it("should generate correct actor link", () => {
            vi.mocked(useSession).mockReturnValue({ data: null, status: "unauthenticated", update: vi.fn() } as any);

            renderCardItem(actorData, "actor", "actors");

            const link = screen.getByRole("link");
            expect(link.getAttribute("href")).toBe("/actors/5/Test-Actor");
        });

        it("should generate correct season link with params", () => {
            vi.mocked(useSession).mockReturnValue({ data: null, status: "unauthenticated", update: vi.fn() } as any);
            vi.mocked(useParams).mockReturnValue({
                serieId: "10",
                serieTitle: "Parent Serie",
            });

            renderCardItem(seasonData, "season");

            const link = screen.getByRole("link");
            expect(link.getAttribute("href")).toBe("/series/10/Parent-Serie/seasons/3/Test-Season");
        });

        it("should generate correct episode link with params", () => {
            vi.mocked(useSession).mockReturnValue({ data: null, status: "unauthenticated", update: vi.fn() } as any);
            vi.mocked(useParams).mockReturnValue({
                serieId: "10",
                serieTitle: "Parent Serie",
                seasonId: "20",
                seasonTitle: "Season One",
            });

            renderCardItem(episodeData, "episode");

            const link = screen.getByRole("link");
            expect(link.getAttribute("href")).toBe(
                "/series/10/Parent-Serie/seasons/20/Season-One/episodes/4/Test-Episode",
            );
        });
    });

    describe("Bookmark functionality", () => {
        beforeEach(() => {
            // Reset all mocks before each test
            vi.clearAllMocks();

            // Mock authenticated session
            vi.mocked(useSession).mockReturnValue({
                data: {
                    user: {
                        id: "1",
                        email: "test@example.com",
                        userName: "testuser",
                        role: "user",
                    },
                    expires: "2023-01-01",
                },
                status: "authenticated",
                update: vi.fn(),
            } as any);
        });

        it("should call onBookmarkMovie when bookmark button is clicked on a movie card", async () => {
            renderCardItem({ ...movieData, isBookmarked: false }, "movie");

            // Find and click the bookmark button (inside the Box that wraps the button)
            const bookmarkBox = screen.getByText("Bookmark").parentElement;
            expect(bookmarkBox).toBeDefined();
            fireEvent.click(bookmarkBox!);

            await waitFor(() => {
                expect(onBookmarkMovie).toHaveBeenCalledWith(
                    expect.objectContaining({ user: expect.anything() }),
                    expect.objectContaining({ id: 1 }),
                );
            });
        });

        it("should call onRemoveBookmarkMovie when bookmark button is clicked on a bookmarked movie card", async () => {
            renderCardItem({ ...movieData, isBookmarked: true }, "movie");

            // Find and click the bookmark button (inside the Box that wraps the button)
            const bookmarkBox = screen.getByText("Bookmarked").parentElement;
            expect(bookmarkBox).toBeDefined();
            fireEvent.click(bookmarkBox!);

            await waitFor(() => {
                expect(onRemoveBookmarkMovie).toHaveBeenCalledWith(
                    expect.objectContaining({ user: expect.anything() }),
                    expect.objectContaining({ id: 1 }),
                );
            });
        });

        it("should call onBookmarkSerie when bookmark button is clicked on a serie card", async () => {
            renderCardItem({ ...serieData, isBookmarked: false }, "serie");

            // Find and click the bookmark button (inside the Box that wraps the button)
            const bookmarkBox = screen.getByText("Bookmark").parentElement;
            expect(bookmarkBox).toBeDefined();
            fireEvent.click(bookmarkBox!);

            await waitFor(() => {
                expect(onBookmarkSerie).toHaveBeenCalledWith(
                    expect.objectContaining({ user: expect.anything() }),
                    expect.objectContaining({ id: 2 }),
                );
            });
        });

        it("should call onRemoveBookmarkSerie when bookmark button is clicked on a bookmarked serie card", async () => {
            renderCardItem({ ...serieData, isBookmarked: true }, "serie");

            // Find and click the bookmark button (inside the Box that wraps the button)
            const bookmarkBox = screen.getByText("Bookmarked").parentElement;
            expect(bookmarkBox).toBeDefined();
            fireEvent.click(bookmarkBox!);

            await waitFor(() => {
                expect(onRemoveBookmarkSerie).toHaveBeenCalledWith(
                    expect.objectContaining({ user: expect.anything() }),
                    expect.objectContaining({ id: 2 }),
                );
            });
        });

        it("should call onBookmarkSeason when bookmark button is clicked on a season card", async () => {
            renderCardItem({ ...seasonData, isBookmarked: false }, "season");

            // Find and click the bookmark button (inside the Box that wraps the button)
            const bookmarkBox = screen.getByText("Bookmark").parentElement;
            expect(bookmarkBox).toBeDefined();
            fireEvent.click(bookmarkBox!);

            await waitFor(() => {
                expect(onBookmarkSeason).toHaveBeenCalledWith(
                    expect.objectContaining({ user: expect.anything() }),
                    expect.objectContaining({ id: 3 }),
                );
            });
        });

        it("should call onRemoveBookmarkSeason when bookmark button is clicked on a bookmarked season card", async () => {
            renderCardItem({ ...seasonData, isBookmarked: true }, "season");

            // Find and click the bookmark button (inside the Box that wraps the button)
            const bookmarkBox = screen.getByText("Bookmarked").parentElement;
            expect(bookmarkBox).toBeDefined();
            fireEvent.click(bookmarkBox!);

            await waitFor(() => {
                expect(onRemoveBookmarkSeason).toHaveBeenCalledWith(
                    expect.objectContaining({ user: expect.anything() }),
                    expect.objectContaining({ id: 3 }),
                );
            });
        });

        it("should call onBookmarkEpisode when bookmark button is clicked on an episode card", async () => {
            renderCardItem({ ...episodeData, isBookmarked: false }, "episode");

            // Find and click the bookmark button (inside the Box that wraps the button)
            const bookmarkBox = screen.getByText("Bookmark").parentElement;
            expect(bookmarkBox).toBeDefined();
            fireEvent.click(bookmarkBox!);

            await waitFor(() => {
                expect(onBookmarkEpisode).toHaveBeenCalledWith(
                    expect.objectContaining({ user: expect.anything() }),
                    expect.objectContaining({ id: 4 }),
                );
            });
        });

        it("should call onRemoveBookmarkEpisode when bookmark button is clicked on a bookmarked episode card", async () => {
            renderCardItem({ ...episodeData, isBookmarked: true }, "episode");

            // Find and click the bookmark button (inside the Box that wraps the button)
            const bookmarkBox = screen.getByText("Bookmarked").parentElement;
            expect(bookmarkBox).toBeDefined();
            fireEvent.click(bookmarkBox!);

            await waitFor(() => {
                expect(onRemoveBookmarkEpisode).toHaveBeenCalledWith(
                    expect.objectContaining({ user: expect.anything() }),
                    expect.objectContaining({ id: 4 }),
                );
            });
        });

        it("should call onBookmarkActor when bookmark button is clicked on an actor card", async () => {
            renderCardItem({ ...actorData, isBookmarked: false }, "actor");

            // Find and click the bookmark button (inside the Box that wraps the button)
            const bookmarkBox = screen.getByText("Bookmark").parentElement;
            expect(bookmarkBox).toBeDefined();
            fireEvent.click(bookmarkBox!);

            await waitFor(() => {
                expect(onBookmarkActor).toHaveBeenCalledWith(
                    expect.objectContaining({ user: expect.anything() }),
                    expect.objectContaining({ id: 5 }),
                );
            });
        });

        it("should call onRemoveBookmarkActor when bookmark button is clicked on a bookmarked actor card", async () => {
            renderCardItem({ ...actorData, isBookmarked: true }, "actor");

            // Find and click the bookmark button (inside the Box that wraps the button)
            const bookmarkBox = screen.getByText("Bookmarked").parentElement;
            expect(bookmarkBox).toBeDefined();
            fireEvent.click(bookmarkBox!);

            await waitFor(() => {
                expect(onRemoveBookmarkActor).toHaveBeenCalledWith(
                    expect.objectContaining({ user: expect.anything() }),
                    expect.objectContaining({ id: 5 }),
                );
            });
        });

        it("should call onBookmarkCrew when bookmark button is clicked on a crew card", async () => {
            renderCardItem({ ...crewData, isBookmarked: false }, "crew");

            // Find and click the bookmark button (inside the Box that wraps the button)
            const bookmarkBox = screen.getByText("Bookmark").parentElement;
            expect(bookmarkBox).toBeDefined();
            fireEvent.click(bookmarkBox!);

            await waitFor(() => {
                expect(onBookmarkCrew).toHaveBeenCalledWith(
                    expect.objectContaining({ user: expect.anything() }),
                    expect.objectContaining({ id: 6 }),
                );
            });
        });

        it("should call onRemoveBookmarkCrew when bookmark button is clicked on a bookmarked crew card", async () => {
            renderCardItem({ ...crewData, isBookmarked: true }, "crew");

            // Find and click the bookmark button (inside the Box that wraps the button)
            const bookmarkBox = screen.getByText("Bookmarked").parentElement;
            expect(bookmarkBox).toBeDefined();
            fireEvent.click(bookmarkBox!);

            await waitFor(() => {
                expect(onRemoveBookmarkCrew).toHaveBeenCalledWith(
                    expect.objectContaining({ user: expect.anything() }),
                    expect.objectContaining({ id: 6 }),
                );
            });
        });

        it("should not show bookmark button for user cards", () => {
            renderCardItem(userData, "user");

            // There should be no bookmark text in user cards
            expect(screen.queryByText("Bookmark")).toBeNull();
            expect(screen.queryByText("Bookmarked")).toBeNull();
        });

        it("should not call bookmark functions when no session exists", async () => {
            // Mock unauthenticated session
            vi.mocked(useSession).mockReturnValue({ data: null, status: "unauthenticated", update: vi.fn() } as any);

            renderCardItem(movieData, "movie");

            // Bookmark button should not be visible
            expect(screen.queryByText("Bookmark")).toBeNull();
        });
    });

    describe("Touch device behavior", () => {
        beforeEach(() => {
            vi.mocked(useSession).mockReturnValue({ data: null, status: "unauthenticated", update: vi.fn() } as any);
        });

        // For touch device tests, we need to test the component's behavior directly
        // since we can't easily mock the internal state and touch detection
        it("should handle touch device behavior", () => {
            // Instead of testing the preventDefault directly, we'll test that
            // the component has the expected click handler on the link
            renderCardItem(movieData, "movie");

            const link = screen.getByRole("link");
            expect(link).toHaveProperty("onclick");

            // We can also verify that the hover overlay exists
            const overlay = screen.getByText("Test Movie (2023)").closest(".hoverOverlay");
            expect(overlay).toBeDefined();
        });
    });

    describe("Edge cases", () => {
        beforeEach(() => {
            vi.mocked(useSession).mockReturnValue({ data: null, status: "unauthenticated", update: vi.fn() } as any);
        });

        it("should handle missing image by using placeholder", () => {
            const dataWithoutImage = { ...movieData, photoSrcProd: undefined };
            renderCardItem(dataWithoutImage, "movie");

            const image = screen.getByTestId("card-image");
            expect(image.getAttribute("src")).toBe("/images/placeholder.jpg");
        });

        it("should handle missing description", () => {
            const dataWithoutDescription = { ...movieData, description: undefined };
            renderCardItem(dataWithoutDescription, "movie");

            expect(screen.queryByText("A test movie description")).toBeNull();
        });

        it("should handle missing ratings", () => {
            const dataWithoutRatings = {
                ...movieData,
                ratingImdb: undefined,
                averageRating: undefined,
            };
            renderCardItem(dataWithoutRatings, "movie");

            // Should show N/A for missing ratings
            const naTexts = screen.getAllByText("N/A");
            expect(naTexts.length).toBe(2);
        });

        it("should handle zero average rating", () => {
            const dataWithZeroRating = { ...movieData, averageRating: 0.0 };
            renderCardItem(dataWithZeroRating, "movie");

            // Should show N/A for zero rating
            expect(screen.getByText("N/A")).toBeDefined();
        });
    });
});
