import type IGenre from "./IGenre";
import type IMovie from "./IMovie";

export default interface IMovieGenre {
    id?: number;
    movieId: number;
    genreId: number;
    movie?: IMovie[];
    genre?: IGenre[];
}
