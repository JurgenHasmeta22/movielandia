import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ListDetail } from "./ListDetail";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/utils/theme/theme";

// Mock dependencies
vi.mock("@mui/material", async () => {
    const actual = await vi.importActual("@mui/material");
    return {
        ...actual,
        useTheme: () => ({
            vars: {
                palette: {
                    text: {
                        primary: "#000000",
                    },
                    primary: {
                        main: "#ff0000",
                        light: "#ff5555",
                    },
                },
            },
            shadows: ["none", "1px 1px 1px rgba(0,0,0,0.1)"],
        }),
    };
});

vi.mock("../cardItem/CardItem", () => ({
    default: ({ data, type, path }: any) => {
        // Determine what property to display based on the data
        let displayText = "";
        if (data.title) {
            displayText = data.title;
        } else if (data.fullname) {
            displayText = data.fullname;
        }

        return (
            <div data-testid={`card-item-${type}`} data-path={path}>
                {displayText}
            </div>
        );
    },
    __esModule: true,
}));

describe("ListDetail", () => {
    // Helper function to render with ThemeProvider
    const renderWithTheme = (component: React.ReactElement) => {
        return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
    };

    it("renders null when data is empty", () => {
        const { container } = renderWithTheme(<ListDetail data={[]} type="movie" roleData="related" />);
        expect(container.firstChild).toBeNull();
    });

    it("renders movie list correctly", () => {
        const movieData = [
            { id: 1, title: "Movie 1", photoSrcProd: "/image1.jpg" },
            { id: 2, title: "Movie 2", photoSrcProd: "/image2.jpg" },
        ];

        renderWithTheme(<ListDetail data={movieData} type="movie" roleData="related" />);

        expect(screen.getByText("Related Movies")).toBeDefined();
        expect(screen.getAllByTestId("card-item-movie").length).toBe(2);
        expect(screen.getByText("Movie 1")).toBeDefined();
        expect(screen.getByText("Movie 2")).toBeDefined();
    });

    it("renders serie list correctly", () => {
        const serieData = [
            { id: 1, title: "Serie 1", photoSrcProd: "/image1.jpg" },
            { id: 2, title: "Serie 2", photoSrcProd: "/image2.jpg" },
        ];

        renderWithTheme(<ListDetail data={serieData} type="serie" roleData="related" />);

        expect(screen.getByText("Related Series")).toBeDefined();
        expect(screen.getAllByTestId("card-item-serie").length).toBe(2);
        expect(screen.getByText("Serie 1")).toBeDefined();
        expect(screen.getByText("Serie 2")).toBeDefined();
    });

    it("renders season list correctly", () => {
        const seasonData = [
            { id: 1, title: "Season 1", photoSrcProd: "/image1.jpg" },
            { id: 2, title: "Season 2", photoSrcProd: "/image2.jpg" },
        ];

        renderWithTheme(<ListDetail data={seasonData} type="season" roleData="related" />);

        expect(screen.getByText("Related Seasons")).toBeDefined();
        expect(screen.getAllByTestId("card-item-season").length).toBe(2);
        expect(screen.getByText("Season 1")).toBeDefined();
        expect(screen.getByText("Season 2")).toBeDefined();
    });

    it("renders episode list correctly", () => {
        const episodeData = [
            { id: 1, title: "Episode 1", photoSrcProd: "/image1.jpg" },
            { id: 2, title: "Episode 2", photoSrcProd: "/image2.jpg" },
        ];

        renderWithTheme(<ListDetail data={episodeData} type="episode" roleData="related" />);

        expect(screen.getByText("Related Episodes")).toBeDefined();
        expect(screen.getAllByTestId("card-item-episode").length).toBe(2);
        expect(screen.getByText("Episode 1")).toBeDefined();
        expect(screen.getByText("Episode 2")).toBeDefined();
    });

    it("renders actor list correctly with cast roleData", () => {
        const actorData = [
            { actor: { id: 1, fullname: "Actor 1", photoSrcProd: "/image1.jpg" } },
            { actor: { id: 2, fullname: "Actor 2", photoSrcProd: "/image2.jpg" } },
        ];

        renderWithTheme(<ListDetail data={actorData} type="actor" roleData="cast" />);

        expect(screen.getByText("Cast")).toBeDefined();
        expect(screen.getAllByTestId("card-item-actor").length).toBe(2);
        expect(screen.getByText("Actor 1")).toBeDefined();
        expect(screen.getByText("Actor 2")).toBeDefined();
    });

    it("renders actor list correctly with Movies roleData", () => {
        const actorMovieData = [
            { movie: { id: 1, title: "Movie 1", photoSrcProd: "/image1.jpg" } },
            { movie: { id: 2, title: "Movie 2", photoSrcProd: "/image2.jpg" } },
        ];

        renderWithTheme(<ListDetail data={actorMovieData} type="actor" roleData="Movies" />);

        expect(screen.getByText("Starred Movies")).toBeDefined();
        expect(screen.getAllByTestId("card-item-actor").length).toBe(2);

        // Update the mock to match what CardItem would actually render
        // The CardItem mock renders the title property directly
        const cardItems = screen.getAllByTestId("card-item-actor");
        expect(cardItems[0].textContent).toBe("Movie 1");
        expect(cardItems[1].textContent).toBe("Movie 2");
    });

    it("renders crew list correctly with production roleData", () => {
        const crewData = [
            { crew: { id: 1, fullname: "Crew 1", photoSrcProd: "/image1.jpg" } },
            { crew: { id: 2, fullname: "Crew 2", photoSrcProd: "/image2.jpg" } },
        ];

        renderWithTheme(<ListDetail data={crewData} type="crew" roleData="production" />);

        expect(screen.getByText("Crew")).toBeDefined();
        expect(screen.getAllByTestId("card-item-crew").length).toBe(2);
        expect(screen.getByText("Crew 1")).toBeDefined();
        expect(screen.getByText("Crew 2")).toBeDefined();
    });

    it("renders crew list correctly with Movies roleData", () => {
        const crewMovieData = [
            { movie: { id: 1, title: "Movie 1", photoSrcProd: "/image1.jpg" } },
            { movie: { id: 2, title: "Movie 2", photoSrcProd: "/image2.jpg" } },
        ];

        renderWithTheme(<ListDetail data={crewMovieData} type="crew" roleData="Movies" />);

        expect(screen.getByText("Worked on Movies")).toBeDefined();
        expect(screen.getAllByTestId("card-item-crew").length).toBe(2);

        // Update the mock to match what CardItem would actually render
        // The CardItem mock renders the title property directly
        const cardItems = screen.getAllByTestId("card-item-crew");
        expect(cardItems[0].textContent).toBe("Movie 1");
        expect(cardItems[1].textContent).toBe("Movie 2");
    });

    it("passes correct path to CardItem for actor type", () => {
        const actorData = [{ actor: { id: 1, fullname: "Actor 1", photoSrcProd: "/image1.jpg" } }];

        renderWithTheme(<ListDetail data={actorData} type="actor" roleData="cast" />);

        const cardItem = screen.getByTestId("card-item-actor");
        expect(cardItem.getAttribute("data-path")).toBe("actors");
    });

    it("passes correct path to CardItem for crew type", () => {
        const crewData = [{ crew: { id: 1, fullname: "Crew 1", photoSrcProd: "/image1.jpg" } }];

        renderWithTheme(<ListDetail data={crewData} type="crew" roleData="production" />);

        const cardItem = screen.getByTestId("card-item-crew");
        expect(cardItem.getAttribute("data-path")).toBe("crew");
    });
});
