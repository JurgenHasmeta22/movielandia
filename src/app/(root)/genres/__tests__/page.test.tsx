import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { getGenres } from "@/lib/actions/genre.actions";
import { Genre } from "@prisma/client";
import Page from "../page";

// Mock the getGenres function
jest.mock("@/lib/actions/genre.actions", () => ({
    getGenres: jest.fn(),
}));

// Mock data for genres
const mockGenres: Genre[] = [
    { id: 1, name: "Action" },
    { id: 2, name: "Drama" },
    { id: 3, name: "Comedy" },
    { id: 4, name: "Horror" },
];

// Ensure getGenres returns mock data
(getGenres as jest.Mock).mockResolvedValue({ rows: mockGenres });

test("Genres Page", async () => {
    describe("renders genres correctly", async () => {
        render(<Page />);

        // Check if the heading is rendered
        expect(screen.getByText("Choose your favorite genre")).toBeInTheDocument();

        // Wait for the genres to be rendered
        const genreItems = await screen.findAllByRole("heading", { level: 6 });

        // Check if the correct number of genre items are rendered
        expect(genreItems).toHaveLength(mockGenres.length);

        // Check if the genre names are rendered correctly
        mockGenres.forEach((genre) => {
            expect(screen.getByText(genre.name)).toBeInTheDocument();
        });
    });
});
