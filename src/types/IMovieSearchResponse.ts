import type IMovie from "./IMovie";

export default interface IMoviesSearchResponse {
    count: number;
    movies: IMovie[];
}
