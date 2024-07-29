import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import NotFoundDynamicPage from "../NotFoundDynamicPage"; // Adjust the import path accordingly

// Mock usePathname from next/navigation
jest.mock("next/navigation", () => ({
    usePathname: jest.fn(),
}));

describe("NotFoundDynamicPage", () => {
    it("renders 404 page with correct texts and link", () => {
        // Mock the return value of usePathname
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mockedUsePathname = require("next/navigation").usePathname;
        mockedUsePathname.mockReturnValue("/test-path");

        render(<NotFoundDynamicPage />);

        // Check for the main header
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("404");

        // Check for the secondary header
        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Ooops, page not found.");

        // Check for the paragraph text
        expect(
            screen.getByText("The page you are looking for might have been removed, or is temporarily unavailable."),
        ).toBeInTheDocument();

        // Check for the link
        const link = screen.getByRole("link", { name: /go back to \/test-path/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/");
    });
});
