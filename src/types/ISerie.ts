import type IEpisode from "./IEpisode";
import IGenre from "./IGenre";

export default interface ISerie {
    id?: number;
    title: string;
    photoSrc: string;
    trailerSrc: string;
    description: string;
    releaseYear: number;
    ratingImdb: number;
    totalReviews?: number;
    averageRating: number;
    isBookmarked: boolean;
    isReviewed: boolean;
    episodes: IEpisode[];
    genres: IGenre[];
    reviews?: any[];
}
