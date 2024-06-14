import { create } from "zustand";
import type AppStoreState from "~/types/IStore";
import { devtools, persist } from "zustand/middleware";

export const useStore = create<AppStoreState>()(
    devtools(
        persist(
            (set, get): AppStoreState => ({
                user: null,
                setUser: (data) => {
                    set({ user: data });
                },
                isUserLoading: true,
                setIsUserLoading: (data) => {
                    set({ isUserLoading: data });
                },
                mobileOpen: window.innerWidth < 768 ? true : false,
                setMobileOpen: (data) => {
                    set({ mobileOpen: data });
                },
                isPageShrunk: window.innerWidth < 768 ? true : false,
                setIsPageShrunk: (data) => {
                    set({ isPageShrunk: data });
                },
                isOpenSidebarAdmin: true,
                setIsOpenSidebarAdmin: (data) => {
                    set({ isOpenSidebarAdmin: data });
                },
                openDrawer: false,
                setOpenDrawer: (data) => {
                    set({ openDrawer: data });
                },
                selectedReview: null,
                setSelectedReview: (data) => {
                    set({ selectedReview: data });
                },
                hasMoreUpvotesModal: true,
                setHasMoreUpvotesModal: (data) => {
                    set({ hasMoreUpvotesModal: data });
                },
                hasMoreDownvotesModal: true,
                setHasMoreDownvotesModal: (data) => {
                    set({ hasMoreDownvotesModal: data });
                },
                upvotesPageModal: 1,
                setUpvotesPageModal: (data) => {
                    set({ upvotesPageModal: data });
                },
                downvotesPageModal: 1,
                setDownvotesPageModal: (data) => {
                    set({ downvotesPageModal: data });
                },
                listModalDataType: null,
                setListModalDataType: (data) => {
                    set({ listModalDataType: data });
                },
            }),
            {
                name: "appStore-localStorage",
            },
        ),
    ),
);
