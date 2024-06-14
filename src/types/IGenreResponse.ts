import IMovie from "./IMovie";

export default interface IGenreResponse {
    count: number;
    rows: IMovie[];
}
