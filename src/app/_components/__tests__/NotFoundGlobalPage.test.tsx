import React from "react";
import NotFoundGlobalPage from "../NotFoundGlobalPage";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

test("renders 404 page with correct texts and link", () => {
    render(<NotFoundGlobalPage />);

    // Check for the main header
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("404");

    // Check for the secondary header
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Ooops, page not found.");

    // Check for the paragraph text
    expect(
        screen.getByText("The page you are looking for might have been removed, or is temporarily unavailable."),
    ).toBeInTheDocument();

    // Check for the link
    const link = screen.getByRole("link", { name: /go back home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
});
