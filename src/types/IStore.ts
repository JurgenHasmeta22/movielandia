export default interface AppStoreState {
    isOpenSidebarAdmin: boolean | any;
    setIsOpenSidebarAdmin: (data: any) => void;

    isDrawerOpen: boolean | any;
    setIsDrawerOpen: (data: any) => void;

    selectedReview: any;
    setSelectedReview: (data: any) => void;

    upvotesPageModal: number;
    setUpvotesPageModal: (data: any) => void;

    downvotesPageModal: number;
    setDownvotesPageModal: (data: any) => void;

    hasMoreUpvotesModal: boolean;
    setHasMoreUpvotesModal: (data: any) => void;

    hasMoreDownvotesModal: boolean;
    setHasMoreDownvotesModal: (data: any) => void;

    listModalDataType: string | null;
    setListModalDataType: (data: string | null) => void;

    isEditModeReview: boolean;
    setIsEditModeReview: (data: boolean) => void;
}
