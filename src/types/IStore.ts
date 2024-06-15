import type IUser from "./IUser";

export default interface AppStoreState {
    user: IUser | null;
    setUser: (data: IUser | null) => void;
    isUserLoading: boolean;
    setIsUserLoading: (data: boolean) => void;
    mobileOpen: boolean | any;
    setMobileOpen: (data: any) => void;
    isPageShrunk: boolean | any;
    setIsPageShrunk: (data: any) => void;
    isOpenSidebarAdmin: boolean | any;
    setIsOpenSidebarAdmin: (data: any) => void;
    openDrawer: boolean | any;
    setOpenDrawer: (data: any) => void;
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
}
