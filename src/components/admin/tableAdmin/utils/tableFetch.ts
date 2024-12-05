import { getActorsWithFilters } from "@/actions/actor.actions";
import { getCrewMembersWithFilters } from "@/actions/crew.actions";
import { getEpisodesWithFilters } from "@/actions/episode.actions";
import { getGenresWithFilters } from "@/actions/genre.actions";
import { getMoviesWithFilters } from "@/actions/movie.actions";
import { getSeasonsWithFilters } from "@/actions/season.actions";
import { getSeriesWithFilters } from "@/actions/serie.actions";
import { getUsersWithFilters } from "@/actions/user.actions";

interface QueryParams {
    page: number;
    pageSize: number;
    ascOrDesc?: "asc" | "desc";
    sortBy?: string;
    filterNameString?: string;
    filterValue?: string;
}

interface FetchDataProps {
    page: string;
    pagination: { pageIndex: number; pageSize: number };
    sorting: { desc: boolean; id: string }[];
    globalFilter: string;
    setRows: (rows: any[]) => void;
    setRowsCount: (count: number) => void;
    setIsError: (error: boolean) => void;
    setIsLoading: (loading: boolean) => void;
    setIsRefetching: (refetching: boolean) => void;
}

export const fetchData = async ({
    page,
    pagination,
    sorting,
    globalFilter,
    setRows,
    setRowsCount,
    setIsError,
    setIsLoading,
    setIsRefetching,
}: FetchDataProps) => {
    try {
        const queryParams: QueryParams = {
            page: Number(pagination?.pageIndex + 1),
            pageSize: Number(pagination?.pageSize),
            ...(sorting?.length > 0 && {
                ascOrDesc: sorting[0].desc ? "desc" : "asc",
                sortBy: sorting[0].id,
            }),
            ...(globalFilter?.length > 0 && {
                filterNameString:
                    page === "users"
                        ? "userName"
                        : page === "genres"
                          ? "name"
                          : page === "actors"
                            ? "name"
                            : page === "crew"
                              ? "fullname"
                              : "title",
                filterValue: globalFilter,
            }),
        };

        let response: any;

        switch (page) {
            case "series":
                response = await getSeriesWithFilters(queryParams);
                setRows(response.rows);
                setRowsCount(response.count);
                break;
            case "movies":
                response = await getMoviesWithFilters(queryParams);
                setRows(response.movies);
                setRowsCount(response.count);
                break;
            case "genres":
                response = await getGenresWithFilters(queryParams);
                setRows(response.rows);
                setRowsCount(response.count);
                break;
            case "users":
                response = await getUsersWithFilters(queryParams);
                setRows(response.rows);
                setRowsCount(response.count);
                break;
            case "actors":
                response = await getActorsWithFilters(queryParams);
                setRows(response.actors);
                setRowsCount(response.count);
                break;
            case "episodes":
                response = await getEpisodesWithFilters(queryParams);
                setRows(response.episodes);
                setRowsCount(response.count);
                break;
            case "seasons":
                response = await getSeasonsWithFilters(queryParams);
                setRows(response.seasons);
                setRowsCount(response.count);
                break;
            case "crews":
                response = await getCrewMembersWithFilters(queryParams);
                setRows(response.crewMembers);
                setRowsCount(response.count);
                break;
            default:
                response = { rows: [], count: 0 };
        }

        setIsError(false);
    } catch (error) {
        setIsError(true);
        console.error(error);
    } finally {
        setIsLoading(false);
        setIsRefetching(false);
    }
};
