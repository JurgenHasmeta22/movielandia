"use client";

import AppStoreState from "@/types/IStore";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useStore = create<AppStoreState>()(
    devtools(
        (set): AppStoreState => ({
            isOpenSidebarAdmin: true,
            setIsOpenSidebarAdmin: (data) => set({ isOpenSidebarAdmin: data }),

            isDrawerOpen: false,
            setIsDrawerOpen: (data) => set({ isDrawerOpen: data }),

            selectedReview: null,
            setSelectedReview: (data) => set({ selectedReview: data }),

            hasMoreUpvotesModal: true,
            setHasMoreUpvotesModal: (data) => set({ hasMoreUpvotesModal: data }),

            hasMoreDownvotesModal: true,
            setHasMoreDownvotesModal: (data) => set({ hasMoreDownvotesModal: data }),

            upvotesPageModal: 1,
            setUpvotesPageModal: (data) => set({ upvotesPageModal: data }),

            downvotesPageModal: 1,
            setDownvotesPageModal: (data) => set({ downvotesPageModal: data }),

            listModalDataType: null,
            setListModalDataType: (data) => set({ listModalDataType: data }),

            isEditModeReview: false,
            setIsEditModeReview: (data) => set({ isEditModeReview: data }),
        }),
    ),
);
