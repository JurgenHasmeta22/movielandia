import type ISerie from "./ISerie";

export default interface IEpisode {
    id?: number;
    title: string;
    photoSrc: string;
    videoSrc: string;
    description: string;
    serieId: number;
    serie: ISerie;
}
