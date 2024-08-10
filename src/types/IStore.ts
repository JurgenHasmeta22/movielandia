export default interface AppStoreState {
    isOpenSidebarAdmin: boolean;
    setIsOpenSidebarAdmin: (data: boolean) => void;

    isDrawerOpen: boolean;
    setIsDrawerOpen: (data: boolean) => void;

    selectedReview: any;
    setSelectedReview: (data: any) => void;

    upvotesPageModal: number;
    setUpvotesPageModal: (data: number) => void;

    downvotesPageModal: number;
    setDownvotesPageModal: (data: number) => void;

    hasMoreUpvotesModal: boolean;
    setHasMoreUpvotesModal: (data: boolean) => void;

    hasMoreDownvotesModal: boolean;
    setHasMoreDownvotesModal: (data: boolean) => void;

    listModalDataType: string | null;
    setListModalDataType: (data: string | null) => void;

    isEditModeReview: boolean;
    setIsEditModeReview: (data: boolean) => void;
}
