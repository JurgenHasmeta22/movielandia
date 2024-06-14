import type ISerie from "./ISerie";

export default interface ISeriesResponse {
    count: number;
    rows: ISerie[];
}
