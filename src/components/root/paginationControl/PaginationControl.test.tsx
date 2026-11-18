import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PaginationControl from "./PaginationControl";

vi.mock("nuqs", () => ({
	useQueryState: () => ["1", vi.fn()],
}));

describe("PaginationControl", () => {
	it.each([0, 1])("hides pagination when page count is %i", (pageCount) => {
		render(<PaginationControl currentPage={1} pageCount={pageCount} />);

		expect(screen.queryByRole("navigation")).toBeNull();
	});

	it("shows pagination when multiple pages are available", () => {
		render(<PaginationControl currentPage={1} pageCount={2} />);

		expect(screen.getByRole("navigation")).toBeTruthy();
	});
});
