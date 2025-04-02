import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomeHeroSection from "./HomeHero";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/utils/theme/theme";

// Mock dependencies
vi.mock("next/image", () => ({
    default: ({ src, alt, ...props }: any) => <div data-src={src} data-alt={alt} {...props} data-testid="mock-image" />,
}));

vi.mock("next/link", () => ({
    default: ({ href, children, ...props }: any) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

// Mock MUI theme
vi.mock("@mui/material", async () => {
    const actual = await vi.importActual("@mui/material");
    return {
        ...actual,
        useTheme: () => ({
            vars: {
                palette: {
                    common: {
                        white: "#ffffff",
                    },
                },
            },
            shadows: ["none", "1px 1px 1px rgba(0,0,0,0.1)"],
        }),
    };
});

describe("HomeHeroSection", () => {
    // Helper function to render with ThemeProvider
    const renderWithTheme = (component: React.ReactElement) => {
        return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
    };

    it("renders the component correctly", () => {
        renderWithTheme(<HomeHeroSection />);

        // Check main headings
        expect(screen.getByText("Dive into MovieLandia24")).toBeDefined();
        expect(screen.getByText("Your Gateway to the World of Cinema!")).toBeDefined();

        // Check description text
        expect(screen.getByText(/Explore the latest blockbusters and timeless classics/i)).toBeDefined();

        // Check buttons
        expect(screen.getByText("Explore Movies")).toBeDefined();
        expect(screen.getByText("Browse Series")).toBeDefined();

        // Check links
        const movieLink = screen.getByText("Explore Movies").closest("a");
        const seriesLink = screen.getByText("Browse Series").closest("a");

        expect(movieLink?.getAttribute("href")).toBe("/movies");
        expect(seriesLink?.getAttribute("href")).toBe("/series");

        // Check background image
        const backgroundImage = screen.getByTestId("mock-image");
        expect(backgroundImage.getAttribute("data-src")).toBe("/images/backgrounds/netflix.png");
        expect(backgroundImage.getAttribute("data-alt")).toBe("Background Image");
    });

    it("contains the feature text", () => {
        renderWithTheme(<HomeHeroSection />);
        expect(screen.getByText("Featuring thousands of titles across all genres")).toBeDefined();
    });

    it("has proper button styling and content", () => {
        renderWithTheme(<HomeHeroSection />);

        const exploreMoviesButton = screen.getByText("Explore Movies").closest("a");
        const browseSeriesButton = screen.getByText("Browse Series").closest("a");

        // Check that buttons have the correct icons (indirectly through parent elements)
        expect(exploreMoviesButton?.innerHTML).toContain("PlayArrowIcon");
        expect(browseSeriesButton?.innerHTML).toContain("TvIcon");
    });
});
