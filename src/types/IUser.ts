import type IComment from "./IComment";
import type IMovie from "./IMovie";
import ISerie from "./ISerie";

export default interface IUser {
    id?: number;
    userName: string;
    email: string;
    password: string;
    serieReviews?: any[];
    movieReviews?: any[];
    favMovies?: IMovie[];
    favSeries?: ISerie[];
}
