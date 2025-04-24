"use server";

import { prisma } from "../../../prisma/config/prisma";
import { revalidatePath } from "next/cache";
import { getReferer } from "../user/user.actions";

interface SharedListsParams {
	page?: number;
	perPage?: number;
	sortBy?: string;
	ascOrDesc?: string;
}

export async function getSharedLists(
	userId: number,
	params: SharedListsParams = {},
) {
	const {
		page = 1,
		perPage = 12,
		sortBy = "createdAt",
		ascOrDesc = "desc",
	} = params;

	const skip = (page - 1) * perPage;

	try {
		const [lists, total] = await prisma.$transaction([
			prisma.list.findMany({
				where: {
					sharedWith: {
						some: {
							userId,
						},
					},
				},
				orderBy: { [sortBy]: ascOrDesc },
				skip,
				take: perPage,
				include: {
					user: {
						select: {
							id: true,
							userName: true,
							avatar: true,
						},
					},
					_count: {
						select: {
							movieItems: true,
							serieItems: true,
							seasonItems: true,
							episodeItems: true,
							actorItems: true,
							crewItems: true,
						},
					},
					sharedWith: {
						where: {
							userId,
						},
						include: {
							user: {
								select: {
									id: true,
									userName: true,
									avatar: true,
								},
							},
						},
					},
				},
			}),
			prisma.list.count({
				where: {
					sharedWith: {
						some: {
							userId,
						},
					},
				},
			}),
		]);

		return {
			items: lists,
			total,
			success: true,
		};
	} catch (error) {
		console.error("Failed to fetch shared lists:", error);

		return {
			items: [],
			total: 0,
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to fetch shared lists",
		};
	}
}

export async function getRecentSharedLists(userId: number, limit: number = 5) {
	try {
		const lists = await prisma.list.findMany({
			where: {
				sharedWith: {
					some: {
						userId,
					},
				},
			},
			orderBy: { updatedAt: "desc" },
			take: limit,
			include: {
				user: {
					select: {
						id: true,
						userName: true,
						avatar: true,
					},
				},
				_count: {
					select: {
						movieItems: true,
						serieItems: true,
						seasonItems: true,
						episodeItems: true,
						actorItems: true,
						crewItems: true,
					},
				},
				sharedWith: {
					where: {
						userId,
					},
				},
			},
		});

		return {
			items: lists,
			success: true,
		};
	} catch (error) {
		console.error("Failed to fetch recent shared lists:", error);

		return {
			items: [],
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to fetch recent shared lists",
		};
	}
}
