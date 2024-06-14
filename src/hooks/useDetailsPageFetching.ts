import movieService from "~/services/api/movieService";
import serieService from "~/services/api/serieService";
import { useStore } from "~/store/store";

export function useDetailsPageFetching({ params, type, page, sortBy, ascOrDesc }: any) {
    const {
        selectedReview,
        setSelectedReview,
        listModalDataType,
        upvotesPageModal,
        downvotesPageModal,
        setHasMoreDownvotesModal,
        setHasMoreUpvotesModal,
        user,
    } = useStore();

    const fetchDetailData = async () => {
        let response;
        const queryParams: any = { page };

        if (sortBy) {
            queryParams.sortBy = sortBy;
        }

        if (ascOrDesc) {
            queryParams.ascOrDesc = ascOrDesc;
        }

        if (upvotesPageModal !== 1) {
            queryParams.upvotesPage = upvotesPageModal;
        }

        if (downvotesPageModal !== 1) {
            queryParams.downvotesPage = downvotesPageModal;
        }

        if (user) {
            queryParams.userId = user?.id;
        }

        if (type === "movie") {
            response = await movieService.getMovieByTitle(params?.title!, queryParams);
        } else {
            response = await serieService.getSerieByTitle(params?.title!, queryParams);
        }

        if (selectedReview) {
            const reviewItem = response?.reviews?.find((item: any) => item.id === selectedReview.id);

            if (reviewItem) {
                if (listModalDataType === "upvotes") {
                    const hasMoreUpvotes = reviewItem?._count?.upvotes! !== reviewItem?.upvotes?.length;

                    setHasMoreUpvotesModal(hasMoreUpvotes);
                    setSelectedReview(reviewItem);
                } else if (listModalDataType === "downvotes") {
                    const hasMoreDownvotes = reviewItem?._count?.downvotes! !== reviewItem?.downvotes?.length;

                    setHasMoreDownvotesModal(hasMoreDownvotes);
                    setSelectedReview(reviewItem);
                }
            }
        }

        return response;
    };

    return {
        fetchDetailData,
    };
}
