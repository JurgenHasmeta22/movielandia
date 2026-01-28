import { describe, it, expect, vi, beforeEach } from "vitest";
import { reorderListItems } from "./listReorder.actions";
import { prisma } from "../../../prisma/config/prisma";
import { revalidatePath } from "next/cache";
import { ContentType } from "../../../prisma/generated/prisma/enums";

vi.mock("../../../prisma/config/prisma", () => ({
	prisma: {
		list: {
			findFirst: vi.fn(),
		},
		listMovie: {
			update: vi.fn(),
		},
		listSerie: {
			update: vi.fn(),
		},
		listSeason: {
			update: vi.fn(),
		},
		listEpisode: {
			update: vi.fn(),
		},
		listActor: {
			update: vi.fn(),
		},
		listCrew: {
			update: vi.fn(),
		},
		listActivityMovie: {
			create: vi.fn(),
		},
		listActivitySerie: {
			create: vi.fn(),
		},
		listActivitySeason: {
			create: vi.fn(),
		},
		listActivityEpisode: {
			create: vi.fn(),
		},
		listActivityActor: {
			create: vi.fn(),
		},
		listActivityCrew: {
			create: vi.fn(),
		},
		$transaction: vi
			.fn()
			.mockImplementation((updates) => Promise.all(updates)),
	},
}));

vi.mock("next/cache", () => ({
	revalidatePath: vi.fn(),
}));

vi.mock("../user/user.actions", () => ({
	getReferer: vi.fn().mockReturnValue("/test-path"),
}));

describe("reorderListItems", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		(prisma.list.findFirst as any).mockResolvedValue({
			id: 1,
			name: "Test List",
			userId: 1,
		});
	});

	it("should reorder movie items successfully", async () => {
		const params = {
			listId: 1,
			userId: 1,
			type: "movie" as ContentType,
			items: [
				{ id: 1, orderIndex: 0 },
				{ id: 2, orderIndex: 1 },
			],
		};

		await reorderListItems(params);

		expect(prisma.list.findFirst).toHaveBeenCalledWith({
			where: {
				id: 1,
				OR: [
					{ userId: 1 },
					{ sharedWith: { some: { userId: 1, canEdit: true } } },
				],
			},
		});

		expect(prisma.$transaction).toHaveBeenCalled();
		expect(prisma.listMovie.update).toHaveBeenCalledTimes(2);
		expect(prisma.listMovie.update).toHaveBeenCalledWith({
			where: {
				listId_movieId: {
					listId: 1,
					movieId: 1,
				},
			},
			data: {
				orderIndex: 0,
			},
		});
		expect(prisma.listMovie.update).toHaveBeenCalledWith({
			where: {
				listId_movieId: {
					listId: 1,
					movieId: 2,
				},
			},
			data: {
				orderIndex: 1,
			},
		});

		expect(prisma.listActivityMovie.create).toHaveBeenCalledWith({
			data: {
				listId: 1,
				userId: 1,
				movieId: 1,
				actionType: "Updated",
				metadata: { action: "reordered_items" },
			},
		});

		expect(revalidatePath).toHaveBeenCalledWith("/test-path", "page");
	});

	it("should throw an error if the list is not found", async () => {
		(prisma.list.findFirst as any).mockResolvedValue(null);

		const params = {
			listId: 1,
			userId: 1,
			type: "movie" as ContentType,
			items: [
				{ id: 1, orderIndex: 0 },
				{ id: 2, orderIndex: 1 },
			],
		};

		await expect(reorderListItems(params)).rejects.toThrow(
			"List not found or you don't have permission to edit",
		);
	});
});
