import { describe, it, expect, vi, beforeEach } from "vitest";
import { reorderListItems } from "./listReorder.actions";
import { prisma } from "../../../prisma/config/prisma";
import { revalidatePath } from "next/cache";
import { ContentType } from "@prisma/client";

// Mock the prisma client
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
    $transaction: vi.fn().mockImplementation((updates) => Promise.all(updates)),
  },
}));

// Mock the next/cache module
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock the getReferer function
vi.mock("../user/user.actions", () => ({
  getReferer: vi.fn().mockReturnValue("/test-path"),
}));

describe("reorderListItems", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the list findFirst to return a valid list
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

    // Check if the list was found
    expect(prisma.list.findFirst).toHaveBeenCalledWith({
      where: {
        id: 1,
        OR: [
          { userId: 1 },
          { sharedWith: { some: { userId: 1, canEdit: true } } },
        ],
      },
    });

    // Check if the transaction was called with the correct updates
    expect(prisma.$transaction).toHaveBeenCalled();

    // Check if the movie items were updated
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

    // Check if the activity was logged
    expect(prisma.listActivityMovie.create).toHaveBeenCalledWith({
      data: {
        listId: 1,
        userId: 1,
        movieId: 1,
        actionType: "Updated",
        metadata: { action: "reordered_items" },
      },
    });

    // Check if the path was revalidated
    expect(revalidatePath).toHaveBeenCalledWith("/test-path", "page");
  });

  it("should throw an error if the list is not found", async () => {
    // Mock the list findFirst to return null
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
      "List not found or you don't have permission to edit"
    );
  });
});
