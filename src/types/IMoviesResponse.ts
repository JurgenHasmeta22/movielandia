import type IMovie from "./IMovie";

export default interface IMoviesResponse {
    count: number;
    movies: IMovie[];
}
