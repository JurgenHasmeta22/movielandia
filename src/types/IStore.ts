export default interface AppStoreState {
    isOpenSidebarAdmin: boolean;
    setIsOpenSidebarAdmin: (data: boolean) => void;

    isDrawerOpen: boolean;
    setIsDrawerOpen: (data: boolean) => void;

    isEditModeReview: boolean;
    setIsEditModeReview: (data: boolean) => void;
}
