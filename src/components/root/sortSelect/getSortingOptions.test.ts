import { describe, expect, it } from "vitest";
import { getSortOptions } from "./getSortingOptions";

describe("getSortOptions", () => {
	it("offers only sortable fields for lists", () => {
		const options = getSortOptions("lists", "lists");

		expect(options.map(({ value }) => value)).toEqual([
			"createdAt",
			"name",
		]);
	});
});
