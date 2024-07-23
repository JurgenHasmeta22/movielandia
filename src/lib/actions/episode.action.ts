"use server";

import { Episode, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma/prisma";

interface EpisodeModelParams {
    sortBy: string;
    ascOrDesc: "asc" | "desc";
    perPage: number;
    page: number;
    title?: string | null;
    filterValue?: number | string;
    filterNameString?: string | null;
    filterOperatorString?: ">" | "=" | "<" | "gt" | "equals" | "lt";
}

export async function getEpisodes({
    sortBy,
    ascOrDesc,
    perPage,
    page,
    title,
    filterValue,
    filterNameString,
    filterOperatorString,
}: EpisodeModelParams): Promise<Episode[] | null> {
    const filters: any = {};
    const skip = perPage ? (page ? (page - 1) * perPage : 0) : page ? (page - 1) * 20 : 0;
    const take = perPage || 20;

    if (title) filters.title = { contains: title };

    if (filterValue !== undefined && filterNameString && filterOperatorString) {
        const operator = filterOperatorString === ">" ? "gt" : filterOperatorString === "<" ? "lt" : "equals";
        filters[filterNameString] = { [operator]: filterValue };
    }

    const orderByObject: any = {};

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    }

    const episodes = await prisma.episode.findMany({
        where: filters,
        orderBy: orderByObject,
        skip,
        take,
    });

    if (episodes) {
        return episodes;
    } else {
        return null;
    }
}

export async function getEpisodeById(episodeId: number): Promise<Episode | null> {
    const result = await prisma.episode.findFirst({
        where: { id: episodeId },
    });

    if (result) {
        return result;
    } else {
        return null;
    }
}

export async function getEpisodeByTitle(title: string): Promise<Episode | null> {
    const result = await prisma.episode.findFirst({
        where: { title },
    });

    if (result) {
        return result;
    } else {
        return null;
    }
}

export async function updateEpisodeById(episodeParam: Prisma.EpisodeUpdateInput, id: string): Promise<Episode | null> {
    const episode: Episode | null = await prisma.episode.findUnique({
        where: { id: Number(id) },
    });

    if (episode) {
        const episodeUpdated = await prisma.episode.update({
            where: { id: Number(id) },
            data: episodeParam,
        });

        if (episodeUpdated) {
            return episodeUpdated;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function addEpisode(episodeParam: Episode): Promise<Episode | null> {
    const episodeCreated = await prisma.episode.create({
        data: episodeParam,
    });

    if (episodeCreated) {
        return episodeCreated;
    } else {
        return null;
    }
}

export async function deleteEpisodeById(id: number): Promise<string | null> {
    const episode: Episode | null = await prisma.episode.findUnique({
        where: { id },
    });

    if (episode) {
        const result = await prisma.episode.delete({
            where: { id },
        });

        if (result) {
            return "Episode deleted successfully";
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function searchEpisodesByTitle(title: string, page: number): Promise<Episode[] | null> {
    const query = {
        where: {
            title: { contains: title },
        },
        skip: page ? (page - 1) * 20 : 0,
        take: 20,
    };

    const episodes = await prisma.episode.findMany(query);

    if (episodes) {
        return episodes;
    } else {
        return null;
    }
}
